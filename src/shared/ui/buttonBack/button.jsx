import styles from "./button.module.css"

export function ButtonBack({
  children,
  href = "#",
  className = "",
  ...props
}) {
  const buttonClassName = [styles.button, className].filter(Boolean).join(" ")

  return (
    <a className={buttonClassName} href={href} {...props}>
      <svg
        className={styles.icon}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 3 5 8l5 5M5.5 8H14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </a>
  )
}

export default ButtonBack
