import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Admin from './pages/Admin'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

function App() {
  const { loggedIn, role, setLoggedIn, setRole } = useAuth();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products?page=${page}&limit=6&search=${search}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch(error => console.error(error));
  }, [page, search]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/logout`, { method: "POST", credentials: "include" })
      .then(() => {
        setLoggedIn(false);
        setRole(null);
      });
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Sign Up</Link> |{" "}
        <Link to="/cart">Cart ({cart.length})</Link> |{" "}
        <Link to="/admin">Admin</Link> |{" "}
        {loggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <span> - Not logged in</span>
        )}
        {loggedIn && <span> - Logged in</span>}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              addToCart={addToCart}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/cart"
          element={
            loggedIn ? (
              <Cart cart={cart} setCart={setCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={role === "ADMIN" ? <Admin /> : <Navigate to="/" />}
        />
        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />
      </Routes>
    </div>
  );
}

export default App;
