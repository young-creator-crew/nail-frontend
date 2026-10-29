import { createService } from "../../../entities/service/api/serviceApi"
import { ServiceForm } from "./ServiceForm"

export function AddService() {
  const handleSubmit = async (service) => {
    await createService({
      serviceName: service.name,
      serviceDescription: service.description,
      options: [{
        optionType: "APLICACAO",
        price: service.price,
        durationMinutes: service.estimatedDurationMinutes,
      }],
      addons: [],
    }, service.image)
    window.location.assign("/admin/meus-servicos")
  }

  return <ServiceForm onSubmit={handleSubmit} />
}
