export interface Marca {
  id: number
  nome: string
}

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/marcas`, {
    headers: {
      "Content-Type": "application/json",
    }
  })

  const data = await res.json()

  return Response.json(data)
}

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()

    const res = await fetch(`${process.env.API_URL}/marcas`, {
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
      { error: "Failed to create marca" },
      { status: 500 }
    )
  }
}
