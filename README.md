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
| Frontend | HTML + CSS + JS vanilla |
| Backend | Node.js + Express |
| Base de datos | [Turso](https://turso.tech) (libSQL) |
| Deploy | Vercel |
