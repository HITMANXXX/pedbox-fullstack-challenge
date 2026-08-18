# ⚡ Pokédex Fullstack Challenge

¡Bienvenido al repositorio de la prueba técnica Fullstack! Este proyecto es una aplicación web moderna que funciona como una Pokédex interactiva. Los usuarios pueden registrarse, iniciar sesión de forma segura y explorar un listado de Pokémon extraídos directamente desde la **PokéAPI** oficial.

---

## 🛠️ Stack Tecnológico

El proyecto está dividido en dos aplicaciones principales que se comunican entre sí:

### ⚙️ Backend
- **NestJS** (Framework Node.js robusto y escalable)
- **Prisma** (ORM tipado para la base de datos)
- **PostgreSQL** (Base de datos relacional)
- **Docker** (Contenedorización de servicios)
- **JWT (JSON Web Tokens)** (Autenticación y seguridad)

### 🎨 Frontend
- **React 19** (Librería de interfaces)
- **Vite** (Empaquetador ultrarrápido)
- **Tailwind CSS v4** (Framework de utilidades CSS)
- **Axios** (Cliente HTTP para peticiones)

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu máquina:
- **[Node.js](https://nodejs.org/)** (v18 o superior recomendado)
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Para levantar la base de datos PostgreSQL)

---

## 🚀 Instalación y Ejecución Paso a Paso

Sigue estas instrucciones para levantar el proyecto en tu entorno local.

### Paso 1: Levantar la base de datos
Asegúrate de que Docker Desktop esté en ejecución. Abre una terminal en la raíz principal del proyecto (pedbox-fullstack-challenge) y ejecuta::
```bash
docker-compose up -d
```
> Esto descargará y levantará un contenedor de PostgreSQL en el puerto `5432`.

### Paso 2: Configurar variables de entorno
Dentro de la carpeta `backend/`, crea un archivo llamado `.env` basándote en un archivo `.env.example` (si existe) o simplemente créalo con la siguiente estructura y credenciales de desarrollo:

```env
# URL de conexión a la base de datos levantada en Docker
DATABASE_URL="postgresql://pedbox_user:pedbox_password@localhost:5432/pedbox_db?schema=public"

# Secreto para la firma de tokens JWT
JWT_SECRET="mi_super_secreto_seguro_123"
```

### Paso 3: Backend
Abre una nueva terminal, dirígete a la carpeta del backend y ejecuta los siguientes comandos para instalar dependencias, sincronizar el esquema de la base de datos y levantar el servidor:

```bash
cd backend
npm install
npx prisma db push
npm run start:dev
```
> El backend estará corriendo en `http://localhost:3000`.

### Paso 4: Frontend
Abre otra terminal, entra a la carpeta del frontend, instala las dependencias y corre el servidor de desarrollo:

```bash
cd frontend
npm install
npm run dev
```
> El frontend estará disponible en `http://localhost:5173` (o el puerto que te indique Vite).

---

## 🔌 Uso de la API (Sincronización Inicial)

Una vez que tengas ambos servidores corriendo, la base de datos de PostgreSQL estará vacía. Para poblarla con la lista oficial de Pokémon, debes realizar una petición a la API.

Puedes hacer una llamada rápida usando Thunder Client, Postman o cURL al siguiente endpoint:

```http
POST http://localhost:3000/pokemon/sync
```

Solo necesitas hacer esta llamada **una sola vez**. El backend se conectará automáticamente a la PokéAPI, descargará los primeros 50 Pokémon, extraerá sus imágenes, nombres y tipos, y los guardará en tu base de datos local listos para ser consumidos por el Frontend.

---
✨ *¡Todo listo! Ve al Frontend, regístrate como un Nuevo Entrenador y ¡Atraparlos ya!* ✨
