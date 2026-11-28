import { useEffect, useRef } from "react"
import styles from "./AppointmentActionsPopover.module.css"

export function AppointmentActionsPopover({ id, onSelect, onClose, returnFocusRef }) {
  const popoverRef = useRef(null)

  useEffect(() => {
    const popover = popoverRef.current
    popover.querySelector("button").focus()
    const closeOutside = (event) => {
      if (!popover.contains(event.target) && !returnFocusRef?.current?.contains(event.target)) onClose()
    }
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        returnFocusRef?.current?.focus()
      }
    }
    document.addEventListener("pointerdown", closeOutside)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOutside)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [onClose, returnFocusRef])

  return (
    <div id={id} ref={popoverRef} className={styles.popover} role="group" aria-label="Ações do agendamento">
      <p>AÇÕES DO AGENDAMENTO</p>
      <button type="button" onClick={() => onSelect("reschedule")}>Remarcar</button>
      <button className={styles.cancel} type="button" onClick={() => onSelect("cancel")}>Cancelar</button>
    </div>
  )
}
