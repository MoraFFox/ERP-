"use client"

import { useState, useEffect } from "react"
import { networkStatus } from "@/services/api"
import { useApiError } from "./useApiError"

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(networkStatus.isOnline())
  const [wasOffline, setWasOffline] = useState(false)
  const { handleWarning, handleSuccess } = useApiError()

  useEffect(() => {
    const cleanup = networkStatus.onStatusChange((online) => {
      setIsOnline(online)

      if (!online) {
        setWasOffline(true)
        handleWarning("You're currently offline. Some features may not work properly.")
      } else if (wasOffline) {
        handleSuccess("You're back online!")
        setWasOffline(false)
      }
    })

    return cleanup
  }, [wasOffline, handleWarning, handleSuccess])

  return { isOnline, wasOffline }
}
