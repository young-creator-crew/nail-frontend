import styles from "./button.module.css"

export function ButtonAction({
  children,
  icon = "↗",
  iconPosition = "right",
  className = "",
  type = "button",
  ...props
}) {
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ")
  const iconElement = (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  )

  return (
    <button className={buttonClassName} type={type} {...props}>
      {iconPosition === "left" && iconElement}
      <span>{children}</span>
      {iconPosition !== "left" && iconElement}
    </button>
  )
}

export default ButtonAction