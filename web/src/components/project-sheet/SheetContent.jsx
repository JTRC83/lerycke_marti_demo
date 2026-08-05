import ClienteTab from './tabs/ClienteTab.jsx'
import PlanTab from './tabs/PlanTab.jsx'
import PresupuestoTab from './tabs/PresupuestoTab.jsx'
import RendersTab from './tabs/RendersTab.jsx'
import MemoriaTab from './tabs/MemoriaTab.jsx'
import ResumenTab from './tabs/ResumenTab.jsx'

// SheetContent: right-hand area that renders the active tab. Only the content
// changes when switching tabs; the header and submenu stay in place.
export default function SheetContent({ activa, proyecto, onIrDashboard, onTabChange }) {
  switch (activa) {
    case 'cliente':
      return <ClienteTab proyecto={proyecto} onIrPlan={() => onTabChange('plan')} />
    case 'plan':
      return <PlanTab proyecto={proyecto} />
    case 'presupuesto':
      return <PresupuestoTab proyecto={proyecto} />
    case 'renders':
      return <RendersTab proyecto={proyecto} />
    case 'memoria':
      return <MemoriaTab proyecto={proyecto} />
    case 'resumen':
      return <ResumenTab proyecto={proyecto} onIrDashboard={onIrDashboard} />
    default:
      return <ClienteTab proyecto={proyecto} onIrPlan={() => onTabChange('plan')} />
  }
}