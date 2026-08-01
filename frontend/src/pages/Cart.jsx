function Cart({ cart, setCart }) {
  const checkout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          alert("Order placed!")
          setCart([])
        }
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      <h2>Cart ({cart.length} items)</h2>
      {cart.map(item => (
        <p key={item.productId}>{item.name} x{item.quantity} - ${item.price * item.quantity}</p>
      ))}
      {cart.length > 0 && <button onClick={checkout}>Checkout</button>}
    </div>
  )
}

export default Cart
