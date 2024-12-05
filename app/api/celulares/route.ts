import { Foto } from "../fotos/route"
import { Marca } from "../marcas/route"
import { Proposta } from "../propostas/route"

export interface Celular {
  id: number
  modelo: string
  ano: number
  preco: number
  foto: string | null
  fotoId: number | null
  mainFoto: Foto | null
  createdAt: string
  updatedAt: string
  marca: Marca
  marcaId: number
  fotos: Foto[]
  propostas: Proposta[]
}

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/celulares`, {
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

    const res = await fetch(`${process.env.API_URL}/celulares`, {
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
      { error: "Failed to create celular" },
      { status: 500 }
    )
  }
}
