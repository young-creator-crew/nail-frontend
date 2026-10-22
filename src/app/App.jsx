import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { ServicesPage } from "../pages/services/ui/ServicesPage"
import "./styles/index.css"

function App() {
  const isServicesRoute = window.location.pathname === "/servicos"

  return (
    <>
      <Navbar />
      {isServicesRoute && <ServicesPage />}
      <Footer />
    </>
  )
}

export default App
