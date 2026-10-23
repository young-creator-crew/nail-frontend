import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { Cadastro } from "../pages/Cadastro/Cadastro"
import { Login } from "../pages/Login/Login"
import { Home } from "../pages/Home/Home"
import { AdminAgenda } from "../pages/AdminAgenda/AdminAgenda"
import { Perfil } from "../pages/Perfil/Perfil"
import "./styles/index.css"

function App() {
  const currentPath = window.location.pathname
  const isAdmin = currentPath.startsWith("/admin")
  const Page = isAdmin ? AdminAgenda : currentPath === "/perfil" ? Perfil : null
  const Page = currentPath === "/cadastro" ? Cadastro : Login

  return (
    <>
      <Navbar role={isAdmin ? "admin" : "client"} userName={isAdmin ? "[NOME DA ADMINISTRADORA]" : "[NOME DO CLIENTE]"} />
      {Page ? <Page /> : null}
      <Home />
      <Footer />
    </>
  )
}

export default App
