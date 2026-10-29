import { useEffect, useState } from "react"
import { getSessionUser } from "../shared/auth/session"
import { Footer } from "../widgets/footer/Footer"
import { Navbar } from "../widgets/navbar/Navbar"
import { getRoute } from "./routes"
import "./styles/index.css"

function App() {
  const { Page, role } = getRoute(window.location.pathname)
  const [sessionUser, setSessionUser] = useState(getSessionUser)

  useEffect(() => {
    const restoreSession = () => setSessionUser(getSessionUser())
    window.addEventListener("nail-session-change", restoreSession)
    window.addEventListener("storage", restoreSession)

    return () => {
      window.removeEventListener("nail-session-change", restoreSession)
      window.removeEventListener("storage", restoreSession)
    }
  }, [])

  const sessionRole = sessionUser?.userType === "ADMIN"
    ? "admin"
    : sessionUser
      ? "client"
      : "visitor"
  const isAuthRoute = window.location.pathname === "/entrar"
    || window.location.pathname === "/cadastro"
  const effectiveRole = isAuthRoute ? role : sessionUser ? sessionRole : role

  return (
    <>
      <Navbar role={effectiveRole} userName={sessionUser?.name ?? ""} />
      <Page />
      <Footer />
    </>
  )
}

export default App
