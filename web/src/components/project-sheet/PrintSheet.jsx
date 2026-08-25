import { getClienteObj, getClienteNombre, getCompletitud, getEstancias } from '../../utils/project.js'
import { formatEur } from '../../data/projects.js'
import { planMaestroMock } from '../../data/plan-maestro.js'
import { presupuestoMock, importePartida, subtotalCapitulo, baseImponible, ivaImporte, totalPresupuesto } from '../../data/presupuesto.js'
import { rendersMock } from '../../data/renders.js'
import { memoriaMock } from '../../data/memoria-calidades.js'

// PrintSheet: professional print-only layout for the "Exportar ficha (PDF)".
// Shows the verified project data in read-only mode with brand identity.
// This component is only rendered inside a .print-only container that is
// hidden on screen and shown only during window.print().

function Seccion({ numero, titulo, children }) {
  return (
    <section className="print-section">
      <h2 className="print-section-title">
        {numero ? <span className="print-section-num">{numero}</span> : null}
        {titulo}
      </h2>
      <div className="print-section-body">{children}</div>
    </section>
  )
}

function InfoGrid({ items }) {
  return (
    <div className="print-info-grid">
      {items.map(({ label, value }) => (
        <div key={label} className="print-info-item">
          <span className="print-info-label">{label}</span>
          <span className="print-info-value">{value || '—'}</span>
        </div>
      ))}
    </div>
  )
}

export default function PrintSheet({ proyecto }) {
  const cliente = getClienteObj(proyecto)
  const completitud = getCompletitud(proyecto)
  const plan = planMaestroMock
  const presu = presupuestoMock
  const renders = rendersMock
  const memoria = memoriaMock
  const base = baseImponible(presu)
  const iva = ivaImporte(presu)
  const total = totalPresupuesto(presu)

  return (
    <div className="print-sheet">
      {/* Header con logo */}
      <div className="print-header">
        <img src="/brand/LOGOpinche-web_COMPLETO.jpg" alt="LERYCKEMARTI" className="print-logo" />
        <div className="print-header-info">
          <p className="print-tagline">#designstudio</p>
        </div>
      </div>

      {/* Portada del proyecto */}
      <div className="print-cover">
        <p className="print-cover-label">Ficha de proyecto</p>
        <h1 className="print-cover-title">{proyecto.nombre}</h1>
        <p className="print-cover-client">{getClienteNombre(proyecto)}</p>
        <div className="print-cover-meta">
          <span>{proyecto.ciudad || ''}</span>
          {proyecto.fecha ? <span>· {proyecto.fecha}</span> : null}
          {proyecto.m2 != null ? <span>· {proyecto.m2} m²</span> : null}
        </div>
        <span className="print-cover-badge">{proyecto.estado}</span>
      </div>

      {/* 01. Cliente */}
      <Seccion numero="01" titulo="Cliente">
        <InfoGrid items={[
          { label: 'Nombre', value: getClienteNombre(proyecto) },
          { label: 'CIF / NIF', value: cliente.cif },
          { label: 'Email', value: cliente.email },
          { label: 'Teléfono', value: cliente.telefono },
          { label: 'Dirección', value: cliente.direccion },
          { label: 'Ciudad', value: cliente.ciudad },
          { label: 'Código postal', value: cliente.codigoPostal },
        ]} />
      </Seccion>

      {/* 02. Datos del proyecto */}
      <Seccion numero="02" titulo="Datos del proyecto">
        <InfoGrid items={[
          { label: 'Nombre', value: proyecto.nombre },
          { label: 'Tipo', value: proyecto.tipo },
          { label: 'Estilo / concepto', value: proyecto.estilo },
          { label: 'm²', value: proyecto.m2 != null ? `${proyecto.m2} m²` : '' },
          { label: 'Estancias', value: String(getEstancias(proyecto)) },
          { label: 'Presupuesto total', value: proyecto.presupuestoTotal != null ? formatEur(proyecto.presupuestoTotal) : '' },
        ]} />
      </Seccion>

      {/* 03. Plan maestro */}
      <Seccion numero="03" titulo="Plan maestro">
        {completitud.plan ? (
          <>
            <div className="print-metrics">
              <div className="print-metric">
                <span className="print-metric-value">{plan.estancias.length}</span>
                <span className="print-metric-label">Estancias</span>
              </div>
              <div className="print-metric">
                <span className="print-metric-value">{plan.m2Totales} m²</span>
                <span className="print-metric-label">m² totales</span>
              </div>
              <div className="print-metric">
                <span className="print-metric-value">~{formatEur(plan.presupuestoEstimado)}</span>
                <span className="print-metric-label">Presupuesto est.</span>
              </div>
            </div>

            <table className="print-table">
              <thead>
                <tr>
                  <th>Estancia</th><th>Tag</th><th>m²</th><th>Tipo reforma</th><th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {plan.estancias.map((e) => (
                  <tr key={e.id}>
                    <td>{e.nombre}</td><td>{e.tag}</td><td>{e.m2} m²</td><td>{e.tipoReforma}</td><td>{e.detalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="print-chips">
              {plan.trabajos.map((t) => (
                <span key={t} className="print-chip">{t}</span>
              ))}
            </div>

            <div className="print-materials">
              {plan.materiales.map((m) => (
                <div key={m.id} className="print-material">
                  <span className="print-material-cat">{m.categoria}</span>
                  <span className="print-material-desc">{m.descripcion}</span>
                  <span className="print-material-brand">{m.marca} · {m.modelo}</span>
                </div>
              ))}
            </div>

            <p className="print-text-block">{plan.analisisEstilo}</p>
          </>
        ) : (
          <p className="print-pending">Plan maestro pendiente de generación.</p>
        )}
      </Seccion>

      {/* 04. Presupuesto */}
      <Seccion numero="04" titulo="Presupuesto">
        {completitud.presupuesto ? (
          <>
            {presu.capitulos.map((cap) => (
              <div key={cap.id} className="print-capitulo">
                <h3 className="print-cap-title">{cap.nombre}</h3>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>REF</th><th>Descripción</th><th>UD</th><th>Cant.</th><th>Precio</th><th>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cap.partidas.map((p) => (
                      <tr key={p.ref}>
                        <td>{p.ref}</td><td>{p.descripcion}</td><td>{p.ud}</td>
                        <td>{p.cantidad.toFixed(2)}</td><td>{formatEur(p.precio)}</td><td>{formatEur(importePartida(p))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="print-subtotal-label">Subtotal {cap.nombre}</td>
                      <td className="print-subtotal-value">{formatEur(subtotalCapitulo(cap))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}

            <div className="print-fiscal">
              <div className="print-fiscal-row"><span>Base imponible</span><span>{formatEur(base)}</span></div>
              <div className="print-fiscal-row"><span>IVA ({presu.iva}%)</span><span>{formatEur(iva)}</span></div>
              <div className="print-fiscal-total"><span>TOTAL</span><span>{formatEur(total)}</span></div>
            </div>
          </>
        ) : (
          <p className="print-pending">Presupuesto pendiente de generación.</p>
        )}
      </Seccion>

      {/* 05. Renders */}
      <Seccion numero="05" titulo="Renders">
        {completitud.renders ? (
          <div className="print-renders">
            {renders.map((r) => (
              <div key={r.id} className="print-render-card">
                <img src={r.imagen} alt={r.nombre} className="print-render-img" />
                <div className="print-render-info">
                  <h4>{r.nombre}</h4>
                  <p>{r.m2} m² · {r.iluminacion}</p>
                  <p>{r.enfoque} · {r.tipoLuz}</p>
                  <p>{r.descripcion}</p>
                  <div className="print-render-materials">
                    {r.materiales.map((m) => (
                      <span key={m} className="print-chip">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="print-pending">Renders pendientes de generación.</p>
        )}
      </Seccion>

      {/* 06. Memoria de calidades */}
      <Seccion numero="06" titulo="Memoria de calidades">
        {completitud.memoria ? (
          <div className="print-memoria">
            {memoria.secciones.map((sec) => (
              <div key={sec.id} className="print-memoria-sec">
                <h3 className="print-memoria-title">
                  <span className="print-memoria-num">{sec.numero}</span>
                  {sec.titulo}
                </h3>
                {sec.materiales.map((f) => (
                  <div key={f.id} className="print-memoria-ficha">
                    <span className="print-memoria-nombre">{f.nombre}</span>
                    <span className="print-memoria-marca">{f.marca} · {f.modelo}</span>
                    <span className="print-memoria-desc">{f.descripcion}</span>
                    <span className="print-memoria-ubi">Ubicación: {f.ubicacion}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="print-pending">Memoria de calidades pendiente de generación.</p>
        )}
      </Seccion>

      {/* 07. Resumen */}
      <Seccion numero="07" titulo="Resumen">
        <div className="print-metrics">
          <div className="print-metric">
            <span className="print-metric-value">{proyecto.presupuestoTotal != null ? formatEur(proyecto.presupuestoTotal) : '—'}</span>
            <span className="print-metric-label">Presupuesto total</span>
          </div>
          <div className="print-metric">
            <span className="print-metric-value">{proyecto.docs?.renders?.generados || 0}</span>
            <span className="print-metric-label">Renders generados</span>
          </div>
          <div className="print-metric">
            <span className="print-metric-value">{completitud.memoria ? '8' : '0'}</span>
            <span className="print-metric-label">Categorías de memoria</span>
          </div>
          <div className="print-metric">
            <span className="print-metric-value">{getEstancias(proyecto)}</span>
            <span className="print-metric-label">Estancias</span>
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr><th>Documento</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr><td>Cliente + datos</td><td>{completitud.cliente ? 'OK' : 'Pendiente'}</td></tr>
            <tr><td>Plan maestro</td><td>{completitud.plan ? 'OK' : 'Pendiente'}</td></tr>
            <tr><td>Presupuesto</td><td>{completitud.presupuesto ? 'OK' : 'Pendiente'}</td></tr>
            <tr><td>Renders</td><td>{completitud.renders ? 'OK' : 'Pendiente'}</td></tr>
            <tr><td>Memoria</td><td>{completitud.memoria ? 'OK' : 'Pendiente'}</td></tr>
          </tbody>
        </table>
      </Seccion>

      {/* Footer */}
      <div className="print-footer">
        <img src="/brand/LOGOpinche-INSTA_LM.jpg" alt="LM" className="print-footer-logo" />
        <p>LERYCKEMARTI #designstudio · Ficha generada el {new Date().toLocaleDateString('es-ES')}</p>
      </div>
    </div>
  )
}