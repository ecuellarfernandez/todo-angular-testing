# Todo Angular Testing

This project is a comprehensive Task Management (Todo) application developed with Angular 19. It includes a complete authentication system, project management, task lists, and individual task handling. The project is specifically designed to demonstrate best practices in end-to-end (E2E) testing with Cypress and unit testing with Jasmine/Karma.

## Key Features

- **Complete Authentication**: User registration and secure login flows.
- **Project Management**: Create, edit, and delete projects.
- **Task Lists**: Organize tasks into lists within specific projects.
- **Task Management**: Full CRUD operations with drag-and-drop support, validations, and status tracking.
- **Comprehensive Testing**: Full suite of E2E tests with Cypress and unit tests ensuring application stability.
- **Clean Architecture**: Strict implementation of Clean Architecture principles with clear separation of Data, Domain, and Presentation layers.

## Tech Stack

- **Framework**: Angular 19
- **Styling**: Tailwind CSS
- **E2E Testing**: Cypress
- **Unit Testing**: Jasmine & Karma
- **Backend Integration**: Designed to consume a Spring Boot REST API
- **API Testing**: Postman Collection included for backend validation

## Prerequisites

### Required Test User

IMPORTANT: For the Cypress E2E tests to run correctly against the real backend, the following user must be registered in the database:

- **Email:** test@test.com
- **Password:** Test1@Test!

This user is utilized by all automated tests. If it does not exist in the database, the authentication and workflow tests will fail.

### Backend Configuration

Ensure that the Spring Boot backend is running locally at:
- **URL:** http://localhost:8080/api
- **Port:** 8080

## Installation and Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure the backend
Start your Spring Boot backend on port 8080 to enable full end-to-end integration.

### 3. Create the test user
Register the test user in your database using the following JSON payload:
```json
{
  "username": "testuser",
  "name": "Test User",
  "email": "test@test.com",
  "password": "Test1@Test!"
}
```

## Testing Strategy

### E2E Testing with Cypress

The project includes a comprehensive E2E test suite covering all user workflows without using mocks. The tests interact directly with the real backend and automatically clean up generated data.

#### Test Structure
```text
cypress/e2e/
├── auth/                    # Authentication workflows
├── projects/                # Project management workflows
├── todolists/               # Task list management
├── tasks/                   # Task CRUD and advanced interactions
└── integration/             # Complete end-to-end user journeys
```

#### Running E2E Tests
```bash
# Run tests headlessly
npm run cy:run

# Open Cypress interactive UI
npm run cy:open
```

### Unit Testing

Unit tests are implemented using Jasmine and Karma to ensure component and service reliability.

```bash
# Run unit tests
npm run test

# Run tests with coverage report
npm run coverage
```

## API and Postman Collection

A complete Postman collection is included to test the Spring Boot API endpoints.

### Location
The collection file is located at: `src/todo-collection-v4.json`

### Key Endpoints Covered
- **Authentication**: Login, Registration, Current User
- **Projects**: Full CRUD operations
- **Task Lists**: Nested CRUD operations by project
- **Tasks**: Creation, updates, status toggling, and reordering

The collection includes automated tests for HTTP status codes, response times, data validation, and automated token injection for authorized requests via collection variables (`col_baseUrl` and `col_authToken`).

## Project Architecture

The frontend application strictly follows Clean Architecture and Domain-Driven Design principles.

### Directory Structure
```text
src/app/
├── auth/                    # Authentication feature module
│   ├── data/                # Repository implementations and API services
│   ├── domain/              # Models, Entities, and Use Cases
│   └── presentation/        # UI Components and state management
├── core/                    # Shared core functionality
│   ├── components/          # Reusable UI components
│   ├── guards/              # Route protection and authorization
│   ├── interceptors/        # HTTP interceptors (e.g., JWT injection)
│   └── services/            # Global singleton services
├── projects/                # Projects feature module
├── tasks/                   # Tasks feature module
└── todolists/               # Task Lists feature module
```

### Implemented Patterns
- **Clean Architecture**: Clear separation of concerns isolating business logic from UI frameworks.
- **Repository Pattern**: Abstraction of HTTP data access.
- **Use Case Pattern**: Encapsulation of specific business operations.
- **Dependency Injection**: Utilizing Angular's DI for testability and loose coupling.
- **Observer Pattern**: Heavy usage of RxJS for reactive programming and state communication.

## Development

Run the development server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

To build the project for production:
```bash
npm run build
```
