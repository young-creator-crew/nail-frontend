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
import { AppointmentPage } from "../pages/appointment/ui/AppointmentPage"
import "./styles/index.css"

function App() {
  const isAppointmentRoute = window.location.pathname.replace(/\/+$/, "") === "/agendamento"
import { serviceDetails } from "../entities/service/model/serviceDetails"
import { ServiceDetailsPage } from "../pages/service-details/ui/ServiceDetailsPage"
import "./styles/index.css"

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/"
  const serviceId = path.startsWith("/servicos/")
    ? path.slice("/servicos/".length)
    : null
  const isServiceDetailsRoute = serviceId !== null
  const service =
    serviceId === serviceDetails.id ? serviceDetails : undefined

  return (
    <>
      <Navbar />
      {isAppointmentRoute && <AppointmentPage />}
      {isServiceDetailsRoute && <ServiceDetailsPage service={service} />}
import { ServicesPage } from "../pages/services/ui/ServicesPage"
import "./styles/index.css"
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
  const isServicesRoute = window.location.pathname === "/servicos"
  
  return (
    <>
       <Navbar />
      {isServicesRoute && <ServicesPage />}
      <Navbar role={isAdmin ? "admin" : "client"} userName={isAdmin ? "[NOME DA ADMINISTRADORA]" : "[NOME DO CLIENTE]"} />
      {Page ? <Page /> : null}
      <Home />
      <Footer />
    </>
  )
}

export default App
