import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { Cadastro } from "../pages/Cadastro/Cadastro"
import { Login } from "../pages/Login/Login"
import "./styles/index.css"

function App() {
  const currentPath = window.location.pathname
  const Page = currentPath === "/cadastro" ? Cadastro : Login

  return (
    <>
      <Navbar />
      <Page />
      <Footer />
    </>
  )
}

export default App
