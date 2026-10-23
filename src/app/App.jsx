import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { MyServices } from "../pages/MyServices/MyServices"
import "./styles/index.css"

function App() {
  const isMyServicesPage = window.location.pathname.startsWith("/meus-servicos")

  return (
    <>
      <Navbar role={isMyServicesPage ? "admin" : "visitor"} />
      {isMyServicesPage && <MyServices />}
      <Footer />
    </>
  )
}

export default App
