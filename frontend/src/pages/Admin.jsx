import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Admin() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState('')

  const loadProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/products?limit=100`)
      .then(response => response.json())
      .then(data => setProducts(data.products || []))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error(error))

    loadProducts()
  }, [token])

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Delete this product?')) return

    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error)
        } else {
          setProducts(prev => prev.filter(p => p.id !== id))
          setStats(prev => prev ? { ...prev, productCount: prev.productCount - 1 } : prev)
        }
      })
      .catch(error => console.error(error))
  }

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
          loadProducts()
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

      <h3>All Products</h3>
      {products.map(product => (
        <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} width="40" />}
          <span>{product.name} - ${product.price}</span>
          <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Admin