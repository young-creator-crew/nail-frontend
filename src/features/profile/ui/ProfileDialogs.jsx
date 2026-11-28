import { useRef, useState } from "react"
import { ButtonAction } from "../../../shared/ui/button-action/ButtonAction"
import { Modal } from "../../../shared/ui/modal/Modal"
import { Input } from "../../../shared/ui/text-input/Input"
import { formatAppointmentDate, formatAppointmentPrice } from "../model/appointment-display"
import styles from "./ProfileDialogs.module.css"

const titles = {
  manage: "Gerenciar perfil",
  delete: "Excluir seu perfil?",
  reschedule: "Remarcar agendamento",
  cancel: "Cancelar agendamento?",
}

export function ProfileDialogs({ mode, profile, appointment, onClose, onBack, onSave, onCancel, onReschedule, busy = false, returnFocusRef }) {
  const [draft, setDraft] = useState(() => ({
    name: profile?.name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    date: appointment?.date ?? "",
    time: appointment?.time ?? "",
  }))
  const [error, setError] = useState("")
  const submitting = useRef(false)
  const isDestructive = mode === "delete" || mode === "cancel"

  const submit = async (event) => {
    event.preventDefault()
    if (submitting.current || busy) return
    submitting.current = true
    setError("")
    try {
      if (mode === "manage") await onSave(draft)
      else if (mode === "cancel" && onCancel) await onCancel()
      else if (mode === "reschedule" && onReschedule) await onReschedule({ date: draft.date, time: draft.time })
      else throw new Error("Esta ação ainda não está disponível.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível atualizar os dados.")
    } finally {
      submitting.current = false
    }
  }

  const changeField = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }))
  }

  return (
    <Modal
      title={titles[mode]}
      eyebrow={isDestructive ? "CONFIRMAR AÇÃO" : mode === "manage" ? "MINHA CONTA" : "AGENDAMENTO"}
      wide={isDestructive}
      busy={busy}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    >
      {mode === "manage" && (
        <form className={styles.form} onSubmit={submit}>
          <p className={styles.description}>Revise seus dados e salve as alterações.</p>
          <div>
            <Input label="Nome" value={draft.name} onChange={changeField("name")} autoComplete="name" required disabled={busy} data-initial-focus aria-describedby="profile-name-help" className={styles.input} />
            <p className={styles.help} id="profile-name-help">O nome que aparece no seu perfil.</p>
          </div>
          <div>
            <Input label="Telefone" type="tel" value={draft.phone} onChange={changeField("phone")} autoComplete="tel" disabled={busy} aria-describedby="profile-phone-help" className={styles.input} />
            <p className={styles.help} id="profile-phone-help">Inclua o DDD para manter seu contato atualizado.</p>
          </div>
          <div>
            <Input label="E-mail" type="email" value={draft.email} onChange={changeField("email")} autoComplete="email" required disabled={busy} aria-describedby="profile-email-help" className={styles.input} />
            <p className={styles.help} id="profile-email-help">Use um e-mail ao qual você tenha acesso.</p>
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <ButtonAction type="submit" className={styles.primary} disabled={busy}>
            {busy ? "Salvando alterações..." : "Salvar alterações"}
          </ButtonAction>
          <ButtonAction type="button" className={styles.outlineDanger} icon="" disabled={busy} onClick={() => onBack("delete")}>
            Excluir perfil
          </ButtonAction>
        </form>
      )}

      {mode === "delete" && (
        <div className={styles.form}>
          <p className={styles.description}>Você está prestes a solicitar a exclusão do seu perfil.</p>
          <div className={styles.warning} role="status">
            <strong>Exclusão de perfil ainda indisponível.</strong>
            <p>A integração para excluir sua conta ainda não está disponível. Seus dados permanecem protegidos.</p>
          </div>
          <div className={styles.actions}>
            <ButtonAction type="button" className={styles.safe} onClick={onClose} disabled={busy} data-initial-focus>Manter perfil</ButtonAction>
            <ButtonAction className={styles.danger} icon="" disabled aria-describedby="profile-delete-unavailable">Excluir perfil</ButtonAction>
          </div>
          <p className={styles.help} id="profile-delete-unavailable">Esta ação não pode ser realizada no momento.</p>
        </div>
      )}

      {(mode === "reschedule" || mode === "cancel") && (
        <form className={styles.form} onSubmit={submit}>
          <p className={styles.description}>
            {mode === "reschedule" ? "Escolha uma nova data e um novo horário." : "Confira os dados antes de confirmar o cancelamento."}
          </p>
          {appointment && (
            <div className={styles.summary}>
              <strong>{appointment.service}</strong>
              <p>{formatAppointmentDate(appointment.date)} · {appointment.time} · {formatAppointmentPrice(appointment.price)}</p>
            </div>
          )}
          {mode === "reschedule" && (
            <>
              <Input label="Nova data" type="date" value={draft.date} onChange={changeField("date")} required disabled={busy || !onReschedule} className={styles.input} />
              <Input label="Novo horário" type="time" value={draft.time} onChange={changeField("time")} required disabled={busy || !onReschedule} className={styles.input} />
            </>
          )}
          {!(mode === "reschedule" ? onReschedule : onCancel) && (
            <p className={styles.warning} id="appointment-action-unavailable" role="status">
              {mode === "reschedule" ? "Remarcação indisponível" : "Cancelamento indisponível"}: a integração com os agendamentos ainda não está disponível.
            </p>
          )}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={mode === "cancel" ? styles.actions : styles.form}>
            {mode === "cancel" && <ButtonAction type="button" className={styles.safe} onClick={onClose} disabled={busy} data-initial-focus>Manter agendamento</ButtonAction>}
            <ButtonAction type="submit" className={mode === "cancel" ? styles.danger : styles.primary} disabled={busy || !(mode === "reschedule" ? onReschedule : onCancel)} aria-describedby={!(mode === "reschedule" ? onReschedule : onCancel) ? "appointment-action-unavailable" : undefined}>
              {mode === "reschedule" ? "Confirmar remarcação" : "Cancelar agendamento"}
            </ButtonAction>
            {mode === "reschedule" && <ButtonAction type="button" className={styles.secondary} icon="" disabled={busy} onClick={() => onBack("menu")} data-initial-focus>Voltar</ButtonAction>}
          </div>
        </form>
      )}
    </Modal>
  )
}
