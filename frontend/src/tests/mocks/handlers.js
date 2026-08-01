import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('http://localhost:3000/users/login', async ({ request }) => {
    const body = await request.json()

    if (body.email === 'customer@shop.com' && body.password === 'password123') {
      return HttpResponse.json({ message: 'Login successful', role: 'CUSTOMER' })
    }

    return HttpResponse.json({ error: 'Invalid password' }, { status: 401 })
  })
]