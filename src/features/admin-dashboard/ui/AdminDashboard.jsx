import { useEffect, useMemo, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { getDemoDashboard } from "../../../entities/dashboard/model/demo-dashboard";
import {
  dateOnly,
  getDashboardMetrics,
  normalizeDashboardData,
  periodFor,
  shiftPeriod,
} from "../../../entities/dashboard/model/dashboard";
import { getAdminDashboard } from "../../../entities/dashboard/api/dashboardApi";
import {
  CalendarIcon,
  DashboardIcon,
  UserIcon,
  WalletIcon,
} from "../../../shared/ui/icons/Icons";
import styles from "./AdminDashboard.module.css";

const TODAY = dateOnly(new Date());

function formatDate(date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function Icon({ children }) {
  return (
    <span className={styles.icon} aria-hidden="true">
      {children}
    </span>
  );
}

function IndicatorIcon({ type }) {
  if (type === "wallet") {
    return <WalletIcon />
  }
  return <CalendarIcon />;
}

function DashboardChart({ daily, isMobile, visibleSeries }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const context = canvasRef.current.getContext("2d");
    if (!context) return undefined;

    const root = document.documentElement;
    const styles = getComputedStyle(root);
    chartRef.current?.destroy();
    chartRef.current = new Chart(context, {
      type: "line",
      data: {
        labels: daily.map((item) => formatDate(item.date)),
        datasets: [
          {
            label: "Criados",
            hidden: !visibleSeries.created,
            data: daily.map((item) => item.created),
            borderColor: styles.getPropertyValue("--chart-created").trim(),
            backgroundColor: styles.getPropertyValue("--chart-created").trim(),
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
          },
          {
            label: "Concluídos",
            hidden: !visibleSeries.completed,
            data: daily.map((item) => item.completed),
            borderColor: styles.getPropertyValue("--chart-completed").trim(),
            backgroundColor: styles
              .getPropertyValue("--chart-completed")
              .trim(),
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const item = daily[items[0].dataIndex];
                return `${item.date.toLocaleDateString("pt-BR", { weekday: "long" })} · ${formatDate(item.date)}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Dia do período",
              color: styles.getPropertyValue("--color-text-secondary").trim(),
            },
            ticks: {
              color: styles.getPropertyValue("--color-text-secondary").trim(),
              maxRotation: 0,
              autoSkip: isMobile,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            suggestedMax: 16,
            ticks: {
              stepSize: 4,
              color: styles.getPropertyValue("--color-text-secondary").trim(),
            },
            title: {
              display: true,
              text: "Nº de agendamentos",
              color: styles.getPropertyValue("--color-text-secondary").trim(),
            },
            grid: { color: styles.getPropertyValue("--color-border").trim() },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [daily, isMobile, visibleSeries]);

  return (
    <div className={styles.chartCanvas}>
      <canvas
        ref={canvasRef}
        aria-label="Gráfico de agendamentos criados e concluídos"
        role="img"
      />
    </div>
  );
}

export function AdminDashboard() {
  const [period, setPeriod] = useState(periodFor);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);
  const [visibleSeries, setVisibleSeries] = useState({
    created: true,
    completed: true,
  });
  const [isTableOpen, setIsTableOpen] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getAdminDashboard({
      params: {
        startDate: isoDate(period.start),
        endDate: isoDate(period.end),
      },
    })
      .then((response) => {
        if (isMounted) setDashboard(normalizeDashboardData(response));
      })
      .catch((error) => {
        if (isMounted) {
          if (!import.meta.env.VITE_API_BASE_URL) {
            setDashboard(
              normalizeDashboardData(
                getDemoDashboard({
                  endDate: isoDate(period.end),
                }),
              ),
            );
            return;
          }

          setDashboard(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o dashboard.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [period]);

  const metrics = useMemo(
    () => dashboard && getDashboardMetrics(dashboard, isMobile ? 7 : 15),
    [dashboard, isMobile],
  );

  const canGoForward = period.end < TODAY;
  const changePeriod = (days) => {
    setIsLoading(true);
    setErrorMessage("");
    setPeriod((current) => shiftPeriod(current, days));
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <p className={styles.status} role="status">
            Carregando dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className={styles.page}>
        <div className={styles.content}>
          <p className={styles.statusError} role="alert">
            {errorMessage}
          </p>
        </div>
      </main>
    );
  }

  if (!dashboard || !metrics) return null;

  const periodLabel = `${formatDate(period.start)} – ${formatDate(period.end)}`;
  const fullPeriodLabel = `${periodLabel}/${period.end.getFullYear()}`;
  const createdValue = new Intl.NumberFormat("pt-BR").format(
    metrics.createdTotal,
  );
  const completedValue = new Intl.NumberFormat("pt-BR").format(
    metrics.completedTotal,
  );

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.breadcrumb}>
          <DashboardIcon />
          <span>Área administrativa</span>
          <b>/</b>
          <strong>Dashboard</strong>
        </div>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>SEU NEGÓCIO, EM PERSPECTIVA</p>
            <h1>Dashboard administrativo</h1>
            <p className={styles.greeting}>
              Olá, {dashboard.adminName.split(" ")[0]}. Um olhar sobre os seus
              últimos 15 dias.
            </p>
          </div>
          <div className={styles.profile}>
            <Icon>
              <UserIcon />
            </Icon>
            <span>
              <b>{dashboard.adminName}</b>
              <small>Administradora</small>
            </span>
            <i aria-label="Acesso demonstrativo" />
          </div>
        </header>

        <section className={styles.overview} aria-labelledby="overview-title">
          <div className={styles.sectionHeading}>
            <h2 id="overview-title">
              <span />
              Visão geral
            </h2>
            <span className={styles.badge}>Dados demonstrativos</span>
          </div>
          <div className={styles.periodControls}>
            <button
              type="button"
              aria-label="Ver quinzena anterior"
              onClick={() => changePeriod(-15)}
            >
              ‹
            </button>
            <Icon>
              <CalendarIcon />
            </Icon>
            <span>
              <b>{periodLabel}</b>
              <small>{period.end.getFullYear()} · 15 dias</small>
            </span>
            <button
              type="button"
              aria-label="Ver próxima quinzena"
              disabled={!canGoForward}
              onClick={() => changePeriod(15)}
            >
              ›
            </button>
          </div>
        </section>

        <section className={styles.kpis} aria-label="Indicadores do dashboard">
          <article className={styles.card}>
            <div className={styles.cardTop}>
              <span>Agendamentos cancelados</span>
              <Icon>
                <IndicatorIcon />
              </Icon>
            </div>
            <strong>{String(dashboard.cancelled).padStart(2, "0")}</strong>
            <small className={styles.positive}>
              ↘ {metrics.cancellationChange}%{" "}
              <em>vs. 15 dias anteriores ({dashboard.previousCancelled})</em>
            </small>
          </article>
          <article className={`${styles.card} ${styles.highlight}`}>
            <div className={styles.cardTop}>
              <span>Estimativa de ganhos</span>
              <Icon>
                <IndicatorIcon type="wallet" />
              </Icon>
            </div>
            <strong>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboard.completed * dashboard.averageTicket)}
            </strong>
            <small>
              {dashboard.completed} atendimentos concluídos
            </small>
          </article>
          <article className={styles.card}>
            <div className={styles.cardTop}>
              <span>Dia de maior movimento</span>
              <Icon>
                <CalendarIcon />
              </Icon>
            </div>
            <strong>
              {metrics.busiest.date
                .toLocaleDateString("pt-BR", { weekday: "long" })
                .replace(/^./, (letter) => letter.toUpperCase())}
            </strong>
            <small>
              {formatDate(metrics.busiest.date)} · {metrics.busiest.created}{" "}
              agendamentos criados
            </small>
          </article>
        </section>

        <section className={styles.chartPanel} aria-labelledby="chart-title">
          <div className={styles.chartHeader}>
            <div>
              <p className={styles.eyebrow}>ACOMPANHE SUA EVOLUÇÃO</p>
              <h2 id="chart-title">Agendamentos criados e concluídos</h2>
              <p className={styles.chartDescription}>
                {isMobile
                  ? "Criados e concluídos nos últimos 7 dias do período"
                  : "Criados e concluídos nos últimos 15 dias do período"}{" "}
                · {fullPeriodLabel}.
              </p>
            </div>
            <span className={styles.periodBadge}>
              {isMobile ? "7 dias" : "15 dias"}
            </span>
          </div>
          <div className={styles.totals}>
            <span className={visibleSeries.created ? "" : styles.muted}>
              <i className={styles.createdDot} />
              <b>{createdValue}</b> criados no período
            </span>
            <span className={visibleSeries.completed ? "" : styles.muted}>
              <i className={styles.completedDot} />
              <b>{completedValue}</b> concluídos no período
            </span>
          </div>
          <div className={styles.legend}>
            <button
              type="button"
              aria-pressed={visibleSeries.created}
              className={!visibleSeries.created ? styles.hiddenSeries : ""}
              onClick={() =>
                setVisibleSeries((current) => ({
                  ...current,
                  created: !current.created,
                }))
              }
            >
              <i className={styles.createdDot} />
              Criados
            </button>
            <button
              type="button"
              aria-pressed={visibleSeries.completed}
              className={!visibleSeries.completed ? styles.hiddenSeries : ""}
              onClick={() =>
                setVisibleSeries((current) => ({
                  ...current,
                  completed: !current.completed,
                }))
              }
            >
              <i className={styles.completedDot} />
              Concluídos
            </button>
          </div>
          <DashboardChart
            daily={metrics.daily}
            isMobile={isMobile}
            visibleSeries={visibleSeries}
          />
          <p className={styles.chartHint}>
            ⓘ Passe o mouse ou toque no gráfico para ver os detalhes.
          </p>
          <button
            className={styles.tableToggle}
            type="button"
            aria-expanded={isTableOpen}
            onClick={() => setIsTableOpen((current) => !current)}
          >
            {isTableOpen ? "Ocultar tabela" : "Ver dados em tabela"} ↗
          </button>
          {isTableOpen && (
            <div className={styles.tableWrap}>
              <p>Agendamentos demonstrativos · {periodLabel}</p>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Criados</th>
                    <th>Concluídos</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.daily.map((item) => (
                    <tr key={item.date.toISOString()}>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.created}</td>
                      <td>{item.completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className={styles.support}>
          <span className={styles.supportIcon}>✧</span>
          <div>
            <h2>Mais organização. Mais tempo para criar.</h2>
            <p>
              Acompanhe os indicadores e planeje seus próximos dias de
              atendimento.
            </p>
          </div>
          <a href="/admin/agenda">Abrir minha agenda ↗</a>
        </aside>
        <p className={styles.notice}>
          Visualização demonstrativa. Os indicadores não estão conectados aos
          agendamentos do protótipo. Criados e concluídos são contagens
          independentes por dia.
        </p>
      </div>
    </main>
  );
}
