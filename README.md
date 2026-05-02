# Lab07 Web JWT Serva

Aplicación web con autenticación JWT, roles `user` y `admin`, vistas EJS y persistencia en MongoDB.

## Stack

- Node.js
- Express
- MongoDB + Mongoose
- EJS
- Materialize CSS
- JWT

## Funcionalidades

- Registro de usuarios con:
  - `name`
  - `lastName`
  - `phoneNumber`
  - `birthdate`
  - `email`
  - `password`
- Cálculo automático de edad a partir de `birthdate`
- Inicio de sesión con JWT
- Token guardado en `sessionStorage`
- Dashboard para usuario
- Dashboard para administrador
- Perfil editable
- Protección de rutas por autenticación y rol
- Páginas `403` y `404`

## Estructura principal

```text
src/
  controllers/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
  views/
public/
  css/
  js/
```

## Requisitos

- Node.js 18 o superior
- MongoDB local ejecutándose en `mongodb://localhost:27017`

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/sesema98/Lab07_web_jwt_serva.git
cd Lab07_web_jwt_serva
```

2. Instala dependencias:

```bash
npm install
```

3. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

4. Inicia MongoDB local.

Si usas Homebrew en macOS:

```bash
brew services start mongodb/brew/mongodb-community
```

## Variables de entorno

Archivo `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=f14e6a1c9843c52190c07232dfb9c0e467d5a910
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
```

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Aplicación web:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

## Usuarios de prueba

Al iniciar la aplicación se crean usuarios semilla si no existen:

### Admin

- Email: `admin@example.com`
- Password: `Admin123!`

### User

- Email: `user@example.com`
- Password: `User123!`

## Rutas web

- `GET /signIn`
- `GET /signUp`
- `GET /dashboard`
- `GET /dashboard/user`
- `GET /dashboard/admin`
- `GET /profile`
- `GET /403`

## API

### Auth

- `POST /api/auth/signUp`
- `POST /api/auth/signIn`

### Users

- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users`
- `GET /api/users/:id`

## Reglas de acceso

- Si no hay token válido, el frontend redirige a `/signIn`
- Si el token expira, se elimina la sesión y se redirige a `/signIn`
- `user` puede entrar a su dashboard y a su perfil
- `admin` puede entrar al dashboard de administrador y ver el listado completo de usuarios

## Ejemplo de registro

```json
{
  "name": "Sergio",
  "lastName": "Serva",
  "phoneNumber": "999888777",
  "birthdate": "1998-04-20",
  "email": "sergio@example.com",
  "password": "Secret123!"
}
```

## Ejemplo de login

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

## Ver datos en MongoDB

Entrar a la consola:

```bash
mongosh
```

Luego:

```javascript
use auth_db
show collections
db.users.find({}, { password: 0 }).pretty()
db.roles.find().pretty()
```

## Notas

- `node_modules` y `.env` no se suben al repositorio
- La contraseña se almacena hasheada con `bcrypt`
- El rol por defecto al registrarse es `user`

## Autor

- Sergio Serva
