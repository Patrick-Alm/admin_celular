export interface Foto {
  id: number
  descricao: string
  codigoFoto: string
  celularId: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const celularId = searchParams.get('celularId')

  if (!celularId) {
    return Response.json(
      { error: "Celular ID is required" },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${process.env.API_URL}/fotos/${celularId}`, {
      headers: {
        "Content-Type": "application/json",
      }
    })

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${process.env.API_URL}/fotos`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (error) {
    return Response.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    )
  }
}
