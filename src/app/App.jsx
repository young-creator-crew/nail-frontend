import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
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
      {isServiceDetailsRoute && <ServiceDetailsPage service={service} />}
      <Footer />
    </>
  )
}

export default App
