import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [role, setRole] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        if (!savedToken) return

        fetch(`${import.meta.env.VITE_API_URL}/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
        })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setLoggedIn(true)
                    setRole(data.role)
                    setToken(savedToken)
                } else {
                    localStorage.removeItem('token')
                }
            })
            .catch(() => {})
    }, [])

    const login = (newToken, newRole) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setLoggedIn(true)
        setRole(newRole)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setLoggedIn(false)
        setRole(null)
    }

    return (
        <AuthContext.Provider value={{ loggedIn, role, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}
