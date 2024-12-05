import { Proposta } from "../propostas/route"

export interface Cliente {
  id: number
  nome: string
  email: string
  createdAt: string
  updatedAt: string
  propostas: Proposta[]
}

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/clientes`, {
    headers: {
      "Content-Type": "application/json",
    }
  })

  const data = await res.json()
  return Response.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(`${process.env.API_URL}/clientes`, {
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
      { error: "Failed to create cliente" },
      { status: 500 }
    )
  }
}
