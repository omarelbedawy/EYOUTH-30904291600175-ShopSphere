import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [role, setRole] = useState(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    setLoggedIn(true)
                    setRole(data.role)
                }
            })
            .catch(() => {})
    }, [])

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, role, setRole }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}
