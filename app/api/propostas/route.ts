import { Celular } from "../celulares/route"
import { Cliente } from "../clientes/route"

export interface Proposta {
  id: number
  cliente: Cliente
  clienteId: number
  descricao: string
  resposta: string
  celular: Celular
  celularId: number
}

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/propostas`, {
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

    const res = await fetch(`${process.env.API_URL}/propostas`, {
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
      { error: "Failed to create proposta" },
      { status: 500 }
    )
  }
}
