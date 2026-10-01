ÉPICA 01: Gestión de Identidad y Sesión de Usuario
Objetivo: Permitir el registro, autenticación y control de acceso seguro de los usuarios dentro de la aplicación con almacenamiento local.
Feature 1.1: Registro de Usuarios Local
US-01: Registro de Nuevo Usuario
Clasificación: MVP
Descripción:
Como usuario nuevo,
Quiero registrar mis datos personales y credenciales en un formulario,
Para crear una cuenta en la plataforma e iniciar a interactuar con la solución.
Condiciones Iniciales (Precondiciones):
El usuario no debe contar con una sesión activa.
El usuario se encuentra en la pantalla inicial de registro.
Criterios de Aceptación:
CA-01 (Campos Obligatorios): El formulario debe solicitar obligatoriamente: Nombre Completo, Correo Electrónico, Contraseña y Confirmación de Contraseña.
CA-02 (Validación de Formularios): Se debe validar que el correo tenga un formato válido (usuario@dominio.com) y que la contraseña coincida exactamente con la confirmación.
CA-03 (Archivos Adjuntos): El formulario NO debe solicitar ni permitir la carga de archivos adjuntos.
CA-04 (Saldo Inicial): Todo usuario registrado correctamente debe inicializar su cuenta con un saldo automático de $0.
CA-05 (Persistencia Inicial): Los datos del registro se deben almacenar localmente para permitir inicios de sesión posteriores.
Feature 1.2: Control de Acceso y Sesión
US-02: Inicio de Sesión de Usuario
Clasificación: MVP
Descripción:
Como usuario registrado,
Quiero ingresar mis credenciales de correo y contraseña,
Para acceder a mi panel principal de la aplicación.
Condiciones Iniciales:
Debe existir un usuario previamente registrado.
El usuario está en la vista de Inicio de Sesión.
Criterios de Aceptación:
CA-01 (Autenticación Exitosa): Al ingresar el correo y la contraseña registrados correctamente, la aplicación debe redirigir al usuario al Dashboard.
CA-02 (Credenciales Inválidas): Si el correo o la contraseña no coinciden con los datos almacenados, el sistema debe mostrar un mensaje claro de error sin permitir el acceso.
US-03: Persistencia de Sesión y Protección de Rutas
Clasificación: MVP
Descripción:
Como usuario autenticado,
Quiero que mi sesión se mantenga activa al recargar la página o navegar y que usuarios no autenticados no entren al Dashboard,
Para no perder mi estado dentro de la plataforma ni exponer mis datos.
Condiciones Iniciales:
El usuario intenta navegar en la plataforma o recargar la pestaña del navegador.
Criterios de Aceptación:
CA-01 (Persistencia tras Reload): Si el usuario refresca la página (F5/Reload), la sesión activa, los datos del perfil y el saldo deben conservarse mediante LocalStorage.
CA-02 (Protección de Dashboard): Si un usuario no autenticado intenta acceder a la ruta del Dashboard mediante URL directa, la aplicación debe redirigirlo automáticamente a la vista de Login.
US-04: Cierre de Sesión
Clasificación: MVP
Descripción:
Como usuario con sesión activa,
Quiero disponer de una opción para cerrar mi sesión,
Para proteger mis datos cuando finalice el uso de la aplicación.
Condiciones Iniciales:
El usuario tiene una sesión activa dentro del Dashboard.
Criterios de Aceptación:
CA-01 (Acción de Logout): Al hacer clic en la opción de "Cerrar sesión", el estado de autenticación activo debe destruirse.
CA-02 (Redirección): El usuario debe ser redirigido inmediatamente a la pantalla de Inicio de Sesión.
CA-03 (Acceso Posterior): Intentar regresar al Dashboard con el botón "Atrás" del navegador no debe permitir ver información privada sin autenticarse de nuevo.
