export async function runOptimistic({ apply, request, confirm }) {
  const undo = apply()

  let response

  try {
    response = await request()
  } catch {
    undo()
    return
  }

  confirm?.(response.data)
}