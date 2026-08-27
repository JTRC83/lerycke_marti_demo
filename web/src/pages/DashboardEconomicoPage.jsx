import { useMemo } from 'react'
import { useProjects } from '../context/ProjectsContext.jsx'
import { useClientes } from '../context/ClientesContext.jsx'
import { formatEur } from '../data/projects.js'
import { getClienteNombre, getCompletitud } from '../utils/project.js'
import EChart from '../components/EChart.jsx'

// DashboardEconomicoPage: statistics about the studio's financials, clients,
// renders and project states. Uses Apache ECharts for visualizations.

function StatCard({ valor, etiqueta, subetiqueta, tone = 'brand' }) {
  const tones = {
    brand: 'text-brand-900',
    success: 'text-state-success',
    warning: 'text-state-warning',
    danger: 'text-state-danger',
  }
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
      <p className={`text-2xl font-bold leading-none ${tones[tone]}`}>{valor}</p>
      <p className="mt-1.5 text-sm text-brand-800">{etiqueta}</p>
      {subetiqueta ? <p className="text-xs text-surface-muted">{subetiqueta}</p> : null}
    </div>
  )
}

const C = {
  primary: '#1a3a2a',
  success: '#3a8a5a',
  warning: '#d4a72c',
  danger: '#c0392b',
  info: '#2e86c1',
  light: '#a3c4bc',
  purple: '#7b6cd9',
  orange: '#e07b39',
}

// Mock de evolución mensual (12 meses) — más datos para gráficos
const EVOLUCION_MENSUAL = [
  { mes: 'Ene', ingresos: 12000, gastos: 8400, beneficio: 3600 },
  { mes: 'Feb', ingresos: 18500, gastos: 12950, beneficio: 5550 },
  { mes: 'Mar', ingresos: 22000, gastos: 15400, beneficio: 6600 },
  { mes: 'Abr', ingresos: 15800, gastos: 11060, beneficio: 4740 },
  { mes: 'May', ingresos: 31000, gastos: 21700, beneficio: 9300 },
  { mes: 'Jun', ingresos: 27500, gastos: 19250, beneficio: 8250 },
  { mes: 'Jul', ingresos: 19500, gastos: 13650, beneficio: 5850 },
  { mes: 'Ago', ingresos: 8000, gastos: 5600, beneficio: 2400 },
  { mes: 'Sep', ingresos: 24000, gastos: 16800, beneficio: 7200 },
  { mes: 'Oct', ingresos: 32450, gastos: 22715, beneficio: 9735 },
  { mes: 'Nov', ingresos: 18750, gastos: 13125, beneficio: 5625 },
  { mes: 'Dic', ingresos: 46898, gastos: 32829, beneficio: 14069 },
]

// Mock de más clientes para gráficos más ricos
const CLIENTES_EXTRA = [
  { nombre: 'SON POU', facturado: 46898.39, proyectos: 1 },
  { nombre: 'Cafe BOU', facturado: 32450.00, proyectos: 1 },
  { nombre: 'Magdalena i Pere', facturado: 18750.00, proyectos: 1 },
  { nombre: 'Toni Oliver', facturado: 12500.00, proyectos: 1 },
  { nombre: 'Joana Ribot', facturado: 9800.00, proyectos: 1 },
  { nombre: 'Ca n\'Aina', facturado: 15700.00, proyectos: 1 },
]

// Mock de tipos de proyecto
const TIPOS_PROYECTO = [
  { name: 'Reforma integral vivienda', value: 4 },
  { name: 'Reforma integral comercial', value: 1 },
  { name: 'Diseño de interiores', value: 3 },
  { name: 'Vivienda unifamiliar', value: 2 },
  { name: 'Rehabilitación rústica', value: 2 },
]

// Mock de presupuestos por proyecto
const PRESUPUESTOS = [
  { nombre: 'SON POU', cliente: 'Xisca i Llorenc', importe: 46898.39, estado: 'verificado' },
  { nombre: 'Cafe BOU', cliente: 'Cafe BOU', importe: 32450.00, estado: 'verificado' },
  { nombre: 'Magdalena i Pere', cliente: 'Magdalena i Pere', importe: 18750.00, estado: 'verificado' },
  { nombre: 'Toni Oliver', cliente: 'Toni Oliver', importe: 12500.00, estado: 'pendiente' },
  { nombre: 'Ca n\'Aina', cliente: 'Joana Ribot', importe: 15700.00, estado: 'pendiente' },
  { nombre: 'Es Gener', cliente: 'Marga i Pau', importe: 28300.00, estado: 'verificado' },
  { nombre: 'Sa Tanca', cliente: 'Biel i Catalina', importe: 8900.00, estado: 'pendiente' },
]

function PresupuestoRow({ p }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-brand-900 truncate">{p.nombre}</p>
        <p className="text-xs text-surface-muted truncate">{p.cliente}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-brand-900">{formatEur(p.importe)}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.estado === 'verificado' ? 'bg-state-success/10 text-state-success' : 'bg-surface-base text-surface-muted'}`}>
          {p.estado}
        </span>
      </div>
    </div>
  )
}

export default function DashboardEconomicoPage() {
  const { projects } = useProjects()
  const { clientes } = useClientes()

  const stats = useMemo(() => {
    const totalProyectos = 12
    const activos = 4
    const borradores = 6
    const completados = 2
    const facturadoTotal = PRESUPUESTOS.reduce((s, p) => s + p.importe, 0)
    const gastosEstimados = Math.round(facturadoTotal * 0.70)
    const beneficioEstimado = facturadoTotal - gastosEstimados
    const m2Totales = 892.3
    const totalRendersGenerados = 28
    const totalRendersEsperados = 48
    const totalPresupuestos = PRESUPUESTOS.length
    const presupuestosVerificados = PRESUPUESTOS.filter((p) => p.estado === 'verificado').length

    return {
      totalProyectos, activos, borradores, completados,
      facturadoTotal, gastosEstimados, beneficioEstimado,
      m2Totales, totalRendersGenerados, totalRendersEsperados,
      totalPresupuestos, presupuestosVerificados,
    }
  }, [])

  // Gráfico de líneas: evolución mensual de ingresos, gastos y beneficio
  const chartEvolucionOption = useMemo(() => ({
    tooltip: { trigger: 'axis', formatter: (params) => {
      let html = `<strong>${params[0].axisValue}</strong><br/>`
      params.forEach((p) => {
        html += `${p.marker} ${p.seriesName}: ${formatEur(p.value)}<br/>`
      })
      return html
    }},
    legend: { bottom: 0, fontSize: 11, data: ['Ingresos', 'Gastos', 'Beneficio'] },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: EVOLUCION_MENSUAL.map((d) => d.mes), axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10, formatter: (v) => `${(v / 1000).toFixed(0)}k` } },
    series: [
      {
        name: 'Ingresos',
        type: 'line',
        smooth: true,
        data: EVOLUCION_MENSUAL.map((d) => d.ingresos),
        itemStyle: { color: C.primary },
        lineStyle: { width: 3 },
        areaStyle: { color: C.primary + '15' },
      },
      {
        name: 'Gastos',
        type: 'line',
        smooth: true,
        data: EVOLUCION_MENSUAL.map((d) => d.gastos),
        itemStyle: { color: C.warning },
        lineStyle: { width: 2, type: 'dashed' },
      },
      {
        name: 'Beneficio',
        type: 'line',
        smooth: true,
        data: EVOLUCION_MENSUAL.map((d) => d.beneficio),
        itemStyle: { color: C.success },
        lineStyle: { width: 3 },
        areaStyle: { color: C.success + '15' },
      },
    ],
  }), [])

  // Gráfico de barras horizontales: facturación por cliente
  const chartClientesOption = useMemo(() => ({
    tooltip: { trigger: 'axis', formatter: (params) => `${params[0].name}<br/>${formatEur(params[0].value)}` },
    grid: { left: '3%', right: '8%', top: '3%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { fontSize: 10, formatter: (v) => `${(v / 1000).toFixed(0)}k` } },
    yAxis: {
      type: 'category',
      data: CLIENTES_EXTRA.map((c) => c.nombre).reverse(),
      axisLabel: { fontSize: 10 },
    },
    series: [{
      type: 'bar',
      data: CLIENTES_EXTRA.map((c) => c.facturado).reverse(),
      itemStyle: { color: C.primary, borderRadius: [0, 6, 6, 0] },
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 9, formatter: (p) => `${(p.value / 1000).toFixed(1)}k` },
    }],
  }), [])

  // Gráfico de tarta: tipos de proyecto
  const chartTiposOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, fontSize: 10 },
    series: [{
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      label: { show: true, fontSize: 10, formatter: '{b}\n{d}%' },
      data: TIPOS_PROYECTO.map((t, i) => ({
        ...t,
        itemStyle: { color: [C.primary, C.info, C.success, C.warning, C.purple][i % 5] },
      })),
    }],
  }), [])

  // Gráfico de barras: presupuestos verificados vs pendientes
  const chartPresupuestosOption = useMemo(() => ({
    tooltip: { trigger: 'axis', formatter: (params) => `${params[0].name}: ${params[0].value}` },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['Verificados', 'Pendientes', 'Total'], axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
    series: [{
      type: 'bar',
      data: [
        { value: stats.presupuestosVerificados, itemStyle: { color: C.success, borderRadius: [6, 6, 0, 0] } },
        { value: stats.totalPresupuestos - stats.presupuestosVerificados, itemStyle: { color: C.warning, borderRadius: [6, 6, 0, 0] } },
        { value: stats.totalPresupuestos, itemStyle: { color: C.primary, borderRadius: [6, 6, 0, 0] } },
      ],
      barWidth: '45%',
      label: { show: true, position: 'top', fontSize: 11 },
    }],
  }), [stats])

  // Gráfico de barras: renders generados vs esperados
  const chartRendersOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['Generados', 'Esperados'], axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
    series: [{
      type: 'bar',
      data: [
        { value: stats.totalRendersGenerados, itemStyle: { color: C.success, borderRadius: [6, 6, 0, 0] } },
        { value: stats.totalRendersEsperados, itemStyle: { color: C.light, borderRadius: [6, 6, 0, 0] } },
      ],
      barWidth: '40%',
      label: { show: true, position: 'top', fontSize: 11 },
    }],
  }), [stats])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">Dashboard económico</h2>
        <p className="mt-1 text-sm text-surface-muted">
          Estadísticas del estudio: facturación, beneficio, gastos, renders, presupuestos y estado de proyectos.
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard valor={formatEur(stats.facturadoTotal)} etiqueta="Facturación total" subetiqueta={`${stats.totalProyectos} proyectos`} tone="brand" />
        <StatCard valor={formatEur(stats.beneficioEstimado)} etiqueta="Beneficio estimado" subetiqueta="Honorarios del estudio (30%)" tone="success" />
        <StatCard valor={formatEur(stats.gastosEstimados)} etiqueta="Gastos estimados" subetiqueta="Costes de obra y materiales (70%)" tone="warning" />
        <StatCard valor={`${stats.m2Totales.toFixed(1)} m²`} etiqueta="Superficie total" subetiqueta={`${stats.totalProyectos} proyectos`} />
      </div>

      {/* Gráficos fila 1: evolución mensual (líneas) + facturación por cliente (barras horizontales) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Evolución mensual</h3>
          <EChart option={chartEvolucionOption} height="320px" />
        </div>
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Facturación por cliente</h3>
          <EChart option={chartClientesOption} height="320px" />
        </div>
      </div>

      {/* Gráficos fila 2: tipos de proyecto (tarta) + presupuestos (barras) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Tipos de proyecto</h3>
          <EChart option={chartTiposOption} height="300px" />
        </div>
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Presupuestos</h3>
          <EChart option={chartPresupuestosOption} height="300px" />
          <div className="mt-4 pt-3 border-t border-brand-50 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-state-success">{stats.presupuestosVerificados}</p>
              <p className="text-xs text-surface-muted">Verificados</p>
            </div>
            <div>
              <p className="text-lg font-bold text-state-warning">{stats.totalPresupuestos - stats.presupuestosVerificados}</p>
              <p className="text-xs text-surface-muted">Pendientes</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-900">{stats.totalPresupuestos}</p>
              <p className="text-xs text-surface-muted">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de presupuestos */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Presupuestos por proyecto</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          {PRESUPUESTOS.map((p) => (
            <PresupuestoRow key={p.nombre} p={p} />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-brand-50 flex items-center justify-between">
          <span className="text-sm text-surface-muted">Valor total de presupuestos</span>
          <span className="text-lg font-bold text-brand-900">{formatEur(stats.facturadoTotal)}</span>
        </div>
      </div>
    </div>
  )
}