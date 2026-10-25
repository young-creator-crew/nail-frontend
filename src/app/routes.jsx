import React from "react"
import { AppointmentPage } from "../pages/appointment/ui/AppointmentPage"
import { AdminAgenda } from "../pages/admin-agenda/AdminAgenda"
import { AdminDashboard } from "../pages/admin-dashboard/AdminDashboard"
import { Cadastro } from "../pages/cadastro/Cadastro"
import { AddService } from "../pages/my-services/AddService"
import { EditService } from "../pages/my-services/EditService"
import { MyServices } from "../pages/my-services/MyServices"
import { Perfil } from "../pages/perfil/Perfil"
import { Home } from "../pages/home/Home"
import { Login } from "../pages/login/Login"
import { ServiceDetailsPage } from "../pages/service-details/ui/ServiceDetailsPage"
import { ServicesPage } from "../pages/services/ui/ServicesPage"
import { serviceDetails } from "../entities/service/model/service-details"

export function getRoute(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/"

  if (path === "/") return { Page: Home, role: "visitor" }
  if (path === "/servicos") return { Page: ServicesPage, role: "visitor" }
  if (path === "/agendamento") return { Page: AppointmentPage, role: "client" }
  if (path === "/cadastro") return { Page: Cadastro, role: "visitor" }
  if (path === "/entrar") return { Page: Login, role: "visitor" }
  if (path === "/perfil") return { Page: Perfil, role: "client" }
  if (path === "/admin") return { Page: AdminAgenda, role: "admin" }
  if (path === "/admin/dashboard") return { Page: AdminDashboard, role: "admin" }
  if (path === "/admin/agenda") return { Page: AdminAgenda, role: "admin" }
  if (path === "/admin/servicos") {
    return { Page: () => <ServicesPage isAdmin />, role: "admin" }
  }
  if (path === "/admin/perfil") {
    return { Page: () => <Perfil isAdmin />, role: "admin" }
  }
  if (path === "/admin/meus-servicos") return { Page: MyServices, role: "admin" }
  if (path === "/admin/meus-servicos/adicionar") {
    return { Page: AddService, role: "admin" }
  }
  if (path === "/admin/meus-servicos/editar") {
    return { Page: EditService, role: "admin" }
  }

  if (path.startsWith("/servicos/")) {
    const serviceId = path.slice("/servicos/".length)
    return {
      Page: () => (
        <ServiceDetailsPage
          service={serviceId === serviceDetails.id ? serviceDetails : undefined}
        />
      ),
      role: "visitor",
    }
  }

  if (path.startsWith("/admin/servicos/")) {
    const serviceId = path.slice("/admin/servicos/".length)
    return {
      Page: () => (
        <ServiceDetailsPage
          isAdmin
          service={serviceId === serviceDetails.id ? serviceDetails : undefined}
        />
      ),
      role: "admin",
    }
  }

  return { Page: Home, role: "visitor" }
}
