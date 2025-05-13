import { useState } from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((toasts) => [...toasts, { ...toast, id }]);
    return id;
  }

  function dismiss(id: string) {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  return {
    toasts,
    toast,
    dismiss,
  };
} 