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
} from '../features/ShoppingSlice'
import type { ShoppingItem } from '../features/ShoppingSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
      <h1 style={{ textAlign: 'center', marginBottom: 24, marginTop: 24, }}>Welcome{user ? `, ${user.name}` : ''}!</h1> 
      <p style={{ textAlign: 'center', marginBottom: 24, marginTop: 24,}}>Manage your shopping lists below.</p>
      
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

    <div style={{display:'flex', flexDirection: 'row'}}>
      <div className='search'>
      </div>

      <section aria-labelledby="lists-heading" style={{ marginBottom: 24,padding:'10px', width:'50%'
      }}>
        <h2 id="lists-heading" className="update">Shopping Lists</h2>
        
        <div className='addList' style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }}>
          {filteredLists.map((l) => (
            <button
              key={l.id}
              onClick={() => { dispatch(selectList({ id: l.id })) }}
              aria-pressed={selectedList?.id === l.id}
              style={{
                width: 200,
                textAlign: 'left',
                border: selectedList?.id === l.id ? '2px solid deepskyblue' : '1px solid #ddd',
                background: '#fff',
                color: 'black',
                padding: 0,
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              {l.coverImage ? (
                <img src={l.coverImage} alt={`${l.name} cover`} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 100, background: '#f3f4f6' }} />
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 700 }}>{l.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{l.items.length} items</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            aria-label="New list name"
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="input-login"
          />
          <input style={{ display: 'flex', gap: 8, marginTop: 12}}
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
          />
          <button className='addListBtn' onClick={onCreateList}>Add List</button>
          {selectedList && (
            <>
              <input
                aria-label="Rename selected list"
                placeholder={`Rename: ${selectedList.name}`}
                value={editingListName}
                onChange={(e) => setEditingListName(e.target.value)}
                className="input-login"
              />
              <button  className='addListBtn' onClick={onRenameList}>Rename</button>
              <button  className='addListBtn' onClick={() => onDeleteList(selectedList.id)}>Delete List</button>
            </>
          )}
        </div>
        {newListImage && (
          <div style={{ marginTop: 8 }}>
            <img src={newListImage} alt="New list cover preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
          </div>
        )}
         <div className='shareLogout' style={{marginLeft: 'auto'}} >
        <button className='shareBtn' onClick={onShare} aria-label="Share current list" title="Share" >

          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11A3.003 3.003 0 0 0 18 7.91c1.66 0 3-1.34 3-3S19.66 1.91 18 1.91 15 3.25 15 4.91c0 .24.04.47.09.7L8.07 9.72A3.003 3.003 0 0 0 6 8.91c-1.66 0-3 1.34-3 3s1.34 3 3 3c.9 0 1.71-.4 2.25-1.03l7.1 4.15c-.03.15-.05.31-.05.47 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
        </div>
      </section>



     <div style={{padding:'10px',width:'50%' }}>  
      <section aria-labelledby="add-item-heading" className="container-profile" style={{ marginBottom: 24, marginLeft:'10px', width:'100%' }}>
        <h2 id="add-item-heading">Add Item</h2>
        <div className='addList' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
          <div>
            <label htmlFor="item-name">Name</label>
            <input
              id="item-name"
              value={itemDraft.name}
              onChange={(e) => setItemDraft((p) => ({ ...p, name: e.target.value }))}
              className="input-login"
            />
          </div>
          <div>
            <label htmlFor="item-qty">Quantity</label>
            <input
              id="item-qty"
              type="number"
              min={1}
              value={itemDraft.quantity}
              onChange={(e) => setItemDraft((p) => ({ ...p, quantity: Number(e.target.value) }))}
              className="input-login"
            />
          </div>
          <div>
            <label htmlFor="item-notes">Notes</label>
            <input
              id="item-notes"
              value={itemDraft.notes}
              onChange={(e) => setItemDraft((p) => ({ ...p, notes: e.target.value }))}
              className="input-login"
            />
          </div>
          <div>
            <label htmlFor="item-category">Category</label>
            <input
              id="item-category"
              value={itemDraft.category}
              onChange={(e) => setItemDraft((p) => ({ ...p, category: e.target.value }))}
              className="input-login"
            />
          </div>
          <div>
            <label htmlFor="item-images"></label>
            <input id="item-images" type="file" accept="image/*" multiple onChange={onFilesChange} ref={fileRef} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className='addItem' onClick={onAddItem} disabled={!selectedList}>Add Item</button>
        </div>
        {itemDraft.images.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }} aria-label="Preview images">
            {itemDraft.images.map((src, idx) => (
              <img key={idx} src={src} alt={`preview ${idx + 1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="items-heading" >
        <h2 id="items-heading" className="update">Items {selectedList ? `in ${selectedList.name}` : ''}</h2>
         <div>
          <label htmlFor="sort" style={{ marginRight: 8 }}>Sort</label>
          <select
            id="sort"
            aria-label="Sort items"
            value={sortParam}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="date">Date added</option>
          </select>
        </div>
        {filteredAndSorted.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0, border: '1px solid black'}}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Item</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Quantity</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Notes</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Added</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Images</th>
                  <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid black' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((i) => (
                  <tr key={i.id}>
                    <td style={{ padding: 8 }}><strong>{i.name}</strong></td>
                    <td style={{ padding: 8 }}>{i.quantity}</td>
                    <td style={{ padding: 8 }}>{i.category || '—'}</td>
                    <td style={{ padding: 8 }}>{i.notes || '—'}</td>
                    <td style={{ padding: 8 }}>{new Date(i.createdAt).toLocaleString()}</td>
                    <td style={{ padding: 8 }}>
                      {i.images?.length ? (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {i.images.map((src, idx) => (
                            <img key={idx} src={src} alt={`${i.name} ${idx + 1}`} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                          ))}
                        </div>
                      ) : '—'}
                    </td>
                    <td style={{ padding: 8 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            const name = prompt('Edit name', i.name) ?? i.name
                            const quantity = Number((prompt('Edit quantity', String(i.quantity)) ?? i.quantity))
                            const notes = prompt('Edit notes', i.notes ?? '') ?? i.notes
                            const category = prompt('Edit category', i.category ?? '') ?? i.category
                            dispatch(updateItem({ listId: selectedList!.id, itemId: i.id, changes: { name, quantity, notes: notes || undefined, category } }))
                          }}
                          aria-label={`Edit ${i.name}`} style={{ cursor: 'pointer', }}
                        >Edit</button>
                        <button onClick={() => dispatch(deleteItem({ listId: selectedList!.id, itemId: i.id }))} aria-label={`Delete ${i.name}`} style={{ cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </div>  
    </div>
    </div>
  )
}
