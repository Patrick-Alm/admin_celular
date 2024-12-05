export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${process.env.API_URL}/fotos/main`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch (error) {
    return Response.json(
      { error: "Failed to upload main photo" },
      { status: 500 }
    )
  }
}
