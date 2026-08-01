import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function ProductDetails({ addToCart }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error(error))
  }, [id])

  if (!product) return <p>Loading...</p>

  return (
    <div>
      {product.imageUrl && (
        <img
          src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`}
          alt={product.name}
          width="250"
        />
      )}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  )
}

export default ProductDetails
