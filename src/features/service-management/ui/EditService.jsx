import { useEffect, useState } from "react"
import {
  deleteService,
  getServiceById,
  updateService,
  updateServiceImage,
} from "../../../entities/service/api/serviceApi"
import { ServiceForm } from "./ServiceForm"

function getErrorMessage(error) {
  return error?.response?.data?.message
    || (error instanceof Error ? error.message : "Não foi possível carregar o serviço.")
}

export function EditService() {
  const serviceId = new URLSearchParams(window.location.search).get("id")
  const [service, setService] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(serviceId))
  const [loadError, setLoadError] = useState(
    serviceId ? "" : "O identificador do serviço não foi informado.",
  )

  useEffect(() => {
    let isMounted = true

    if (!serviceId) {
      return undefined
    }

    getServiceById(serviceId)
      .then((result) => {
        if (isMounted) {
          setService(result)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setLoadError(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [serviceId])

  const handleSubmit = async (updatedService) => {
    await updateService(serviceId, {
      name: updatedService.name,
      category: updatedService.category,
      description: updatedService.description,
      price: updatedService.price,
      estimatedDurationMinutes: updatedService.estimatedDurationMinutes,
    })
    if (updatedService.image) {
      await updateServiceImage(serviceId, updatedService.image)
    }
    window.location.assign("/admin/meus-servicos")
  }

  const handleDelete = async () => {
    await deleteService(serviceId)
    window.location.assign("/admin/meus-servicos")
  }

  return (
    <ServiceForm
      key={service?.id ?? "loading"}
      initialService={service}
      isEditing
      isLoading={isLoading}
      loadError={loadError}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
    />
  )
}
