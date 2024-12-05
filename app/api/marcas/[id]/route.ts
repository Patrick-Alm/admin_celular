export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const res = await fetch(`${process.env.API_URL}/marcas/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      return Response.json(
        { error: "Failed to update marca" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (error) {
    return Response.json(
      { error: "Failed to update marca" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${process.env.API_URL}/marcas/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!res.ok) {
      return Response.json(
        { error: "Failed to delete marca" },
        { status: res.status }
      )
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    return Response.json(
      { error: "Failed to delete marca" },
      { status: 500 }
    )
  }
}
