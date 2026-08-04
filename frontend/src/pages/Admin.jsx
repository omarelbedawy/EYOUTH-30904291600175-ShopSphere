import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Admin() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error(error))
  }, [token])

  const handleCreateProduct = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)
    formData.append('stock', stock)
    if (image) formData.append('image', image)

    fetch(`${import.meta.env.VITE_API_URL}/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error)
        } else {
          setMessage(`Product "${data.name}" created!`)
          setName('')
          setPrice('')
          setDescription('')
          setStock('')
          setImage(null)

          setStats(prev => prev ? { ...prev, productCount: prev.productCount + 1 } : prev)
        }
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      <h2>Admin Panel</h2>

      {stats && (
        <div>
          <p>Users: {stats.userCount}</p>
          <p>Products: {stats.productCount}</p>
          <p>Orders: {stats.orderCount}</p>
        </div>
      )}

      <h3>Create Product</h3>
      <form onSubmit={handleCreateProduct}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Create Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Admin
