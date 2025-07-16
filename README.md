# TodoAngularTesting

Este proyecto es una aplicación de gestión de tareas (Todo) desarrollada con Angular que incluye un sistema completo de autenticación, gestión de proyectos, listas de tareas y tareas individuales. El proyecto está diseñado para demostrar las mejores prácticas de testing con Cypress E2E y pruebas unitarias.

## Características Principales

- **Autenticación completa**: Registro e inicio de sesión de usuarios
- **Gestión de proyectos**: Crear, editar y eliminar proyectos
- **Listas de tareas**: Organizar tareas en listas dentro de proyectos
- **Gestión de tareas**: CRUD completo con drag & drop, validaciones y estados
- **Testing completo**: Pruebas E2E con Cypress y pruebas unitarias
- **Arquitectura limpia**: Implementación de Clean Architecture con separación de capas

## Prerrequisitos

### Usuario de Prueba Requerido

**IMPORTANTE**: Para que las pruebas funcionen correctamente, debes tener registrado el siguiente usuario en la base de datos:

- **Email:** `test@test.com`
- **Password:** `Test1@Test!`

Este usuario es utilizado por todas las pruebas E2E de Cypress. Si no existe en la base de datos, las pruebas fallarán.

### Configuración del Backend

Asegúrate de que el backend esté ejecutándose en:
- **URL:** `http://localhost:8080/api`
- **Puerto:** 8080

## Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar el backend
Asegúrate de que tu backend Spring Boot esté ejecutándose en el puerto 8080.

### 3. Crear usuario de prueba
Registra el usuario de prueba en tu base de datos:
```json
{
  "username": "testuser",
  "name": "Test User",
  "email": "test@test.com",
  "password": "Test1@Test!"
}
```

## Testing

### Pruebas E2E con Cypress

El proyecto incluye una suite completa de pruebas E2E que cubre todos los flujos de usuario:

#### Estructura de Pruebas
```
cypress/e2e/
├── auth/                    # Tests de autenticación
│   ├── login.cy.ts         # Tests de inicio de sesión
│   └── register.cy.ts      # Tests de registro de usuario
├── projects/                # Tests de gestión de proyectos
│   └── project-management.cy.ts
├── todolists/              # Tests de gestión de todolists
│   └── todolist-management.cy.ts
├── tasks/                  # Tests de gestión de tareas
│   ├── task-crud.cy.ts     # CRUD básico de tareas
│   └── task-advanced.cy.ts # Tests avanzados (drag & drop, validaciones)
└── integration/            # Tests de integración
    └── complete-workflow.cy.ts
```

#### Ejecutar pruebas E2E
```bash
# Ejecutar todas las pruebas
npm run e2e

# Ejecutar en modo interactivo
npx cypress open

# Ejecutar pruebas específicas
npx cypress run --spec "cypress/e2e/auth/**"
npx cypress run --spec "cypress/e2e/tasks/**"
```

### Pruebas Unitarias
```bash
# Ejecutar pruebas unitarias
ng test

# Ejecutar con coverage
ng test --code-coverage
```

## Colección de Postman

### Ubicación
La colección de Postman se encuentra en:
```
src/todo-collection-v4.json
```

### Importación
1. Abre Postman
2. Haz clic en "Import"
3. Selecciona el archivo `src/todo-collection-v4.json`
4. La colección se importará con todas las variables y tests configurados

### Endpoints Incluidos

#### Autenticación
- **POST** `/auth/login` - Inicio de sesión
- **POST** `/users/register` - Registro de usuario
- **GET** `/auth/me` - Obtener usuario actual

#### Proyectos
- **GET** `/projects` - Listar proyectos
- **POST** `/projects` - Crear proyecto
- **GET** `/projects/{id}` - Obtener proyecto por ID
- **PUT** `/projects/{id}` - Actualizar proyecto
- **DELETE** `/projects/{id}` - Eliminar proyecto

#### Listas de Tareas
- **GET** `/projects/{projectId}/todolists` - Listar todolists
- **POST** `/projects/{projectId}/todolists` - Crear todolist
- **GET** `/todolists/{id}` - Obtener todolist por ID
- **PUT** `/todolists/{id}` - Actualizar todolist
- **DELETE** `/todolists/{id}` - Eliminar todolist

#### Tareas
- **GET** `/todolists/{todolistId}/tasks` - Listar tareas
- **POST** `/todolists/{todolistId}/tasks` - Crear tarea
- **GET** `/tasks/{id}` - Obtener tarea por ID
- **PUT** `/tasks/{id}` - Actualizar tarea
- **DELETE** `/tasks/{id}` - Eliminar tarea
- **PUT** `/tasks/{id}/status` - Cambiar estado de tarea
- **PUT** `/tasks/reorder` - Reordenar tareas

### Variables de Colección
- `col_baseUrl`: URL base del API (http://localhost:8080/api)
- `col_authToken`: Token de autenticación (se establece automáticamente al hacer login)

### Tests Automatizados
Cada endpoint incluye tests automatizados que verifican:
- Códigos de estado HTTP
- Tiempos de respuesta
- Estructura de respuesta JSON
- Validaciones de datos
- Autenticación y autorización

## Arquitectura del Proyecto

### Estructura de Carpetas
```
src/app/
├── auth/                    # Módulo de autenticación
│   ├── data/               # Implementaciones de repositorios
│   ├── domain/             # Modelos y casos de uso
│   └── presentation/       # Componentes de UI
├── core/                   # Componentes y servicios compartidos
│   ├── components/         # Componentes reutilizables
│   ├── guards/            # Guards de navegación
│   ├── interceptors/      # Interceptores HTTP
│   └── services/          # Servicios compartidos
├── projects/              # Módulo de proyectos
├── tasks/                 # Módulo de tareas
└── todolists/             # Módulo de listas de tareas
```

### Patrones Implementados
- **Clean Architecture**: Separación clara entre capas
- **Repository Pattern**: Abstracción de acceso a datos
- **Use Case Pattern**: Lógica de negocio encapsulada
- **Dependency Injection**: Inyección de dependencias
- **Observer Pattern**: Comunicación entre componentes

## Desarrollo

### Servidor de desarrollo
```bash
ng serve
```
Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques archivos.

### Construcción para producción
```bash
ng build
```

## Notas Importantes

- **Sin Mocks**: Las pruebas E2E interactúan directamente con el backend real
- **Usuario Global**: Todas las pruebas usan el mismo usuario de test para consistencia
- **Limpieza Automática**: Los tests limpian automáticamente los datos creados
- **Responsive Testing**: Incluye pruebas para diferentes tamaños de pantalla
