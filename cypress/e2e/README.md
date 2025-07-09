## Usuario necesario para el test de login (Cypress)

Para que el test automatizado de **inicio de sesión** funcione correctamente, es necesario que el siguiente usuario ya exista en la base de datos **antes de ejecutar el test**:

| Campo      | Valor                 |
|------------|-----------------------|
| **Email**  | `testuser1@gmail.com` |
| **Password** | `Testuser1!`         |

### Requisitos:
- El usuario debe estar previamente registrado en la base de datos.
- La contraseña debe cumplir con las reglas de seguridad del sistema:
  - Mínimo **8 caracteres**.
  - Al menos **una letra mayúscula**.
  - Al menos **una letra minúscula**.
  - Al menos **un carácter especial**.
- El usuario debe tener acceso habilitado para iniciar sesión.

### Motivo:
Este usuario es utilizado en el test automatizado (`login.cy.ts`) para verificar que el proceso de inicio de sesión funcione correctamente.

> **Importante:** Si eliminas o modificas este usuario en la base de datos, el test de login fallará.
