# Planificador de Exámenes

Herramienta de planificación de estudio para convocatorias de exámenes. Diseñada para organizar asignaturas, hacer seguimiento de temas, registrar repasos y visualizar el tiempo disponible antes de cada examen.

**Idea y diseño original:** [Marta Ortego](https://www.linkedin.com/in/martaortegoh/)

---

## ¿Para qué sirve?

Cuando tienes varios exámenes en un período corto, es fácil perder la noción de cuánto has estudiado cada tema y cuánto tiempo te queda. Este planificador resuelve exactamente eso:

- **Calendario visual** — vista mensual con tus exámenes y los días de estudio planificados
- **Seguimiento de temas** — marca cada tema como *sin ver*, *repasando* o *dominado*
- **Tabla de repasos** — registra cuántas veces has repasado cada tema para identificar los que necesitan más atención
- **Estadísticas** — porcentaje de preparación por asignatura y días restantes hasta cada examen
- **Multi-dispositivo** — los datos se sincronizan en la nube; accede desde cualquier dispositivo

## ¿Por qué este enfoque?

### Sin registro tradicional
La cuenta se crea con **4 palabras aleatorias en español** (estilo Mullvad VPN). No hay email ni contraseña que recordar, gestionar ni que pueda ser comprometido. Las palabras son la cuenta — quien las tiene, accede.

### Sin framework de frontend
Toda la interfaz es HTML + CSS + JS vanilla en un único archivo. Sin build step, sin dependencias de cliente, sin bundle que mantener.

### Doble capa de persistencia
Los datos se guardan en `localStorage` de forma inmediata (la UI nunca espera) y se sincronizan en background con la base de datos en la nube. Si no hay conexión, los datos siguen accesibles localmente.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + CSS + JS vanilla (sin frameworks) |
| Backend | Node.js + Express |
| Base de datos | [Turso](https://turso.tech) (libSQL / SQLite en la nube) |
| Deploy | Vercel |

---

## Desarrollo local

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd planificador-examenes
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
TURSO_URL=file:local.db    # SQLite local para desarrollo
TURSO_AUTH_TOKEN=
PORT=3001
```

Para producción, crea una base de datos en [Turso](https://turso.tech) y usa sus credenciales.

### 3. Arrancar

```bash
npm start
# → http://localhost:3001
```

---

## Deploy en Vercel

### Requisitos previos

```bash
npm install -g vercel
```

### Variables de entorno en Vercel

Necesitas una base de datos Turso real (no `file:local.db`):

```bash
# Instalar CLI de Turso
npm install -g @turso/cli

# Login y crear base de datos
turso auth login
turso db create examenes-prod

# Obtener credenciales
turso db show examenes-prod --url
turso db tokens create examenes-prod
```

### Deploy

```bash
# Primer deploy (te guía paso a paso)
vercel

# Añadir variables de entorno
vercel env add TURSO_URL
vercel env add TURSO_AUTH_TOKEN

# Deploy a producción
vercel --prod
```

---

## Estructura del proyecto

```
├── index.html      # Toda la UI (login + setup + app)
├── server.js       # API REST + conexión Turso
├── words_es.js     # Lista de 500+ palabras para generar cuentas
├── vercel.json     # Configuración de deploy
├── package.json
├── .env.example
└── .gitignore
```

---

## Licencia

MIT
