import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { AdminAgenda } from "../pages/AdminAgenda/AdminAgenda"
import { Perfil } from "../pages/Perfil/Perfil"
import "./styles/index.css"

function App() {
  const currentPath = window.location.pathname
  const isAdmin = currentPath.startsWith("/admin")
  const Page = isAdmin ? AdminAgenda : currentPath === "/perfil" ? Perfil : null

  return (
    <>
      <Navbar role={isAdmin ? "admin" : "client"} userName={isAdmin ? "[NOME DA ADMINISTRADORA]" : "[NOME DO CLIENTE]"} />
      {Page ? <Page /> : null}
      <Footer />
    </>
  )
}

export default App
