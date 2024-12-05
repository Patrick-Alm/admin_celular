export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${process.env.API_URL}/fotos/${params.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      return Response.json(
        { error: "Failed to delete photo" },
        { status: response.status }
      )
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    return Response.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const response = await fetch(`${process.env.API_URL}/fotos/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (error) {
    return Response.json(
      { error: "Failed to update photo" },
      { status: 500 }
    )
  }
}
