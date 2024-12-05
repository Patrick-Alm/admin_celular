export interface Admin {
  id: number
  nome: string
  email: string
  createdAt: string
  updatedAt: string
}

// GET - Fetch all admins
export async function GET() {
  try {
    const res = await fetch(`${process.env.API_URL}/admin`, {
      headers: {
        "Content-Type": "application/json",
      }
    })

    const data = await res.json()
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}

// POST - Login admin
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(`${process.env.API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (error) {
    return Response.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}
