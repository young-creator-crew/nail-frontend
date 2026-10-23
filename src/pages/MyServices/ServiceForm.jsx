import { useState } from "react"
import { ButtonAction } from "../../shared/ui/buttonAction/button"
import { ButtonBack } from "../../shared/ui/buttonBack/button"
import { Input } from "../../shared/ui/input/input"
import styles from "./ServiceForm.module.css"

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"]
const maxImageSize = 5 * 1024 * 1024

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message
    || (error instanceof Error ? error.message : fallback)
}

export function ServiceForm({
  initialService,
  isEditing = false,
  isLoading = false,
  loadError = "",
  onDelete,
  onSubmit,
}) {
  const [form, setForm] = useState(() => ({
    name: initialService?.name ?? "",
    category: initialService?.category ?? "",
    description: initialService?.description ?? "",
    price: initialService?.price ?? "",
    estimatedDurationMinutes: initialService?.estimatedDurationMinutes ?? "",
  }))
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialService?.imageUrl ?? "")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFeedback("")
  }

  const selectImage = (event) => {
    const image = event.target.files?.[0] ?? null
    event.target.value = ""

    if (!image) {
      return
    }
    if (!allowedImageTypes.includes(image.type)) {
      setFeedback("Escolha uma imagem JPEG, PNG ou WebP.")
      return
    }
    if (image.size > maxImageSize) {
      setFeedback("A imagem deve ter no máximo 5 MB.")
      return
    }

    setFeedback("")
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(image)
        setImagePreview(reader.result)
      } else {
        setFeedback("Não foi possível carregar a prévia da imagem.")
      }
    }
    reader.onerror = () => {
      setFeedback("Não foi possível carregar a prévia da imagem.")
    }
    reader.readAsDataURL(image)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback("")
    setIsSubmitting(true)

    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        estimatedDurationMinutes: Number(form.estimatedDurationMinutes),
        image: selectedImage,
      })
    } catch (error) {
      setFeedback(getErrorMessage(error, "Não foi possível salvar o serviço."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setFeedback("")
    try {
      await onDelete()
    } catch (error) {
      setFeedback(getErrorMessage(error, "Não foi possível excluir o serviço."))
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <p className={styles.message} role="status">Carregando serviço...</p>
        </div>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <ButtonBack href="/admin/meus-servicos">Meus serviços</ButtonBack>
          <p className={styles.error} role="alert">{loadError}</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <ButtonBack href="/admin/meus-servicos">Meus serviços</ButtonBack>
        <h1 className={styles.title}>
          {isEditing ? "Editar serviço" : "Novo serviço"}
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.imageField}>
            <input
              accept="image/jpeg,image/png,image/webp"
              className={styles.fileInput}
              id="service-image"
              onChange={selectImage}
              required={!isEditing && !selectedImage}
              type="file"
            />
            <label className={styles.imagePicker} htmlFor="service-image">
              {imagePreview ? (
                <img src={imagePreview} alt="Prévia da foto do serviço" />
              ) : (
                <span className={styles.imagePrompt}>
                  <span className={styles.plus} aria-hidden="true">+</span>
                  Adicionar foto do serviço
                </span>
                )}
            </label>
            {imagePreview && (
              <label className={styles.changeImage} htmlFor="service-image">
                {selectedImage ? "Trocar foto" : "Alterar foto"}
              </label>
            )}
          </div>

          <div className={styles.fields}>
            <Input
              autoComplete="off"
              label="Título do serviço"
              name="name"
              onChange={updateField}
              required
              value={form.name}
            />

            <Input
              autoComplete="off"
              label="Categoria"
              name="category"
              onChange={updateField}
              placeholder="Ex.: Manicure"
              value={form.category}
            />

            <div className={styles.field}>
              <label className={styles.label} htmlFor="service-description">
                Descrição
              </label>
              <textarea
                className={styles.textarea}
                id="service-description"
                name="description"
                onChange={updateField}
                required
                rows="4"
                value={form.description}
              />
            </div>

            <Input
              label="Preço (R$)"
              min="0"
              name="price"
              onChange={updateField}
              required
              step="0.01"
              type="number"
              value={form.price}
            />

            <Input
              label="Duração estimada (minutos)"
              min="1"
              name="estimatedDurationMinutes"
              onChange={updateField}
              required
              step="1"
              type="number"
              value={form.estimatedDurationMinutes}
            />

            {feedback && (
              <p className={styles.feedback} role="alert">{feedback}</p>
            )}

            <ButtonAction
              className={styles.submitButton}
              disabled={isSubmitting || isDeleting}
              icon="✓"
              type="submit"
            >
              {isSubmitting
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Salvar serviço"}
            </ButtonAction>

            {isEditing && (
              isConfirmingDelete ? (
                <div className={styles.deleteConfirmation} role="alertdialog" aria-labelledby="delete-service-title">
                  <p id="delete-service-title">Deseja excluir este serviço?</p>
                  <div className={styles.deleteActions}>
                    <button
                      className={styles.cancelDeleteButton}
                      disabled={isDeleting}
                      onClick={() => setIsConfirmingDelete(false)}
                      type="button"
                    >
                      Cancelar
                    </button>
                    <ButtonAction
                      className={styles.confirmDeleteButton}
                      disabled={isDeleting || isSubmitting}
                      icon="×"
                      onClick={handleDelete}
                    >
                      {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                    </ButtonAction>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.deleteButton}
                  disabled={isSubmitting || isDeleting}
                  onClick={() => setIsConfirmingDelete(true)}
                  type="button"
                >
                  Excluir serviço
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
