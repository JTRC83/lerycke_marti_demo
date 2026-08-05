# 00 Login / Registro

Pantalla de acceso obligatorio del SaaS LERYCKEMARTI #designestudio. Todo usuario
debe iniciar sesion o registrarse antes de llegar al dashboard.

## Resumen

Pantalla unica de autenticacion que bloquea el acceso a la aplicacion. Presenta dos
modos intercambiables (Iniciar sesion / Crear cuenta) sobre el fondo de marca verde
oscuro, con el logo y el monograma LM. Es la unica pantalla sin sidebar ni topbar. El
acceso es demo: cualquier email + contrasena valida en formato, o registro con
nombre + email + contrasena, entra al dashboard.

## Objetivos

- Bloquear el acceso a la app hasta que el usuario se identifique.
- Ofrecer login y registro en una misma pantalla, alternando con pestañas.
- Reflejar la identidad premium de marca (verde oscuro, blanco, monograma LM).
- Ser el punto de entrada unico; tras exito, redirigir al dashboard (PRD 01).

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `01_brand/LOGOpinche-INSTA_LM.jpg` | Monograma LM usado como sello grafico en la pantalla de acceso. |
| `01_brand/LOGOpinche-web_COMPLETO.jpg` | Logo completo LERYCKEMARTI + tagline, usado en cabecera del login. |

No existe captura de UI previa para esta pantalla; se disena nueva siguiendo la
paleta y tipografia de marca ya aplicadas en el dashboard.

## Layout y componentes

### Layout (pantalla completa, sin chrome global)

| Zona | Componente | Descripcion |
|------|------------|-------------|
| Fondo | `LoginBackground` | Verde oscuro de marca a pantalla completa. |
| Panel central | `LoginCard` | Tarjeta blanca centrada, max-width ~420px, sombra suave, bordes rectos. |
| Cabecera de card | `BrandHeader` | Monograma LM arriba, logo LERYCKEMARTI + tagline "designestudio" debajo. |
| Tabs | `AuthTabs` | Dos pestañas: "Iniciar sesion" (por defecto) y "Crear cuenta". |
| Formulario | `LoginForm` / `RegisterForm` | Campos segun tab activo. |
| Pie de card | `AuthFooter` | Linea pequena: "Demo LERYCKEMARTI #designestudio". |

### Formulario: Iniciar sesion

| Campo | Tipo | Obligatorio | Placeholder |
|-------|------|-------------|-------------|
| Email | email | Si | "tu@email.com" |
| Contrasena | password | Si | "********" |

Boton primario: "Entrar".

### Formulario: Crear cuenta

| Campo | Tipo | Obligatorio | Placeholder |
|-------|------|-------------|-------------|
| Nombre | text | Si | "Tu nombre" |
| Email | email | Si | "tu@email.com" |
| Contrasena | password | Si | "Minimo 6 caracteres" |

Boton primario: "Crear cuenta".

## Datos y estado

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| modo | enum | "login" / "registro" (tab activo). |
| valores | object | { nombre?, email, contrasena } |
| errors | object | Errores de validacion por campo. |
| enviando | boolean | Estado de carga del submit. |
| sesionIniciada | boolean | Tras exito, true y redirige a dashboard. |

Entidad Usuario (mock, demo):

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "usr-001" |
| nombre | string | "Lerycke" |
| email | string | "demo@lerycke.es" |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Click en tab "Iniciar sesion" | Muestra el formulario de login. |
| Click en tab "Crear cuenta" | Muestra el formulario de registro. |
| Submit login con campos validos | `enviando=true`, tras ~600ms `sesionIniciada=true`, redirige al dashboard (PRD 01). |
| Submit login con campos invalidos | Muestra errores: email invalido, contrasena vacia. |
| Submit registro con campos validos | Crea usuario mock, inicia sesion y redirige al dashboard. |
| Submit registro con campos invalidos | Muestra errores: nombre vacio, email invalido, contrasena < 6. |

## Reglas de negocio

- No existe pantalla ni ruta de la app accesible sin sesion iniciada (excepto el login).
- La autenticacion es simulada: no hay backend ni persistencia; cualquier email
  valido en formato y contrasena con longitud minima entra.
- El registro crea un usuario mock en memoria; al recargar se pierde.
- El email se valida con formato estandar (regex simple).
- La contrasena minima es de 6 caracteres.

## Criterios de aceptacion

- [ ] La pantalla ocupa todo el viewport con fondo verde oscuro de marca.
- [ ] No se muestra sidebar ni topbar en esta pantalla.
- [ ] La tarjeta central muestra el monograma LM y el logo LERYCKEMARTI + tagline.
- [ ] Las dos pestañas "Iniciar sesion" y "Crear cuenta" son intercambiables.
- [ ] El formulario de login pide email y contrasena.
- [ ] El formulario de registro pide nombre, email y contrasena.
- [ ] El submit con campos vacios muestra errores de validacion.
- [ ] El submit valido muestra brevemente estado de carga y redirige al dashboard.
- [ ] Tipografia sans-serif de alto contraste, blanco sobre verde, estilo premium.

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `LoginBackground`, `LoginCard`, `BrandHeader`, `AuthTabs`, `LoginForm`, `RegisterForm`, `FormField`. |
| Assets | Logo y monograma en `01_brand/`. |
| Ruta | `/login` (o raiz si no hay sesion). Proteger el resto de rutas. |
| Estado de sesion | `AuthContext` con `sesionIniciada`; las rutas privadas redirigen a `/login` si es false. |
| Simulacion | Funcion `autenticar(email, pass)` que devuelve `Promise` resuelta tras `setTimeout(600)`. |
| Datos mock | Usuario demo por defecto visible como ayuda: email "demo@lerycke.es", pass "demo123". |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Backend real de autenticacion.
- Recuperacion de contrasena (olvide mi contrasena).
- Login social (Google, Apple).
- Verificacion de email.
- Multiusuario con roles y permisos.
- Persistencia de sesion entre recargas.