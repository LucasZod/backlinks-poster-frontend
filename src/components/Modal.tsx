import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export const Modal = ({
  width,
  isVisible,
  onClose,
  children,
}: {
  width?: number
  isVisible: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible])

  useEffect(() => {
    const html = document.querySelector('html')
    if (html) html.style.overflow = isVisible ? 'hidden' : ''
  }, [isVisible])

  return isVisible
    ? createPortal(
        <React.Fragment>
          <BackDrop />
          <Container width={width}>{children}</Container>
        </React.Fragment>,
        document.querySelector('#modal')!
      )
    : null
}

const BackDrop = () => {
  return <div className="fixed top-0 left-0 w-full h-full opacity-20 blur-lg bg-slate-950" />
}

const Container = ({ width, children }: { width?: number; children: React.ReactNode }) => {
  return (
    <div
      style={{ maxWidth: width ?? 850 }}
      className="overflow-y-auto max-h-[100dvh] border border-ground p-5 rounded-lg shadow-lg fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-full z-[9999999] bg-white pt-10"
    >
      {children}
    </div>
  )
}
