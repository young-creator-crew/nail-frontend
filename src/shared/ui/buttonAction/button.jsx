import styles from "./button.module.css"

export function ButtonAction({
  children,
  icon = "↗",
  className = "",
  type = "button",
  ...props
}) {
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ")

  return (
    <button className={buttonClassName} type={type} {...props}>
      <span>{children}</span>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}

export default ButtonAction