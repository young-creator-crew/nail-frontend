import { useEffect, useId, useRef } from "react"
import styles from "./Modal.module.css"

export function Modal({ title, eyebrow, children, onClose, busy = false, wide = false, returnFocusRef }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = returnFocusRef?.current ?? document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus()
    }
  }, [returnFocusRef])

  useEffect(() => {
    const dialog = dialogRef.current
    if (busy) dialog.focus()
    else dialog.querySelector("[data-initial-focus]")?.focus()
  }, [title, busy])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        if (!busy) onClose()
      }
    }
    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [busy, onClose])

  const closeFromBackdrop = (event) => {
    if (busy || event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${wide ? styles.wide : ""}`}
      aria-labelledby={titleId}
      aria-busy={busy}
      onClick={closeFromBackdrop}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <button className={styles.close} type="button" onClick={onClose} disabled={busy}>Fechar</button>
        <h2 id={titleId}>{title}</h2>
      </header>
      {children}
    </dialog>
  )
}
