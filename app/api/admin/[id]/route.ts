export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const res = await fetch(`${process.env.API_URL}/admin/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      return Response.json(
        { error: "Failed to update admin" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (error) {
    return Response.json(
      { error: "Failed to update admin" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${process.env.API_URL}/admin/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!res.ok) {
      return Response.json(
        { error: "Failed to delete admin" },
        { status: res.status }
      )
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    return Response.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    )
  }
}
