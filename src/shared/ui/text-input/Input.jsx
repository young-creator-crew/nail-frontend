import { useId } from "react"
import styles from "./Input.module.css"

export function Input({
  label,
  id,
  className = "",
  labelClassName = "",
  wrapperClassName = "",
  endAdornment,
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
      <label
        className={[styles.label, labelClassName].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        {label}
      </label>
      <div className={styles.control}>
        <input id={inputId} className={fieldClassName} {...props} />
        {endAdornment ? (
          <span className={styles.adornment}>{endAdornment}</span>
        ) : null}
      </div>
    </div>
  )
}

export default Input