import { Footer } from "../widgets/Footer/Footer"
import { Navbar } from "../widgets/Navbar/Navbar"
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
