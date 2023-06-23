## CONFIGURACIONES Y FUNCIONAMIENTO DEL BACKEND Y DE LOS ENDPOINTS
Los endpoints que estan acutualmente implementados son:

- Endpoint del login: POST / localhost:8080/login. En este endpoint pasaremos el usuario y la contraseña con la siguiente estructura:
- { "user" : "administrador@gmail.com", "passwd" : "labingsoft" } Esto nos devuelve un token que debe almacenarse en localStorage.
- Endpoint del logout: PUT / localhost:8080/logout. Aqui debemos pasar el token de la sesion que queremos cerrar utilizando el metodo de autentificacion Bearer Token.
