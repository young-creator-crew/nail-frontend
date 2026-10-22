import { Navbar } from "../widgets/Navbar/Navbar"
import { Footer } from "../widgets/Footer/Footer"
import { AppointmentPage } from "../pages/appointment/ui/AppointmentPage"
import "./styles/index.css"

function App() {
  const isAppointmentRoute = window.location.pathname.replace(/\/+$/, "") === "/agendamento"

  return (
    <>
      <Navbar />
      {isAppointmentRoute && <AppointmentPage />}
      <Footer />
    </>
  )
}

export default App
