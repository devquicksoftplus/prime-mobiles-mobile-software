import { useAuth } from "@/contexts/auth-context"
import { useCallback } from "react"

export function useApiClient() {
  const { user } = useAuth()

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers)

      if (user?.uid) {
        headers.set("x-user-id", user.uid)
      }

      return fetch(url, {
        ...options,
        headers,
      })
    },
    [user?.uid]
  )

  const get = useCallback(
    async <T = any>(url: string): Promise<T> => {
      const response = await fetchWithAuth(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    },
    [fetchWithAuth]
  )

  const post = useCallback(
    async <T = any>(url: string, data: any): Promise<T> => {
      const response = await fetchWithAuth(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    },
    [fetchWithAuth]
  )

  const put = useCallback(
    async <T = any>(url: string, data: any): Promise<T> => {
      const response = await fetchWithAuth(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    },
    [fetchWithAuth]
  )

  const del = useCallback(
    async <T = any>(url: string): Promise<T> => {
      const response = await fetchWithAuth(url, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    },
    [fetchWithAuth]
  )

  return {
    fetchWithAuth,
    get,
    post,
    put,
    delete: del,
  }
}
