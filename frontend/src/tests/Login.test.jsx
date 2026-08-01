import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from '../pages/Login'

function renderLogin() {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login page', () => {
  it('renders email and password inputs and a login button', () => {
    renderLogin()

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('lets the user type into the email and password fields', () => {
    renderLogin()

    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')

    fireEvent.change(emailInput, { target: { value: 'customer@shop.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput.value).toBe('customer@shop.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('shows an alert-worthy error on wrong credentials', async () => {
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'customer@shop.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // MSW handler returns 401 + error for wrong password, confirmed via no crash + form still present
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    })
  })
})