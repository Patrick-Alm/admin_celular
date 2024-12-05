export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(`${process.env.API_URL}/admin/signup`, {
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
      { error: "Failed to create admin" },
      { status: 500 }
    )
  }
}
