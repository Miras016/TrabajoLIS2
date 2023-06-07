## CONFIGURACIONES Y FUNCIONAMIENTO DEL BACKEND Y DE LOS ENDPOINTS

Te dejo aqui un link a mi postman para que veas las peticiones que he hecho y como las he hecho y tal por si las quieres usar: 
- https://api.postman.com/collections/25725208-27e3deda-aa5e-4dcd-91cc-109d5d1b35c0?access_key=PMAT-01H2BDBMZPKTQHYSX19HFVMQRM

Los endpoints que estan acutualmente implementados son:

- Endpoint del login: POST / localhost:8080/login. En este endpoint pasaremos el usuario y la contraseña con la siguiente estructura:
- { "user" : "administrador@gmail.com", "passwd" : "labingsoft" } Esto nos devuelve un token que debe almacenarse en localStorage.
- Endpoint del logout: PUT / localhost:8080/logout. Aqui debemos pasar el token de la sesion que queremos cerrar utilizando el metodo de autentificacion Bearer Token.
