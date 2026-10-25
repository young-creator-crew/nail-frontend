import { Footer } from "../widgets/footer/Footer"
import { Navbar } from "../widgets/navbar/Navbar"
import { getRoute } from "./routes"
import "./styles/index.css"

function App() {
  const { Page, role } = getRoute(window.location.pathname)

  return (
    <>
      <Navbar role={role} />
      <Page />
      <Footer />
    </>
  )
}

export default App
