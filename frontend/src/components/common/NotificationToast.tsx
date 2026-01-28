"use client"

import { useEffect, useState } from 'react'
import { X, Bell } from 'lucide-react'

interface NotificationToastProps {
  id: string
  title: string
  message: string
  type?: string
  duration?: number
  onClose: (id: string) => void
}

export const NotificationToast = ({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose
}: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl shadow-lg
        bg-gradient-to-r from-yellow-50 to-white
        border-l-4 border-yellow-400
        min-w-[320px] max-w-[400px]
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(251, 191, 36, 0.1)'
      }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-[15px] text-gray-900 leading-tight">
            {title}
          </h4>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-1 text-[13px] text-gray-600 leading-relaxed">
          {message}
        </p>
        {type && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
            {type}
          </span>
        )}
      </div>
    </div>
  )
}

interface NotificationToastContainerProps {
  notifications: Array<{
    id: string
    title: string
    message: string
    type?: string
  }>
  onRemove: (id: string) => void
}

export const NotificationToastContainer = ({
  notifications,
  onRemove
}: NotificationToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="mb-3">
            <NotificationToast
              id={notification.id}
              title={notification.title}
              message={notification.message}
              type={notification.type}
              onClose={onRemove}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

