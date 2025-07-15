# Cypress E2E Test Suite

### Estructura de Carpetas

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
├── integration/            # Tests de integración
    └── complete-workflow.cy.ts
```

## Características de la Suite

### Sin Mocks: Pruebas 100% contra la API real
- Todas las pruebas E2E interactúan directamente con el backend real.
- No se utiliza ningún sistema de mocks ni interceptores para simular respuestas.
- El estado se prepara y limpia usando la propia API real antes y después de cada test.

### Usuario de Test Global
- Todas las pruebas utilizan el usuario global:
  - **Email:** `test@test.com`
  - **Password:** `password123`
- Estas credenciales están definidas como variables globales reutilizables en `cypress/support/commands.ts`:
  ```js
  export const TEST_USER_EMAIL = 'test@test.com';
  export const TEST_USER_PASSWORD = 'password123';
  ```
- Si necesitas cambiar el usuario de test, modifica estas variables y los tests lo usarán automáticamente.

### Comandos Cypress Personalizados
- `cy.createProject(name)` - Crear proyecto
- `cy.createTodoList(name)` - Crear todolist
- `cy.createTask(title)` - Crear tarea
- `cy.toggleTaskCompletion(title)` - Completar/descompletar tarea
- `cy.editTask(oldTitle, newTitle)` - Editar tarea
- `cy.deleteTask(title)` - Eliminar tarea

### Atributos data-cy Implementados
Todos los elementos interactivos tienen atributos `data-cy` para tests robustos:
- `[data-cy=add-project]`
- `[data-cy=project-title]`
- `[data-cy=submit-project]`
- `[data-cy=task-item]`

## Categorías de Tests

### Authentication (`auth/`)
- Validaciones de formularios
- Login/logout
- Registro de usuarios
- Manejo de errores

### Projects (`projects/`)
- CRUD completo de proyectos
- Validaciones de formularios
- Navegación entre vistas

### TodoLists (`todolists/`)
- Gestión de listas de tareas
- Validaciones y constraints
- Flujos de navegación

### Tasks (`tasks/`)
- **CRUD básico**: Crear, leer, actualizar, eliminar
- **Avanzado**: Drag & drop, validaciones complejas, performance

### Integration (`integration/`)
- Flujos completos usuario
- Tests end-to-end
- Pruebas de regresión

## Cómo Ejecutar

### Ejecutar todos los tests
```bash
npm run test
# o
npx cypress run
```

### Ejecutar tests por categoría
```bash
# Solo tests de autenticación
npx cypress run --spec "cypress/e2e/auth/**"

# Solo tests de tareas
npx cypress run --spec "cypress/e2e/tasks/**"

# Test específico
npx cypress run --spec "cypress/e2e/integration/complete-workflow.cy.ts"
```

### Modo interactivo
```bash
npx cypress open
```