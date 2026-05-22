# Módulo 4 — Frontend Estadísticas

Dashboard web para visualizar estadísticas de URLs acortadas, desplegado en AWS con CI/CD automatizado.

## 🌐 URL de Producción
**https://d2rwgavab58bzb.cloudfront.net**

## 🛠️ Stack Tecnológico

- **React 19** + TypeScript + Vite
- **Tailwind CSS v4**
- **Recharts** — gráficas de visitas
- **Axios** — consumo de APIs
- **AWS S3** — almacenamiento del frontend
- **AWS CloudFront** — CDN y distribución global
- **Terraform** — infraestructura como código
- **GitHub Actions** — CI/CD automatizado

## 📁 Estructura del Proyecto

```
frontend-estadisticas/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Pipeline CI/CD
├── front/                    # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatCard.tsx      # Tarjetas de métricas
│   │   │   ├── UrlTable.tsx      # Tabla de URLs
│   │   │   └── DetailModal.tsx   # Modal de detalle
│   │   ├── services/
│   │   │   └── statsService.ts   # Llamadas a la API
│   │   ├── types/
│   │   │   └── stats.ts          # Tipos TypeScript
│   │   └── App.tsx
│   └── .env.example
└── terraform/
    ├── backend/
    │   └── main.tf           # Backend remoto S3
    ├── main.tf               # S3 + CloudFront
    ├── variables.tf
    ├── outputs.tf
    └── providers.tf
```

## 🔌 APIs Consumidas

| Endpoint | Descripción |
|----------|-------------|
| `GET /stats` | Lista todas las URLs con sus estadísticas |
| `GET /stats/{codigo}` | Detalle de una URL específica con historial de visitas |

## ☁️ Infraestructura AWS

### Backend de Terraform
- **Bucket:** `sd-frontend-estadisticas-tfstate`
- Versionado y encriptado con AES256
- Acceso público bloqueado

### Frontend
- **Bucket S3:** `sd-frontend-estadisticas-web` — almacena los archivos del build
- **CloudFront:** distribución con OAC, HTTPS forzado, caché optimizado
- Redirección de errores 403/404 a `index.html` para SPA

## 🚀 CI/CD

Cada push a `main` ejecuta automáticamente:

1. Instala dependencias con `pnpm`
2. Build de producción con variables de entorno
3. Sube archivos a S3 con `aws s3 sync`
4. Invalida caché de CloudFront

### Secrets requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Credencial AWS para el deploy |
| `AWS_SECRET_ACCESS_KEY` | Credencial AWS para el deploy |
| `VITE_API_BASE` | URL base de la API de estadísticas |
| `VITE_BASE_URL` | URL base del acortador de URLs |

## 🖥️ Desarrollo Local

```bash
cd front
pnpm install
pnpm dev
```


