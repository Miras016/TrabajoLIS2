## CONFIGURACIONES Y FUNCIONAMIENTO DEL BACKEND Y DE LOS ENDPOINTS


Para todos los servicios excepto para el login, sera necesario introducirr como metodo de autenticacion el token devuelto tras el inicio de sesion en modo BearerToken.

Te dejo por aqui una exportacion de Postman donde estan los endpoints de la version 2.0.0:
- https://api.postman.com/collections/25725208-27e3deda-aa5e-4dcd-91cc-109d5d1b35c0?access_key=PMAT-01H2BDBMZPKTQHYSX19HFVMQRM
En postman si lo pones en pantalla completa y miras arriba a la izquierda hay una opcion que pone import, ahi haces click y copias la URL y se te descarga lo que yo he hecho en postman 


Los endpoints que estan acutualmente implementados son:

- Endpoint del login: POST / localhost:8080/login. En este endpoint pasaremos el usuario y la contraseña con la siguiente estructura:
- { "user" : "administrador@gmail.com", "passwd" : "labingsoft" } Esto nos devuelve un token que debe almacenarse en localStorage o sessionStorage.
- Endpoint del logout: PUT / localhost:8080/logout. 
- Endpoint para insertar videos :  POST / localhost:8080/insertarvideos.
- Endpoint para eliminar videos : DELETE /localhost:8080/videos.
- Endpoint para listar categorias: GET /localhost:8080/categorias.
- Endpoint para listar videos: GET /localhost:8080/videos.
- Endpoint para buscar videos en funcion de la categoria GET /localhost:8080/videos?categoria=(Aqui va el nombre de la categoria).
