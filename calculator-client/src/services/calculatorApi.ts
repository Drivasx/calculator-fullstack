
const API_URL = import.meta.env.VITE_API_URL!

interface ApiResponse {
  result?: number
  error?: string
}

async function request(
  endpoint: string,
  body: Record<string, number>,
): Promise<number> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Server not found')
  }

  const payload = (await response.json().catch(() => ({}))) as ApiResponse

  if (!response.ok) {
    alert(payload.error)
    throw new Error(
      payload.error  ?? `Status error ${response.status}`,
    )
  }

  if (payload.result === undefined) {
    throw new Error('Server did not send a valid response')
  }

  return payload.result
}

export const add = (a: number, b: number) => request('add', { a, b })
export const subtract = (a: number, b: number) => request('subtract', { a, b })
export const multiply = (a: number, b: number) => request('multiply', { a, b })
export const divide = (a: number, b: number) => request('divide', { a, b })
export const pow = (a: number, b: number) => request('pow', { a, b })
export const sqrt = (b: number) => request('sqrt', { b })
export const percentage = (b: number) => request('percentage', { b })