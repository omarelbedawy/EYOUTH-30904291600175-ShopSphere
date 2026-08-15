import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function ProductDetails({ addToCart }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error(error))
  }, [id])

  const loadReviews = () => {
    // This call goes to the SEPARATE review service, not the main backend —
    // reviews genuinely live outside the main application.
    fetch(`${import.meta.env.VITE_REVIEW_SERVICE_URL}/reviews/product/${id}`)
      .then(response => response.json())
      .then(data => {
        setReviews(data.reviews || [])
        setAvgRating(data.avgRating)
      })
      .catch(error => console.error(error))
  }

  useEffect(() => {
    loadReviews()
  }, [id])

  const handleSubmitReview = (e) => {
    e.preventDefault()

    fetch(`${import.meta.env.VITE_REVIEW_SERVICE_URL}/reviews/product/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, rating: Number(rating), comment })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setReviewMessage(data.error)
        } else {
          setReviewMessage('Review posted!')
          setAuthorName('')
          setRating(5)
          setComment('')
          loadReviews()
        }
      })
      .catch(error => console.error(error))
  }

  if (!product) return <p>Loading...</p>

  return (
    <div>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          width="250"
        />
      )}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>

      <hr />
      <h3>Reviews {avgRating && `(avg ${avgRating} / 5)`}</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(review => (
        <div key={review.id} style={{ marginBottom: '10px' }}>
          <strong>{review.authorName}</strong> — {review.rating}/5
          {review.comment && <p>{review.comment}</p>}
        </div>
      ))}

      <h4>Leave a review</h4>
      <form onSubmit={handleSubmitReview}>
        <input type="text" placeholder="Your name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Terrible</option>
        </select>
        <input type="text" placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">Submit Review</button>
      </form>
      {reviewMessage && <p>{reviewMessage}</p>}
    </div>
  )
}

export default ProductDetails