import type { Credentials } from './types'

export class GreenApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  /** Дополнительный сегмент пути после токена, например receiptId. */
  pathSuffix?: string
  query?: Record<string, string | number>
  body?: unknown
  signal?: AbortSignal
}

export function buildUrl(
  { apiUrl, idInstance, apiTokenInstance }: Credentials,
  method: string,
  pathSuffix?: string,
  query?: RequestOptions['query'],
): string {
  const base = apiUrl.trim().replace(/\/+$/, '')
  let url = `${base}/waInstance${idInstance.trim()}/${method}/${apiTokenInstance.trim()}`
  if (pathSuffix) url += `/${pathSuffix}`
  if (query) {
    const params = new URLSearchParams(
      Object.entries(query).map(([key, value]) => [key, String(value)]),
    )
    url += `?${params}`
  }
  return url
}

export async function request<T>(
  credentials: Credentials,
  method: string,
  { method: httpMethod = 'GET', pathSuffix, query, body, signal }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(credentials, method, pathSuffix, query), {
    method: httpMethod,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    throw new GreenApiError(response.status, describeStatus(response.status))
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}

function describeStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Некорректный запрос'
    case 401:
    case 403:
      return 'Неверный idInstance или apiTokenInstance'
    case 404:
      return 'Инстанс не найден — проверьте apiUrl и idInstance'
    case 429:
      return 'Слишком много запросов, попробуйте позже'
    case 466:
      return 'Исчерпан лимит тарифа'
    default:
      return `Ошибка GREEN-API (HTTP ${status})`
  }
}
