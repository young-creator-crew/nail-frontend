import { createService } from "../../shared/api/services/serviceApi"
import { ServiceForm } from "./ServiceForm"

export function AddService() {
  const handleSubmit = async (service) => {
    const formData = new FormData()
    formData.append("name", service.name)
    formData.append("category", service.category)
    formData.append("description", service.description)
    formData.append("price", String(service.price))
    formData.append(
      "estimatedDurationMinutes",
      String(service.estimatedDurationMinutes),
    )
    formData.append("image", service.image)

    await createService(formData)
    window.location.assign("/admin/meus-servicos")
  }

  return <ServiceForm onSubmit={handleSubmit} />
}
