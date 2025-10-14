import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { logout } from '../features/RegisterSlice'
import {
  addItem,
  createList,
  deleteItem,
  deleteList,
  renameList,
  selectList,
  updateItem,
  fetchLists,
} from '../features/HomeSlice'
import type { ShoppingItem } from '../features/HomeSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type SortKey = 'name' | 'category' | 'date'

function readFilesAsDataUrls(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return Promise.resolve([])
  const readers = Array.from(files).map(
    (file) =>
      new Promise<string>((resolve) => {
        const fr = new FileReader()
        fr.onload = () => resolve(String(fr.result))
        fr.readAsDataURL(file)
      })
  )
  return Promise.all(readers)
}

export default function Home() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.register.user)
  const { lists, selectedListId } = useAppSelector((s) => s.shopping)

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const sortParam = (searchParams.get('sort') ?? 'date') as SortKey
  const shareParam = searchParams.get('share')

  const selectedList = useMemo(
    () => lists.find((l) => l.id === selectedListId) ?? lists[0],
    [lists, selectedListId]
  )

  // Filter lists by list name or any item fields (name, category, notes)
  const filteredLists = useMemo(() => {
    if (!q) return lists
    const ql = q.toLowerCase()
    return lists.filter((l) => {
      const inListName = l.name.toLowerCase().includes(ql)
      const inItems = l.items?.some((i) => (
        (i.name || '').toLowerCase().includes(ql) ||
        (i.category || '').toLowerCase().includes(ql) ||
        (i.notes || '').toLowerCase().includes(ql)
      ))
      return inListName || inItems
    })
  }, [lists, q])

  // Fetch lists for the logged-in user
  useEffect(() => {
    const email = user?.email
    if (email) {
      dispatch(fetchLists({ userEmail: email }))
    }
  }, [dispatch, user?.email])

  useEffect(() => {
    if (selectedList && selectedListId !== selectedList.id) {
      dispatch(selectList({ id: selectedList.id }))
    }
  }, [dispatch, selectedList, selectedListId])

  // Share/import via URL
  useEffect(() => {
    if (!shareParam) return
    try {
      const json = atob(shareParam)
      const incoming = JSON.parse(json) as { name: string; items: Omit<ShoppingItem, 'id' | 'createdAt'>[] }
      if (incoming?.name && user?.email) {
        dispatch(createList({ name: `${incoming.name} (imported)`, userEmail: user.email }))
        const newListId = (lists[lists.length - 1]?.id) // may not yet include, fallback via timeout
        // Defer adding items to ensure list exists
        setTimeout(() => {
          const targetId = newListId || (document.body.dataset['lastListId'] ?? '')
          const finalId = targetId || (selectedList?.id ?? '')
          incoming.items?.forEach((i) =>
            dispatch(
              addItem({
                listId: finalId,
                item: {
                  name: i.name,
                  quantity: i.quantity,
                  notes: i.notes,
                  category: i.category,
                  images: i.images ?? [],
                },
              })
            )
          )
        }, 0)
      }
    } catch {
      // ignore malformed
    } finally {
      searchParams.delete('share')
      setSearchParams(searchParams, { replace: true })
    }
  }, [shareParam, dispatch, lists, searchParams, setSearchParams, selectedList])

  // Local UI state
  const [newListName, setNewListName] = useState('')
  const [editingListName, setEditingListName] = useState('')
  const [newListImage, setNewListImage] = useState<string | null>(null)
  const [itemDraft, setItemDraft] = useState({
    name: '',
    quantity: 1,
    notes: '',
    category: '',
    images: [] as string[],
  })
  const fileRef = useRef<HTMLInputElement | null>(null)
  const listCoverRef = useRef<HTMLInputElement | null>(null)



  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const onCreateList = () => {
    const name = newListName.trim()
    if (!name) return
    if (!user?.email) return alert('No user email found. Please log in again.')
    dispatch(createList({ name, userEmail: user.email, coverImage: newListImage ?? undefined }))
    setNewListName('')
    setNewListImage(null)
    if (listCoverRef.current) listCoverRef.current.value = ''
  }

  const onRenameList = () => {
    if (!selectedList) return
    const name = editingListName.trim()
    if (!name) return
    dispatch(renameList({ id: selectedList.id, name }))
    setEditingListName('')
  }

  const onDeleteList = (id: string | number) => {
    if (confirm('Delete this list?')) dispatch(deleteList({ id }))
  }

  const onAddItem = async () => {
    if (!selectedList) return
    const name = itemDraft.name.trim()
    if (!name) return
    dispatch(
      addItem({
        listId: selectedList.id,
        item: {
          name,
          quantity: Number(itemDraft.quantity) || 1,
          notes: itemDraft.notes.trim() || undefined,
          category: itemDraft.category.trim(),
          images: itemDraft.images,
        },
      })
    )
    setItemDraft({ name: '', quantity: 1, notes: '', category: '', images: [] })
    if (fileRef.current) fileRef.current.value = ''
  }

  const onFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const imgs = await readFilesAsDataUrls(e.target.files)
    setItemDraft((prev) => ({ ...prev, images: imgs }))
  }

  const filteredAndSorted = useMemo(() => {
    const items = selectedList?.items ?? []
    const ql = q.toLowerCase()
    const filtered = q
      ? items.filter((i) => (
          (i.name || '').toLowerCase().includes(ql) ||
          (i.category || '').toLowerCase().includes(ql) ||
          (i.notes || '').toLowerCase().includes(ql)
        ))
      : items
    const sorted = [...filtered].sort((a, b) => {
      if (sortParam === 'name') return a.name.localeCompare(b.name)
      if (sortParam === 'category') return a.category.localeCompare(b.category)
      // date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return sorted
  }, [selectedList, q, sortParam])

  const setQuery = (nextQ: string) => {
    const sp = new URLSearchParams(searchParams)
    if (nextQ) sp.set('q', nextQ)
    else sp.delete('q')
    setSearchParams(sp, { replace: true })
  }

  const setSort = (sort: SortKey) => {
    const sp = new URLSearchParams(searchParams)
    sp.set('sort', sort)
    setSearchParams(sp, { replace: true })
  }

  const onShare = () => {
    if (!selectedList) return
    const payload = {
      name: selectedList.name,
      items: selectedList.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        notes: i.notes,
        category: i.category,
        images: i.images,
      })),
    }
    const encoded = btoa(JSON.stringify(payload))
    const url = new URL(window.location.href)
    url.searchParams.set('share', encoded)
    navigator.clipboard?.writeText(url.toString())
    alert('Share URL copied to clipboard!')
  }

  return (
    
    <div className="containerHome" >
      <Navbar />
      <h1 className="home-header">Welcome{user ? `, ${user.name}` : ''}!</h1>
      <p className="home-subheader">Manage your shopping lists below.</p>
      
      <div className='searchBar'>
          <label htmlFor="search" className="sr-only">Search lists and items</label>
          <input
            id="search"
            aria-label="Search by list name, item name, category, or notes"
            placeholder="Search lists, items, categories, notes"
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            className="input-login"
          />
        </div>

    <div className="home-layout">
      <section aria-labelledby="lists-heading" className="lists-panel">
        <h2 id="lists-heading" className="update">Shopping Lists</h2>
        
        <div
          className="list-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'stretch',
          }}
        >
          {filteredLists.map((l) => (
            <button
              key={l.id}
              onClick={() => { dispatch(selectList({ id: l.id })); navigate(`/home/${l.id}`) }}
              aria-pressed={selectedList?.id === l.id}
              className={selectedList?.id === l.id ? 'list-card list-card--active' : 'list-card'}
              style={{
                height: '260px',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #eee',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fff',
                textAlign: 'left',
              }}
            >
              {l.coverImage ? (
                <img
                  src={l.coverImage}
                  alt={`${l.name} cover`}
                  className="list-card-cover"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', background: '#f3f4f6' }}
                />
              ) : (
                <div
                  className="list-card-cover"
                  style={{ width: '100%', height: '140px', background: '#f3f4f6' }}
                />
              )}
              <div
                className="list-card-body"
                style={{
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  flexGrow: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontWeight: 700 }}>{l.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{l.items.length} items</div>
              </div>
            </button>
          ))}
        </div>
        <div
          className="actions-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 12,
            alignItems: 'end',
            background: '#fff',
            border: '1px solid #eaeaea',
            borderRadius: 12,
            padding: 12,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            marginTop: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              aria-label="New list name"
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="input-login"
              style={{ flex: '1 1 260px' }}
            />
            <input
              ref={listCoverRef}
              type="file"
              accept="image/*"
              aria-label="List cover image"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) { setNewListImage(null); return }
                const reader = new FileReader()
                reader.onload = () => setNewListImage(String(reader.result))
                reader.readAsDataURL(f)
              }}
              style={{ flex: '1 1 260px' }}
            />
          </div>
          <button
            className='addListBtn'
            onClick={onCreateList}
            style={{ width: 'auto', padding: '12px 16px' }}
          >
            Add List
          </button>
        </div>

        {selectedList && (
          <div
            className="actions-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 12,
              alignItems: 'end',
              background: '#fff',
              border: '1px solid #eaeaea',
              borderRadius: 12,
              padding: 12,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              marginTop: 12,
            }}
          >
            <input
              aria-label="Rename selected list"
              placeholder={`Rename: ${selectedList.name}`}
              value={editingListName}
              onChange={(e) => setEditingListName(e.target.value)}
              className="input-login"
            />
            <button className='addListBtn' onClick={onRenameList} style={{ width: 'auto', padding: '12px 16px' }}>Rename</button>
            <button className='addListBtn' onClick={() => onDeleteList(selectedList.id)} style={{ width: 'auto', padding: '12px 16px' }}>Delete List</button>
          </div>
        )}
        {newListImage && (
          <div className="list-cover-preview">
            <img src={newListImage} alt="New list cover preview" />
          </div>
        )}
         <div className='shareLogout'>
        <button className='shareBtn' onClick={onShare} aria-label="Share current list" title="Share" >

          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11A3.003 3.003 0 0 0 18 7.91c1.66 0 3-1.34 3-3S19.66 1.91 18 1.91 15 3.25 15 4.91c0 .24.04.47.09.7L8.07 9.72A3.003 3.003 0 0 0 6 8.91c-1.66 0-3 1.34-3 3s1.34 3 3 3c.9 0 1.71-.4 2.25-1.03l7.1 4.15c-.03.15-.05.31-.05.47 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
        </div>
      </section>



     {/* Details moved to ListDetails page; Home shows only list selection. */}
    </div>
    <Footer />
    </div>
  )
}
