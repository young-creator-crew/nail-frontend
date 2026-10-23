import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { AddService } from "../pages/MyServices/AddService"
import { EditService } from "../pages/MyServices/EditService"
import { MyServices } from "../pages/MyServices/MyServices"
import "./styles/index.css"

function App() {
  const currentPath = window.location.pathname
  const isMyServicesPage = currentPath.startsWith("/meus-servicos")
  const Page = currentPath === "/meus-servicos/adicionar"
    ? AddService
    : currentPath === "/meus-servicos/editar"
      ? EditService
      : currentPath === "/meus-servicos"
        ? MyServices
        : null

  return (
    <>
      <Navbar role={isMyServicesPage ? "admin" : "visitor"} />
      {Page && <Page />}
      <Footer />
    </>
  )
}

export default App
