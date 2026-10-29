export function getClientAppointments(config = {}) {
  void config
  return Promise.reject(new Error("A API atual não possui rota para listar agendamentos do cliente."))
}

export function getAdminAppointments(date, config = {}) {
  void date
  void config
  return Promise.reject(new Error("A API atual não possui rota para listar agenda administrativa."))
}
