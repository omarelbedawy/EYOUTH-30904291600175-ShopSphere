import { Link } from 'react-router-dom'

function Home({ products, addToCart, page, setPage, totalPages, search, setSearch }) {
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div>
      <h1>My E-Commerce Site</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearchChange}
      />

      {products.map(product => (
        <div key={product.id}>
          {product.imageUrl && (
            <img
              src={`http://localhost:3000${product.imageUrl}`}
              alt={product.name}
              width="120"
            />
          )}
          <Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}

      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
      <span> Page {page} of {totalPages} </span>
      <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  )
}

export default Home