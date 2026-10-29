import { useEffect, useMemo, useRef, useState } from "react"
import Chart from "chart.js/auto"
import { getAdminDashboard } from "../../../entities/dashboard/api/dashboardApi"
import { getDemoDashboard } from "../../../entities/dashboard/model/demo-dashboard"
import {
  ArrowUpRightIcon,
  CalendarIcon,
  DashboardIcon,
  UserIcon,
  WalletIcon,
} from "../../../shared/ui/icons/Icons"
import styles from "./AdminDashboard.module.css"

function formatDateToApi(date) {
  return date.toISOString().slice(0, 10)
}

function parseApiDate(value) {
  return new Date(`${value}T00:00:00`)
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(parseApiDate(value))
}

function formatWeekDay(value) {
  const formatted = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(parseApiDate(value))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function getInitialPeriod() {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 14)

  return {
    startDate: formatDateToApi(startDate),
    endDate: formatDateToApi(endDate),
  }
}

function normalizeDashboardResponse(response, period) {
  const fallback = getDemoDashboard({ endDate: period.endDate })
  const rawDaily = Array.isArray(response?.appointmentsByDay)
    ? response.appointmentsByDay
    : Array.isArray(response?.daily)
      ? response.daily
      : fallback.daily

  const daily = rawDaily
    .map((entry) => {
      const created = Number(
        entry?.created
        ?? Number(entry?.scheduled || 0)
        + Number(entry?.confirmed || 0)
        + Number(entry?.completed || 0)
        + Number(entry?.cancelled || 0),
      )

      return {
        date: entry?.date,
        created,
        completed: Number(entry?.completed || 0),
        cancelled: Number(entry?.cancelled || 0),
      }
    })
    .filter((entry) => entry.date)

  const sortedDaily = [...daily].sort((a, b) => parseApiDate(a.date) - parseApiDate(b.date))
  const cancelledTotal = sortedDaily.reduce((total, item) => total + item.cancelled, 0)
  const totalAppointments = Number(response?.kpis?.totalAppointments)
  const completedRevenue = Number(response?.kpis?.completedRevenue)
  const cancellationRate = Number(response?.kpis?.cancellationRate)

  const busiestDay = sortedDaily.reduce((current, day) => (
    !current || day.created > current.created ? day : current
  ), null)

  return {
    adminName: response?.adminName || "Juliana",
    startDate: response?.startDate || period.startDate,
    endDate: response?.endDate || period.endDate,
    periodDays: sortedDaily.length || 15,
    daily: sortedDaily,
    totalAppointments: Number.isFinite(totalAppointments)
      ? totalAppointments
      : sortedDaily.reduce((total, item) => total + item.created, 0),
    completedRevenue: Number.isFinite(completedRevenue) ? completedRevenue : 0,
    cancellationRate: Number.isFinite(cancellationRate) ? cancellationRate : 0,
    cancelledTotal,
    busiestDay,
  }
}

export function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches)
  const [period, setPeriod] = useState(getInitialPeriod)
  const [dashboard, setDashboard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [showCreated, setShowCreated] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const handleChange = (event) => setIsMobile(event.matches)

    setIsMobile(media.matches)
    media.addEventListener("change", handleChange)

    return () => media.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setErrorMessage("")

    getAdminDashboard({
      params: {
        startDate: period.startDate,
        endDate: period.endDate,
      },
    })
      .then((response) => {
        setDashboard(normalizeDashboardResponse(response, period))
      })
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar o dashboard."))
      .finally(() => setIsLoading(false))
  }, [period])

  const visibleDays = isMobile ? 7 : 15

  const chartDaily = useMemo(
    () => dashboard?.daily?.slice(-visibleDays) ?? [],
    [dashboard, visibleDays],
  )

  const createdTotal = useMemo(
    () => chartDaily.reduce((total, item) => total + item.created, 0),
    [chartDaily],
  )

  const completedTotal = useMemo(
    () => chartDaily.reduce((total, item) => total + item.completed, 0),
    [chartDaily],
  )

  const completedTotalPeriod = useMemo(
    () => dashboard?.daily?.reduce((total, item) => total + item.completed, 0) ?? 0,
    [dashboard],
  )

  useEffect(() => {
    if (!chartRef.current || chartDaily.length === 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
      return
    }

    const style = getComputedStyle(document.documentElement)
    const createdColor = style.getPropertyValue("--chart-created").trim() || "#7d0bb6"
    const completedColor = style.getPropertyValue("--chart-completed").trim() || "#bb920a"
    const labels = chartDaily.map((item) => formatShortDate(item.date))

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Criados",
            data: chartDaily.map((item) => item.created),
            borderColor: createdColor,
            backgroundColor: createdColor,
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            hidden: !showCreated,
          },
          {
            label: "Concluídos",
            data: chartDaily.map((item) => item.completed),
            borderColor: completedColor,
            backgroundColor: completedColor,
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
            hidden: !showCompleted,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        scales: {
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: "Dia do período",
              color: "#67665f",
              font: { size: 12, family: "Roboto" },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            title: {
              display: true,
              text: "Nº de agendamentos",
              color: "#67665f",
              font: { size: 12, family: "Roboto" },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [chartDaily, showCompleted, showCreated])

  const shiftPeriod = (days) => {
    const start = parseApiDate(period.startDate)
    const end = parseApiDate(period.endDate)
    start.setDate(start.getDate() + days)
    end.setDate(end.getDate() + days)

    setPeriod({
      startDate: formatDateToApi(start),
      endDate: formatDateToApi(end),
    })
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.breadcrumb}><DashboardIcon /><span>Área administrativa</span><b>/</b><strong>Dashboard</strong></div>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>SEU NEGÓCIO, EM PERSPECTIVA</p>
            <h1>Dashboard administrativo</h1>
            {!isLoading && !errorMessage && dashboard && (
              <p className={styles.greeting}>Olá, {dashboard.adminName.split(" ")[0]}. Um olhar sobre os seus últimos 15 dias.</p>
            )}
          </div>
          {!isLoading && !errorMessage && dashboard && (
            <article className={styles.profile} aria-label="Perfil administrador">
              <span className={styles.icon}><UserIcon /></span>
              <span>
                <b>{dashboard.adminName.split(" ")[0]}</b>
                <small>Administradora</small>
              </span>
              <i aria-hidden="true" />
            </article>
          )}
        </header>
        {isLoading && <p className={styles.status} role="status">Carregando dashboard...</p>}
        {!isLoading && errorMessage && <p className={styles.statusError} role="alert">{errorMessage}</p>}
        {!isLoading && !errorMessage && dashboard && (
          <>
            <section className={styles.overview} aria-label="Visão geral">
              <div className={styles.sectionHeading}>
                <h2><span aria-hidden="true" />Visão geral</h2>
                <p className={styles.badge}>Dados demonstrativos</p>
              </div>
              <div className={styles.periodControls}>
                <button type="button" aria-label="Período anterior" onClick={() => shiftPeriod(-15)}>‹</button>
                <CalendarIcon className={styles.icon} />
                <span>
                  <b>{`${formatShortDate(dashboard.startDate)} - ${formatShortDate(dashboard.endDate)}`}</b>
                  <small>{`${dashboard.endDate.slice(0, 4)} · ${dashboard.periodDays} dias`}</small>
                </span>
                <button type="button" aria-label="Próximo período" onClick={() => shiftPeriod(15)}>›</button>
              </div>
            </section>

            <section className={styles.kpis} aria-label="Indicadores do dashboard">
              <article className={styles.card}>
                <div className={styles.cardTop}><span>Agendamentos cancelados</span><span className={styles.icon}><CalendarIcon /></span></div>
                <strong>{String(dashboard.cancelledTotal).padStart(2, "0")}</strong>
                <small className={styles.positive}><em>{`${dashboard.cancellationRate.toFixed(2)}% de taxa no período`}</em></small>
              </article>

              <article className={`${styles.card} ${styles.highlight}`}>
                <div className={styles.cardTop}><span>Estimativa de ganhos</span><span className={styles.icon}><WalletIcon /></span></div>
                <strong>{formatMoney(dashboard.completedRevenue)}</strong>
                <small>{`${completedTotalPeriod} atendimentos concluídos`}</small>
              </article>

              <article className={styles.card}>
                <div className={styles.cardTop}><span>Dia de maior movimento</span><span className={styles.icon}><CalendarIcon /></span></div>
                <strong>{dashboard.busiestDay ? formatWeekDay(dashboard.busiestDay.date) : "—"}</strong>
                <small>{dashboard.busiestDay ? `${formatShortDate(dashboard.busiestDay.date)} · ${dashboard.busiestDay.created} agendamentos criados` : "Sem dados suficientes"}</small>
              </article>
            </section>

            <section className={styles.chartPanel} aria-label="Evolução de agendamentos">
              <div className={styles.chartHeader}>
                <div>
                  <p className={styles.eyebrow}>ACOMPANHE SUA EVOLUÇÃO</p>
                  <h2>Agendamentos criados e concluídos</h2>
                  <p className={styles.chartDescription}>
                    {`Criados e concluídos nos últimos ${visibleDays} dias do período ·`}
                    {` ${chartDaily[0] ? formatShortDate(chartDaily[0].date) : "--/--"} — ${chartDaily.at(-1) ? formatShortDate(chartDaily.at(-1).date) : "--/--"}`}
                  </p>
                </div>
                <p className={styles.periodBadge}>{`${visibleDays} dias`}</p>
              </div>

              <div className={styles.totals}>
                <span><i className={styles.createdDot} /><b>{createdTotal}</b>criados no período</span>
                <span><i className={styles.completedDot} /><b>{completedTotal}</b>concluídos no período</span>
              </div>

              <div className={styles.legend}>
                <button
                  className={showCreated ? "" : styles.hiddenSeries}
                  type="button"
                  onClick={() => setShowCreated((current) => !current)}
                >
                  <i className={styles.createdDot} />Criados
                </button>
                <button
                  className={showCompleted ? "" : styles.hiddenSeries}
                  type="button"
                  onClick={() => setShowCompleted((current) => !current)}
                >
                  <i className={styles.completedDot} />Concluídos
                </button>
              </div>

              <div className={styles.chartCanvas}>
                <canvas ref={chartRef} aria-label="Gráfico de linha de agendamentos" role="img" />
              </div>

              <p className={styles.chartHint}>Passe o mouse ou toque no gráfico para ver os detalhes.</p>

              <button className={styles.tableToggle} type="button" onClick={() => setShowTable((current) => !current)}>
                {showTable ? "Ocultar tabela" : "Ver dados em tabela"} <ArrowUpRightIcon />
              </button>

              {showTable && (
                <div className={styles.tableWrap}>
                  <p>{`Agendamentos demonstrativos · ${chartDaily[0] ? formatShortDate(chartDaily[0].date) : "--/--"} — ${chartDaily.at(-1) ? formatShortDate(chartDaily.at(-1).date) : "--/--"}`}</p>
                  <table>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Criados</th>
                        <th>Concluídos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartDaily.map((item) => (
                        <tr key={item.date}>
                          <td>{formatShortDate(item.date)}</td>
                          <td>{item.created}</td>
                          <td>{item.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className={styles.support}>
              <p className={styles.supportIcon} aria-hidden="true">✧</p>
              <div>
                <h2>Mais organização. Mais tempo pra criar.</h2>
                <p>Acompanhe os indicadores e planeje seus próximos dias de atendimento.</p>
              </div>
              <a href="/admin/agenda">Abrir minha agenda <ArrowUpRightIcon /></a>
            </section>

            <p className={styles.notice}>
              Visualização demonstrativa. Os indicadores não estão conectados aos agendamentos do protótipo.
              Criados e concluídos são contagens independentes por dia.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
