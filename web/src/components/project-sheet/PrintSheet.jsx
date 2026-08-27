import { getClienteObj, getClienteNombre, getCompletitud, getEstancias } from '../../utils/project.js'
import { formatEur } from '../../data/projects.js'
import { planMaestroMock } from '../../data/plan-maestro.js'
import { presupuestoMock, importePartida, subtotalCapitulo, baseImponible } from '../../data/presupuesto.js'
import { rendersMock } from '../../data/renders.js'
import { memoriaMock, resolveImagenFicha } from '../../data/memoria-calidades.js'

// PrintSheet: professional print-only layout for the "Exportar ficha (PDF)".
// Each section has its own visual personality:
// - Plan: renders as visual headers + table
// - Presupuesto: clean tables
// - Memoria: editorial layout with images, text blocks and material cards

function Seccion({ numero, titulo, children, className }) {
  return (
    <section className={`print-section ${className || ''}`}>
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

export default function PrintSheet({ proyecto, seccionActiva }) {
  const cliente = getClienteObj(proyecto)
  const completitud = getCompletitud(proyecto)
  const plan = planMaestroMock
  const presu = presupuestoMock
  const renders = rendersMock
  const memoria = memoriaMock
  const base = baseImponible(presu)

  // Determine which sections to show based on the active tab:
  // - presupuesto: only the presupuesto
  // - memoria: everything recopiled (cliente, plan, presupuesto, renders, memoria)
  // - plan or any other: the full sheet (current behaviour)
  const soloPresupuesto = seccionActiva === 'presupuesto'
  const soloMemoria = seccionActiva === 'memoria'
  const mostrarTodo = !soloPresupuesto && !soloMemoria

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
        <p className="print-cover-label">{soloPresupuesto ? 'Presupuesto' : soloMemoria ? 'Memoria de calidades' : 'Ficha de proyecto'}</p>
        <h1 className="print-cover-title">{proyecto.nombre}</h1>
        <p className="print-cover-client">{getClienteNombre(proyecto)}</p>
        <div className="print-cover-meta">
          <span>{proyecto.ciudad || ''}</span>
          {proyecto.fecha ? <span>· {proyecto.fecha}</span> : null}
          {proyecto.m2 != null ? <span>· {proyecto.m2} m²</span> : null}
        </div>
        <span className="print-cover-badge">{proyecto.estado}</span>
      </div>

      {/* === SOLO PRESUPUESTO === */}
      {soloPresupuesto ? (
        <Seccion numero="01" titulo="Presupuesto">
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
                <p className="print-pending" style={{ marginTop: '4px', marginBottom: '4px' }}>Indica cantidad no gravable</p>
                <div className="print-fiscal-total"><span>TOTAL PRESUPUESTO</span><span>{formatEur(base)}</span></div>
              </div>
            </>
          ) : (
            <p className="print-pending">Presupuesto pendiente de generación.</p>
          )}
        </Seccion>
      ) : null}

      {/* === SOLO MEMORIA (recopila todo) === */}
      {soloMemoria ? (
        <>
          {/* Cliente */}
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

          {/* Plan maestro resumido */}
          <Seccion numero="02" titulo="Plan maestro">
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
                    <span className="print-metric-value">~{formatEur(plan.estimacionCostes)}</span>
                    <span className="print-metric-label">Estimación de costes y gastos</span>
                  </div>
                </div>

                {/* Resumen del proyecto */}
                <div className="print-text-block">
                  El proyecto <strong>{proyecto.nombre}</strong> para el cliente <strong>{getClienteNombre(proyecto)}</strong>
                  {' '}consiste en una reforma de estilo <strong>{proyecto.estilo || 'rústico mediterráneo'}</strong>
                  {' '}con una superficie total de <strong>{proyecto.m2 != null ? `${proyecto.m2} m²` : '—'}</strong>
                  {' '}y <strong>{proyecto.estancias || '—'} estancias</strong>.
                  {' '}El trabajo incluye demolición, albañilería, carpintería, fontanería, electricidad,
                  {' '}iluminación, pintura y mobiliario a medida.
                  {' '}Los materiales seleccionados combinan porcelánico arcilla, microcemento, madera maciza
                  {' '}y sanitarios de alta gama, manteniendo la estética mediterránea con iluminación cálida.
                </div>

                <p className="print-text-block">{plan.analisisEstilo}</p>
              </>
            ) : (
              <p className="print-pending">Plan maestro pendiente de generación.</p>
            )}
          </Seccion>

          {/* Resumen del presupuesto */}
          <Seccion numero="03" titulo="Resumen del presupuesto">
            {completitud.presupuesto ? (
              <>
                <div className="print-info-grid">
                  {presu.capitulos.map((cap) => (
                    <div key={cap.id} className="print-info-item">
                      <span className="print-info-label">{cap.nombre}</span>
                      <span className="print-info-value">{formatEur(cap.partidas.reduce((s, p) => s + p.cantidad * p.precio, 0))}</span>
                    </div>
                  ))}
                </div>
                <div className="print-fiscal">
                  <div className="print-fiscal-row"><span>Base imponible (sin IVA)</span><span>{formatEur(base)}</span></div>
                  <p className="print-pending" style={{ marginTop: '4px', marginBottom: '4px' }}>Indica cantidad no gravable</p>
                  <div className="print-fiscal-total"><span>TOTAL PRESUPUESTO</span><span>{formatEur(base)}</span></div>
                </div>
              </>
            ) : (
              <p className="print-pending">Presupuesto pendiente de generación.</p>
            )}
          </Seccion>

          {/* Renders resumidos */}
          <Seccion numero="04" titulo="Renders">
            {completitud.renders ? (
              <div className="print-renders">
                {renders.map((r) => (
                  <div key={r.id} className="print-render-card">
                    <img src={r.imagen} alt={r.nombre} className="print-render-img" />
                    <div className="print-render-info">
                      <h4>{r.nombre}</h4>
                      <p>{r.m2} m² · {r.iluminacion}</p>
                      <p>{r.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="print-pending">Renders pendientes de generación.</p>
            )}
          </Seccion>

          {/* Memoria de calidades — editorial */}
          <Seccion numero="05" titulo="Memoria de calidades" className="print-section-memoria">
            {completitud.memoria ? (
              <>
                <div className="print-memoria-intro">
                  <img src={renders[2].imagen} alt="Memoria" className="print-memoria-intro-img" />
                  <div className="print-memoria-intro-text">
                    <h3 className="print-memoria-intro-title">Memoria de calidades</h3>
                    <p className="print-memoria-intro-desc">
                      Documento que recopila todos los materiales y acabados del proyecto {proyecto.nombre}.
                      Formato #designstudio · A4 horizontal · Estética Lerycke Martí Design.
                    </p>
                    <p className="print-memoria-intro-meta">
                      {memoria.totalCategorias} categorías · {memoria.secciones.reduce((sum, s) => sum + s.materiales.length, 0)} materiales
                    </p>
                  </div>
                </div>

                <div className="print-memoria-editorial">
                  {memoria.secciones.map((sec) => (
                    <div key={sec.id} className="print-memoria-section-editorial">
                      <div className="print-memoria-section-header">
                        <span className="print-memoria-section-num">{sec.numero}</span>
                        <h3 className="print-memoria-section-title">{sec.titulo}</h3>
                        <div className="print-memoria-section-line" />
                      </div>
                      <div className="print-memoria-materials-grid">
                        {sec.materiales.map((f, fIdx) => (
                          <div key={f.id} className="print-memoria-material-card">
                            <img src={resolveImagenFicha(f, sec.numero, fIdx)} alt={f.nombre} className="print-memoria-material-img" />
                            <div className="print-memoria-material-body">
                              <span className="print-memoria-material-nombre">{f.nombre}</span>
                              <span className="print-memoria-material-marca">{f.marca} · {f.modelo}</span>
                              <span className="print-memoria-material-desc">{f.descripcion}</span>
                              <span className="print-memoria-material-ubi">Ubicación: {f.ubicacion}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="print-memoria-footer">
                  <img src="/brand/LOGOpinche-INSTA_LM.jpg" alt="LM" className="print-memoria-footer-logo" />
                  <p className="print-memoria-footer-text">
                    Memoria de calidades generada por LERYCKEMARTI #designstudio para el proyecto {proyecto.nombre}.
                    Todos los materiales están sujetos a disponibilidad de proveedor.
                  </p>
                </div>
              </>
            ) : (
              <p className="print-pending">Memoria de calidades pendiente de generación.</p>
            )}
          </Seccion>
        </>
      ) : null}

      {/* === TODO (ficha completa) === */}
      {mostrarTodo ? (
        <>
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
          { label: 'Estimación de presupuesto', value: proyecto.presupuestoTotal != null ? formatEur(proyecto.presupuestoTotal) : '' },
        ]} />
      </Seccion>

      {/* 03. Plan maestro — con imágenes de renders como cabecera visual */}
      <Seccion numero="03" titulo="Plan maestro" className="print-section-plan">
        {completitud.plan ? (
          <>
            {/* Cabecera visual con render */}
            <div className="print-plan-hero">
              <img src={renders[0].imagen} alt={renders[0].nombre} className="print-plan-hero-img" />
              <div className="print-plan-hero-overlay">
                <p className="print-plan-hero-label">{renders[0].nombre}</p>
                <p className="print-plan-hero-sub">{renders[0].m2} m² · {renders[0].iluminacion}</p>
              </div>
            </div>

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
                <span className="print-metric-value">~{formatEur(plan.estimacionCostes)}</span>
                <span className="print-metric-label">Estimación de costes y gastos</span>
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

            {/* Desglose de costes estimados */}
            <div className="print-capitulo">
              <h3 className="print-cap-title">Estimación de costes y gastos</h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th className="text-right">Importe estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {(plan.desgloseCostes || []).map((d) => (
                    <tr key={d.id}>
                      <td>{d.concepto}</td>
                      <td className="text-right">{formatEur(d.importe)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="print-subtotal-label">Total estimación de costes y gastos</td>
                    <td className="print-subtotal-value">{formatEur((plan.desgloseCostes || []).reduce((sum, d) => sum + (d.importe || 0), 0))}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="print-pending" style={{ marginTop: '6px' }}>
                Estimación orientativa. El ajuste económico detallado se realiza en la fase de presupuesto.
              </p>
            </div>

            {/* Segundo render al final del plan */}
            <div className="print-plan-secondary-img">
              <img src={renders[1].imagen} alt={renders[1].nombre} className="print-plan-secondary-render" />
              <p className="print-plan-secondary-caption">{renders[1].nombre} · {renders[1].descripcion}</p>
            </div>
          </>
        ) : (
          <p className="print-pending">Plan maestro pendiente de generación.</p>
        )}
      </Seccion>

      {/* 04. Presupuesto — tablas limpias */}
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
              <p className="print-pending" style={{ marginTop: '4px', marginBottom: '4px' }}>Indica cantidad no gravable</p>
              <div className="print-fiscal-total"><span>TOTAL PRESUPUESTO</span><span>{formatEur(base)}</span></div>
            </div>
          </>
        ) : (
          <p className="print-pending">Presupuesto pendiente de generación.</p>
        )}
      </Seccion>

      {/* 05. Renders — galería visual */}
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

      {/* 06. Memoria de calidades — documento editorial pulido */}
      <Seccion numero="06" titulo="Memoria de calidades" className="print-section-memoria">
        {completitud.memoria ? (
          <>
            {/* Intro de la memoria con render de fondo */}
            <div className="print-memoria-intro">
              <img src={renders[2].imagen} alt="Memoria" className="print-memoria-intro-img" />
              <div className="print-memoria-intro-text">
                <h3 className="print-memoria-intro-title">Memoria de calidades</h3>
                <p className="print-memoria-intro-desc">
                  Documento que recopila todos los materiales y acabados del proyecto {proyecto.nombre}.
                  Formato #designstudio · A4 horizontal · Estética Lerycke Martí Design.
                </p>
                <p className="print-memoria-intro-meta">
                  {memoria.totalCategorias} categorías · {memoria.secciones.reduce((sum, s) => sum + s.materiales.length, 0)} materiales
                </p>
              </div>
            </div>

            {/* Secciones de memoria con estilo editorial */}
            <div className="print-memoria-editorial">
              {memoria.secciones.map((sec) => (
                <div key={sec.id} className="print-memoria-section-editorial">
                  <div className="print-memoria-section-header">
                    <span className="print-memoria-section-num">{sec.numero}</span>
                    <h3 className="print-memoria-section-title">{sec.titulo}</h3>
                    <div className="print-memoria-section-line" />
                  </div>

                  <div className="print-memoria-materials-grid">
                    {sec.materiales.map((f, fIdx) => (
                      <div key={f.id} className="print-memoria-material-card">
                        {/* Cada ficha usa su propia imagen (o la de su seccion) */}
                        <img
                          src={resolveImagenFicha(f, sec.numero, fIdx)}
                          alt={f.nombre}
                          className="print-memoria-material-img"
                        />
                        <div className="print-memoria-material-body">
                          <span className="print-memoria-material-nombre">{f.nombre}</span>
                          <span className="print-memoria-material-marca">{f.marca} · {f.modelo}</span>
                          <span className="print-memoria-material-desc">{f.descripcion}</span>
                          <span className="print-memoria-material-ubi">Ubicación: {f.ubicacion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cierre de memoria */}
            <div className="print-memoria-footer">
              <img src="/brand/LOGOpinche-INSTA_LM.jpg" alt="LM" className="print-memoria-footer-logo" />
              <p className="print-memoria-footer-text">
                Memoria de calidades generada por LERYCKEMARTI #designstudio para el proyecto {proyecto.nombre}.
                Todos los materiales están sujetos a disponibilidad de proveedor.
              </p>
            </div>
          </>
        ) : (
          <p className="print-pending">Memoria de calidades pendiente de generación.</p>
        )}
      </Seccion>

      {/* 07. Resumen */}
      <Seccion numero="07" titulo="Resumen">
        <div className="print-metrics">
          <div className="print-metric">
            <span className="print-metric-value">{proyecto.presupuestoTotal != null ? formatEur(proyecto.presupuestoTotal) : '—'}</span>
            <span className="print-metric-label">Estimación de presupuesto</span>
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
        </>
      ) : null}

      {/* Footer */}
      <div className="print-footer">
        <img src="/brand/LOGOpinche-INSTA_LM.jpg" alt="LM" className="print-footer-logo" />
        <p>LERYCKEMARTI #designstudio · Ficha generada el {new Date().toLocaleDateString('es-ES')}</p>
      </div>
    </div>
  )
}