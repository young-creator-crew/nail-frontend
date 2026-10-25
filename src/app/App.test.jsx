import { describe, expect, it } from "vitest"
import { AdminAgenda } from "../pages/admin-agenda/AdminAgenda"
import { AdminDashboard } from "../pages/admin-dashboard/AdminDashboard"
import { AddService } from "../pages/my-services/AddService"
import { EditService } from "../pages/my-services/EditService"
import { MyServices } from "../pages/my-services/MyServices"
import { Perfil } from "../pages/perfil/Perfil"
import { Home } from "../pages/home/Home"
import { Login } from "../pages/login/Login"
import { ServicesPage } from "../pages/services/ui/ServicesPage"
import { getRoute } from "./routes"

describe("application routes and personas", () => {
  it.each([
    ["/", Home, "visitor"],
    ["/servicos", ServicesPage, "visitor"],
    ["/entrar", Login, "visitor"],
    ["/perfil", Perfil, "client"],
    ["/admin", AdminAgenda, "admin"],
    ["/admin/agenda", AdminAgenda, "admin"],
    ["/admin/dashboard", AdminDashboard, "admin"],
    ["/admin/meus-servicos", MyServices, "admin"],
    ["/admin/meus-servicos/adicionar", AddService, "admin"],
    ["/admin/meus-servicos/editar", EditService, "admin"],
  ])("maps %s to the expected page and persona", (path, Page, role) => {
    const route = getRoute(path)

    expect(route.Page).toBe(Page)
    expect(route.role).toBe(role)
  })

  it("keeps public and admin catalog routes separate", () => {
    const publicRoute = getRoute("/servicos/nail-art")
    const adminRoute = getRoute("/admin/servicos/nail-art")

    expect(publicRoute.role).toBe("visitor")
    expect(adminRoute.role).toBe("admin")
    expect(publicRoute.Page().props.isAdmin).toBeUndefined()
    expect(adminRoute.Page().props.isAdmin).toBe(true)
  })

  it("uses the admin persona for admin catalog and profile pages", () => {
    const catalogRoute = getRoute("/admin/servicos")
    const profileRoute = getRoute("/admin/perfil")

    expect(catalogRoute.role).toBe("admin")
    expect(catalogRoute.Page().props.isAdmin).toBe(true)
    expect(profileRoute.role).toBe("admin")
    expect(profileRoute.Page().props.isAdmin).toBe(true)
  })

  it("normalizes trailing slashes without changing the persona", () => {
    expect(getRoute("/admin/agenda/").role).toBe("admin")
    expect(getRoute("/servicos/").role).toBe("visitor")
  })

  it("falls back to the public home page for unknown routes", () => {
    const route = getRoute("/rota-inexistente")

    expect(route.Page).toBe(Home)
    expect(route.role).toBe("visitor")
  })
})
