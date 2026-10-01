# Especificación de Arquitectura de Solución: Monolito Modular

## 1. Diseño General de la Solución

* **Patrón Arquitectónico:** Monolito Modular basado en *Features* dentro de una estructura Monorepo[span_0](start_span)[span_0](end_span).
* **Entorno de Ejecución y Desarrollo:** GitHub Codespaces[span_1](start_span)[span_1](end_span).
* **Gestión de Monorepo:** `npm workspaces`[span_2](start_span)[span_2](end_span).
* **Estrategia de Ramificación:** Trunk-Based Development[span_3](start_span)[span_3](end_span).
* **Stack de Tecnologías:**
  * **Frontend (Client):** React, TypeScript, Vite[span_4](start_span)[span_4](end_span)[span_5](start_span)[span_5](end_span).
  * **Backend (Server):** Express, TypeScript[span_6](start_span)[span_6](end_span)[span_7](start_span)[span_7](end_span).
  * **Persistencia:** `LocalStorage` en el cliente para conservar sesión, perfil, saldo y trazabilidad de transacciones[span_8](start_span)[span_8](end_span)[span_9](start_span)[span_9](end_span).
  * **Paquete Compartido (Shared):** Paquete local TypeScript para tipado estricto y DTOs[span_10](start_span)[span_10](end_span)[span_11](start_span)[span_11](end_span).

---

## 2. Arquitectura de Proyectos y Aplicaciones

### 2.1 Paquete Compartido (`packages/shared`)
Aísla las definiciones de tipo y contratos de datos reutilizables entre el cliente y el servidor sin duplicar código[span_12](start_span)[span_12](end_span)[span_13](start_span)[span_13](end_span). Contiene:
* Interfaces de modelo de usuario, perfil y estado de sesión[span_14](start_span)[span_14](end_span)[span_15](start_span)[span_15](end_span).
* Data Transfer Objects (DTOs) para solicitudes y respuestas del servicio SnailPay[span_16](start_span)[span_16](end_span)[span_17](start_span)[span_17](end_span).
* Tipos para los estados de transacción (aprobado, rechazado, error de sistema)[span_18](start_span)[span_18](end_span)[span_19](start_span)[span_19](end_span).

### 2.2 Aplicación Cliente (`packages/client`)
Diseñada bajo el enfoque *Feature-First Architecture*, dividiendo la UI y el estado por dominio funcional[span_20](start_span)[span_20](end_span).
* **Capa Core / Presentación General:** Componentes reutilizables de UI y estructuras de maquetación (layouts)[span_21](start_span)[span_21](end_span).
* **Capa de Módulos (Features):**
  * **Módulo de Autenticación (`auth`):** Gestión del registro, inicio de sesión, protección de rutas y ciclo de vida de la sesión[span_22](start_span)[span_22](end_span)[span_23](start_span)[span_23](end_span).
  * **Módulo de Dashboard (`dashboard`):** Visualización del perfil del usuario, saldo actual y componentes de renderizado gráfico de métricas simuladas[span_24](start_span)[span_24](end_span)[span_25](start_span)[span_25](end_span).
  * **Módulo de Pasarela (`snailpay`):** Captura de datos de tarjeta, envío de solicitudes de recarga y procesamiento de notificaciones de estado[span_26](start_span)[span_26](end_span)[span_27](start_span)[span_27](end_span).
* **Capa de Servicios y Persistencia:** Abstracción unificada y fuertemente tipada para las operaciones de lectura/escritura en `LocalStorage`[span_28](start_span)[span_28](end_span)[span_29](start_span)[span_29](end_span).
* **Capa de Enrutamiento:** Control de navegación y guards para restricción de acceso a vistas protegidas[span_30](start_span)[span_30](end_span)[span_31](start_span)[span_31](end_span).

### 2.3 Aplicación Servidor (`packages/server`)
Diseñada como una API REST sin estado (*stateless*), desacoplada por módulos de servicio[span_32](start_span)[span_32](end_span)[span_33](start_span)[span_33](end_span).
* **Capa de Configuración:** Gestión de variables de entorno y políticas CORS[span_34](start_span)[span_34](end_span).
* **Capa de Middlewares:**
  * Validación estricta de esquemas de entrada para solicitudes HTTP[span_35](start_span)[span_35](end_span).
  * Manejador global de excepciones y formateador de errores HTTP[span_36](start_span)[span_36](end_span).
  * Middleware de simulación de caos (para inyección voluntaria de errores 500 y latencia/timeout)[span_37](start_span)[span_37](end_span)[span_38](start_span)[span_38](end_span).
* **Capa de Módulo de Pago (`snailpay`):**
  * **Rutas:** Definición de endpoints HTTP REST[span_39](start_span)[span_39](end_span).
  * **Controlador:** Orquestación de peticiones/respuestas HTTP[span_40](start_span)[span_40](end_span).
  * **Servicio de Dominio:** Lógica de validación de tarjetas autorizadas, cálculo de autorización, rechazos y generación de objetos de respuesta estructurados de SnailPay[span_41](start_span)[span_41](end_span)[span_42](start_span)[span_42](end_span).

---

## 3. Estructura de Directorios del Monorepo

```text
.devcontainer/
packages/
├── shared/
│   └── src/
│       └── types/
├── client/
│   └── src/
│       ├── assets/
│       ├── config/
│       ├── core/
│       │   ├── components/
│       │   └── layouts/
│       ├── services/
│       │   └── storage/
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── components/
│       │   │   ├── context/
│       │   │   └── hooks/
│       │   ├── dashboard/
│       │   │   ├── components/
│       │   │   └── mocks/
│       │   └── snailpay/
│       │       ├── components/
│       │       ├── hooks/
│       │       └── services/
│       └── routes/
└── server/
    └── src/
        ├── config/
        ├── middlewares/
        └── modules/
            └── snailpay/
```

---

## 4. Reglas de Generación de Código
1. No alterar la estructura `npm workspaces`.
2. Frontend: Aplicar Feature-First Architecture. Separar estrictamente UI, módulos (auth, dashboard, snailpay), capa de servicios de LocalStorage y enrutamiento[span_11](start_span)[span_11](end_span).
3. Backend: API REST stateless. Separar configuración, middlewares (validación, manejo de errores, chaos engineering) y controlador/servicio para SnailPay[span_12](start_span)[span_12](end_span).
4. Flujo de Trabajo: Trunk-Based Development y Conventional Commits[span_13](start_span)[span_13](end_span)[span_14](start_span)[span_14](end_span).
5. Calidad: Aplicar tipado estricto, separación de responsabilidades y manejo de errores consistente[span_15](start_span)[span_15](end_span).