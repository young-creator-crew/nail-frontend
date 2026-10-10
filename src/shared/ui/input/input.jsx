import { useId } from "react"
import styles from "./input.module.css"

export function Input({
  label,
  id,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const fieldClassName = [styles.input, className].filter(Boolean).join(" ")
  const wrapperClassNames = [styles.field, wrapperClassName]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={wrapperClassNames}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} className={fieldClassName} {...props} />
    </div>
  )
}

export default Input