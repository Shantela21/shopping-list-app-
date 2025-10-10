import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  addItem,
  deleteItem,
  updateItem,
  selectList,
  fetchLists,
} from '../features/HomeSlice'
import type { ShoppingItem } from '../features/HomeSlice'

export default function ListDetails() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { listId } = useParams<{ listId: string }>()
  const user = useAppSelector((s) => s.register.user)
  const { lists } = useAppSelector((s) => s.shopping)

  // Ensure lists are loaded
  useEffect(() => {
    const email = user?.email
    if (email) dispatch(fetchLists({ userEmail: email }))
  }, [dispatch, user?.email])

  // Ensure store selection reflects route param
  useEffect(() => {
    if (listId) {
      dispatch(selectList({ id: listId }))
    }
  }, [dispatch, listId])

  const selectedList = useMemo(
    () => lists.find((l) => String(l.id) === String(listId)),
    [lists, listId]
  )

  // Local form state for adding items
  const [itemDraft, setItemDraft] = useState({
    name: '',
    quantity: 1,
    notes: '',
    category: '',
    images: [] as string[],
  })
  const fileRef = useRef<HTMLInputElement | null>(null)

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

  const onFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const imgs = await readFilesAsDataUrls(e.target.files)
    setItemDraft((prev) => ({ ...prev, images: imgs }))
  }

  const onAddItem = () => {
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

  const items = selectedList?.items ?? []

  return (
    <div className="containerHome">
      <Navbar />

      <div className="actions-row" style={{ padding: '0 16px' }}>
        <button onClick={() => navigate('/home')} className="addListBtn" style={{ width: 'auto' }}>
          ← Back to lists
        </button>
      </div>

      <h1 className="details-header">{selectedList ? selectedList.name : 'List'}</h1>
      <p className="details-subheader">Add items to your shopping list.</p>

      <div className="details-wrap">
        <section aria-labelledby="add-item-heading" className="container-profile" style={{ marginBottom: 24 }}>
          <h2 id="add-item-heading">Add Item</h2>
          <div className='addList' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
            <div>
              <label htmlFor="item-name">Name</label>
              <input id="item-name" value={itemDraft.name} onChange={(e) => setItemDraft((p) => ({ ...p, name: e.target.value }))} className="input-login" />
            </div>
            <div>
              <label htmlFor="item-qty">Quantity</label>
              <input id="item-qty" type="number" min={1} value={itemDraft.quantity} onChange={(e) => setItemDraft((p) => ({ ...p, quantity: Number(e.target.value) }))} className="input-login" />
            </div>
            <div>
              <label htmlFor="item-notes">Notes</label>
              <input id="item-notes" value={itemDraft.notes} onChange={(e) => setItemDraft((p) => ({ ...p, notes: e.target.value }))} className="input-login" />
            </div>
            <div>
              <label htmlFor="item-category">Category</label>
              <input id="item-category" value={itemDraft.category} onChange={(e) => setItemDraft((p) => ({ ...p, category: e.target.value }))} className="input-login" />
            </div>
            <div>
              <label htmlFor="item-images"></label>
              <input id="item-images" type="file" accept="image/*" multiple onChange={onFilesChange} ref={fileRef} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className='addItem' onClick={onAddItem} disabled={!selectedList}>Add Item</button>
          </div>
        </section>

        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="update">Items {selectedList ? `in ${selectedList.name}` : ''}</h2>
          {items.length === 0 ? (
            <p>No items yet. Add your first one above.</p>
          ) : (
            <div className='tableWrap'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Notes</th>
                    <th>Added</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td><strong>{i.name}</strong></td>
                      <td>{i.quantity}</td>
                      <td>{i.category || '—'}</td>
                      <td>{i.notes || '—'}</td>
                      <td>{new Date(i.createdAt).toLocaleString()}</td>
                      <td>
                        {i.images?.length ? (
                          <div className='itemThumbs'>
                            {i.images.map((src, idx) => (
                              <img key={idx} src={src} alt={`${i.name} ${idx + 1}`} className='itemThumb' />
                            ))}
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        <div className='itemActions'>
                          <button
                            onClick={() => {
                              const name = prompt('Edit name', i.name) ?? i.name
                              const quantity = Number((prompt('Edit quantity', String(i.quantity)) ?? i.quantity))
                              const notes = prompt('Edit notes', i.notes ?? '') ?? i.notes
                              const category = prompt('Edit category', i.category ?? '') ?? i.category
                              dispatch(updateItem({ listId: selectedList!.id, itemId: i.id, changes: { name, quantity, notes: notes || undefined, category } }))
                            }}
                            aria-label={`Edit ${i.name}`} style={{ cursor: 'pointer', border: '1px solid green', padding: 2, borderRadius: 4}}
                          >Edit</button>
                          <button  onClick={() => dispatch(deleteItem({ listId: selectedList!.id, itemId: i.id }))} aria-label={`Delete ${i.name}`} style={{ cursor: 'pointer',border: '1px solid red', padding: 2, borderRadius: 4}}>Delete</button>
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

      <Footer />
    </div>
  )
}
