import styles from "./button.module.css"

export function ButtonAction({
  children,
  icon = "↗",
  iconPosition = "right",
  className = "",
  href,
  type = "button",
  ...props
}) {
  const buttonClassName = [
    styles.button,
    iconPosition === "left" ? styles.iconLeft : "",
    className,
  ].filter(Boolean).join(" ")
  const Component = href ? "a" : "button"
  const componentProps = href ? { href, ...props } : { type, ...props }

  return (
    <Component className={buttonClassName} {...componentProps}>
      <span>{children}</span>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </Component>
  )
}

export default ButtonAction