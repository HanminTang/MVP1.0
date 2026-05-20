import React, { useEffect } from 'react'

interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: string
}

export function Modal({ visible, onClose, title, children, height }: ModalProps) {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 fade-enter" onClick={onClose} />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl modal-enter overflow-auto ${
          height || 'max-h-[80vh]'
        }`}
      >
        <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="w-8" />
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 pb-8">{children}</div>
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: React.ReactNode
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export function ConfirmDialog({
  visible, onClose, onConfirm, title, content,
  confirmText = '确认', cancelText = '取消', danger = false,
}: ConfirmDialogProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 fade-enter" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[85%] max-w-[340px] p-5 fade-enter shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="text-sm text-gray-600 leading-relaxed mb-5">{content}</div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 active:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              danger ? 'bg-red-500 active:bg-red-600' : 'bg-indigo-500 active:bg-indigo-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
