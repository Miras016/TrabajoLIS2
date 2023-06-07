## CONFIGURACIONES Y FUNCIONAMIENTO DEL BACKEND Y DE LOS ENDPOINTS

Te dejo por aqui una exportacion de Postman donde estan los endpoints de la version 2.0.0:
- https://api.postman.com/collections/25725208-27e3deda-aa5e-4dcd-91cc-109d5d1b35c0?access_key=PMAT-01H2BDBMZPKTQHYSX19HFVMQRM
En postman si lo pones en pantalla completa y miras arriba a la izquierda hay una opcion que pone import, ahi haces click y copias la URL y se te descarga lo que yo he hecho en postman 

Los endpoints que estan acutualmente implementados son:

- Endpoint del login: POST / localhost:8080/login. En este endpoint pasaremos el usuario y la contraseña con la siguiente estructura:
- { "user" : "administrador@gmail.com", "passwd" : "labingsoft" } Esto nos devuelve un token que debe almacenarse en localStorage.
- Endpoint del logout: PUT / localhost:8080/logout. Aqui debemos pasar el token de la sesion que queremos cerrar utilizando el metodo de autentificacion Bearer Token.
