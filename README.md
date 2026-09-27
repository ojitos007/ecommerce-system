# Sistema de Comercio Electrónico - Arquitectura Hexagonal

Sistema de e-commerce desarrollado bajo **Arquitectura Hexagonal (Ports & Adapters)** con **Node.js, Express, PostgreSQL** en el Backend y **React, Vite, TypeScript** en el Frontend.

---

## 1. Diagrama Arquitectónico (Backend)

El backend sigue una estricta separación de capas de acuerdo con la Arquitectura Hexagonal:
+-----------------------------------------------------------------------+
|                    CAPA DE INFRAESTRUCTURA (ADAPTADORES)               |
|                                                                       |
|  [Adaptadores de Entrada (HTTP)]     [Adaptadores de Salida (DB/Auth)] |
|   - Express Routers                   - PostgreSQL Repository         |
|   - Controllers                       - Bcrypt / JWT Services         |
|             |                                   ^                     |
+-------------|-----------------------------------|---------------------+
| (Llama a)                         | (Implementa)
v                                   |
+-----------------------------------------------------------------------+
|                    CAPA DE APLICACIÓN (PUERTOS)                        |
|                                                                       |
|   - Casos de Uso (Auth, Product, Order)                               |
|   - Interfaces / Puertos (RepositoryPorts, HashPorts)                 |
|             |                                                         |
+-------------|---------------------------------------------------------+
| (Utiliza)
v
+-----------------------------------------------------------------------+
|                    CAPA DE DOMINIO (ENTIDADES Y REGLAS)               |
|                                                                       |
|   - Entidades puras: User, Product, Order, OrderItem                  |
|   - Reglas de negocio: Cálculo de totales, Validación de Stock       |
+-----------------------------------------------------------------------+

---

## 2. Especificación de Endpoints

### Autenticación y Usuarios
* `POST /api/users/register`: Registra un nuevo usuario con contraseña encriptada (Bcrypt).
* `POST /api/users/login`: Autentica credenciales y devuelve token JWT.

### Productos
* `GET /api/products`: Obtiene el catálogo completo de productos.
* `GET /api/products/:id`: Obtiene el detalle de un producto específico.
* `POST /api/products`: (Admin) Crea un nuevo producto.
* `PUT /api/products/:id`: (Admin) Actualiza precio, nombre o stock.
* `DELETE /api/products/:id`: (Admin) Elimina un producto.

### Pedidos
* `POST /api/orders`: Crea un pedido validando el stock disponible y calculando el total transaccional.
* `GET /api/orders/my-orders`: Obtiene los pedidos realizados por el usuario autenticado.
* `GET /api/orders/:id`: Obtiene el detalle de un pedido específico.

---

## 3. Estructura del Repositorio
ecommerce-system/
├── backend/
│   ├── src/
│   │   ├── domain/               # Entidades y reglas de negocio
│   │   │   ├── entities/
│   │   │   └── exceptions/
│   │   ├── application/          # Casos de uso y puertos/interfaces
│   │   │   ├── use-cases/
│   │   │   └── ports/
│   │   └── infrastructure/       # Adaptadores HTTP, DB y Cifrado
│   │       ├── http/
│   │       │   ├── controllers/
│   │       │   ├── middlewares/
│   │       │   └── routes/
│   │       ├── persistence/      # PostgreSQL Config & Repositories
│   │       └── security/         # Bcrypt & JWT implementation
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── frontend/
├── src/
│   ├── components/           # Componentes reutilizables (Navbar, Layout)
│   ├── context/              # Contexto de Autenticación
│   ├── pages/                # Vistas principales (Login, Products, Orders)
│   └── services/             # Adaptador de API (Axios instance)
├── package.json
└── vite.config.ts

---

## 4. Guía de Despliegue en Entorno Local (WSL / Linux)

### Requisitos Previos
* Node.js v18+ instalado en WSL.
* PostgreSQL corriendo en WSL (`sudo service postgresql start`).

### Pasos de Ejecución
1. **Configurar Base de Datos:**
   ```bash
   psql -U postgres -c "CREATE DATABASE ecommerce_db;"

   Configurar y Levantar Backend:

cd backend
npm install
# Configurar variables en .env (PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET)
npm run dev
Configurar y Levantar Frontend

cd ../frontend
npm install
npm run dev
Abrir en el navegador: http://localhost:5173.