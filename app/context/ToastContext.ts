import React from 'react'
import { toast } from "react-toastify";


export function success (message) {
  toast.success(message)
}

export function error (message) {
  toast.error(message)
}

export function warn (message) {
  toast.warn(message)
}

const ToastContext = React.createContext({
  success,
  error,
  warn
})

export default ToastContext

