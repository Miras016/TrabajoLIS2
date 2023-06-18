'use strict'; // Modo estricto para una escritura más segura

const express = require('express');
const server = express();
const port = 8080;
const jwt = require('jsonwebtoken');
const secret = 'labingsoft'; // Clave secreta para firmar el token JWT
const bodyParser = require('body-parser');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Crear una conexión a la base de datos SQLite
const db = new sqlite3.Database(
  './labingsoft.db', // Ruta al archivo de la base de datos
  sqlite3.OPEN_READWRITE, // Modo de apertura de la base de datos
  (err) => {
    if (err) {
      return console.error(err);
    }
  }
);

// Configurar el middleware para analizar las solicitudes con el cuerpo en formato JSON
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost'); // Reemplaza 'http://localhost' con la URL permitida para acceder a tu servidor
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos en las solicitudes
  
    next();
  });

// Función para verificar y descifrar el token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    const jwtToken = token.slice(7);

    // Verificar si el token está en la tabla de sesiones activas
    db.get(
      'SELECT * FROM sessions WHERE token = ?',
      jwtToken,
      (err, row) => {
        if (err) {
          console.log('Error al verificar el token', err);
          res.json({ errormsg: 'Error al verificar el token' });
        } else if (row === undefined) {
          res.json({ errormsg: 'Token no válido o sesión expirada' });
        } else {
          jwt.verify(jwtToken, secret, (err, decoded) => {
            if (err) {
              res.json({ errormsg: 'Token inválido' });
            } else {
              req.userID = decoded.userID; // Almacenar el ID de usuario en la solicitud
              req.userRole = decoded.rol; // Almacenar el rol de usuario en la solicitud
              next();
            }
          });
        }
      }
    );
  } else {
    res.json({ errormsg: 'Token de autorización no válido' });
  }
}

// Función para eliminar los tokens expirados de la tabla de sesiones
function removeExpiredTokens(db) {
  const currentDate = new Date().toISOString(); // Obtener la fecha actual en formato ISO

  db.run(
    'DELETE FROM sessions WHERE expirationDate < ?',
    currentDate,
    (err) => {
      if (err) {
        console.log('Error al eliminar tokens expirados', err);
      }
    }
  );
}
  // Llamar a la función removeExpiredTokens cada 8 horas (86400000/3 milisegundos)
  setInterval(() => {
    removeExpiredTokens(db);
  }, (86400000/3));
  

// Función para procesar el inicio de sesión
function processLogin(req, res, db) {
    const login = req.body.user;
    const passwd = req.body.passwd;
  
    db.get(
      'SELECT * FROM users WHERE correo=?',
      login,
      (err, row) => {
        if (row === undefined) {
          res.json({ errormsg: 'El usuario no existe' });
        } else if (row.password === passwd) {
          // Generar el payload del JWT, solo contiene el userID y el rol por temas de privacidad
          const payload = {
            userID: row.uid,
            rol: row.rol,
          };
          const token = jwt.sign(payload, secret, { expiresIn: '8h' }); //Creamos el token del usuario
          const expirationDate = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 horas de duración del token
  
          // Almacenar el token y la fecha de expiración en la tabla de sesiones
          db.run(
            'INSERT INTO sessions (token, expirationDate) VALUES (?, ?)',
            token,
            expirationDate.toISOString(), // Convertir la fecha a formato ISO para almacenarla en SQLite
            (err) => {
              if (err) {
                console.log('Error insertando token');
              }
            }
          );
  
          const data = {
            token: token,
          };
  
          res.json(data);
        } else {
          res.json({ errormsg: 'Contraseña incorrecta' });
        }
      }
    );
  }
  

// Función para procesar el cierre de sesión
function processLogout(req, res, db) {
  const token = req.headers.authorization;
  
  if (token && token.startsWith('Bearer ')) {
    // Obtener el JWT eliminando el prefijo "Bearer "
    const jwtToken = token.slice(7);
    //Buscamos el token y si existe lo eliminamos
    db.get(
      'SELECT * FROM sessions WHERE token = ?',
      jwtToken,
      (err, row) => {
        if (row === undefined) {
          res.json({ errormsg: 'No hay sesión disponible para ese token' });
        } else if (row.token === jwtToken) {
          db.run('DELETE FROM sessions WHERE token = ?', jwtToken, (err) => {
            if (err) {
              res.json({ errormsg: 'Error al cerrar la sesión' });
            } else {
              res.json({ message: 'Sesión cerrada correctamente' });
            }
          });
        }
      }
    );
  } else {
    res.json({ errormsg: 'Token de autorización no válido' });
  }
}

function insertCategoria(nombre, usuarioId, db) { // Función que permite insertar categorias en funcion del nombre de la categoria y del usuario que la quiera insertar
                                                
    db.run(
      'INSERT INTO categorias (nombre, usuario_id) VALUES (?, ?)',
      [nombre, usuarioId],
      function (err) {
        if (err) {
          console.log('Error al insertar la categoría', err);
        }
      }
    );
  }
  

  function insertVideo(req, res, db) {
    const { titulo, descripcion, url, categoria } = req.body;
    const userId = req.userID;
  
    // Verificar si la categoría ya existe para el usuario
    //La categoria con nombre "nom_cat" solo existe una vez por usuario es decir no hay repeticion de nombres de categorias por usuario
    db.get(
      'SELECT id FROM categorias WHERE nombre = ? AND usuario_id = ?',
      [categoria, userId],
      (err, row) => {
        if (err) {
          console.log('Error al buscar la categoría', err);
          res.json({ errormsg: 'Error al insertar el video' });
        } else {
          if (row === undefined) {
            // La categoría no existe, insertarla
            insertCategoria(categoria, userId, db);
          }
  
          // Obtener el ID de la categoría
          db.get(
            'SELECT id FROM categorias WHERE nombre = ? AND usuario_id = ?',
            [categoria, userId],
            (err, row) => {
              if (err) {
                console.log('Error al obtener el ID de la categoría', err);
                res.json({ errormsg: 'Error al insertar el video' });
              } else {
                const categoriaId = row.id;
  
                // Insertar el video con el ID de la categoría correspondiente
                db.run(
                  'INSERT INTO videos (titulo, descripcion, url, categoria, categoriaId, userId) VALUES (?, ?, ?, ?, ?, ?)',
                  [titulo, descripcion, url, categoria, categoriaId, userId],
                  function (err) {
                    if (err) {
                      console.log('Error al insertar el video', err);
                      res.json({ errormsg: 'Error al insertar el video' });
                    } else {
                      res.json({ message: 'Video insertado correctamente' });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
  function eliminarVideo(videoId, userId, db, res) { //Funcion que permite eliminar el video apartir del ID del video
    // Obtener la categoría del video a eliminar
    db.get(
      'SELECT categoriaId FROM videos WHERE id = ? AND userId = ?',
      [videoId, userId],
      (err, row) => {
        if (err) {
          console.log('Error al obtener la categoría del video', err);
          res.json({errormsg :'Error al obtener la categoria del video que se busca eliminar'});
        } else {
          const categoriaId = row.categoriaId;
  
          // Eliminar el video
          db.run('DELETE FROM videos WHERE id = ?', videoId, (err) => {
            if (err) {
              console.log('Error al eliminar el video', err);
              res.json({errormessage : 'No se ha podido eliminar el video correctamente'});
            } else {
              console.log('Video eliminado correctamente');
  
              // Verificar si no quedan más videos en la categoría
              db.get(
                'SELECT COUNT(*) AS count FROM videos WHERE categoriaId = ?',
                categoriaId,
                (err, row) => {
                  if (err) {
                    console.log('Error al verificar la cantidad de videos en la categoría', err);
                    res.json({errormsg:'Error al buscar el numero de videos que pertenecen a la categoria del video eliminado.'});
                  } else {
                    const count = row.count;
  
                    if (count === 0) {
                      // No quedan más videos en la categoría, eliminar la categoría
                      db.run('DELETE FROM categorias WHERE id = ?', categoriaId, (err) => {
                        if (err) {
                          console.log('Error al eliminar la categoría', err);
                          res.json({errormsg : 'La categoria no se ha eliminado'});
                        } else {
                          console.log('Categoría eliminada correctamente');
                          res.json({message : 'Se ha logrado eliminar el video correctamente asi como la categoria.'});
                        }
                      });
                    }
                  }
                }
              );
            }
          });
        }
      }
    );
  }
  // Función para listar las categorías pertenecientes al usuario que las pide
function listarCategorias(req, res) {
    const userId = req.userID;
  
    db.all(
      'SELECT * FROM categorias WHERE usuario_id = ?',
      userId,
      (err, rows) => {
        if (err) {
          console.log('Error al obtener las categorías', err);
          res.json({ errormsg: 'Error al obtener las categorías' });
        } else {
          res.json(rows);
        }
      }
    );
  }
  
  // Función para obtener videos por categoría o todos los videos del usario solicitante
  function listarVideos(req, res) {
    const userId = req.userID;
    const categoria = req.query.categoria;
  
    if (categoria) {
      // Obtener videos por categoría
      db.all(
        'SELECT * FROM videos WHERE categoria = ? AND userId = ?',
        [categoria, userId],
        (err, rows) => {
          if (err) {
            console.log('Error al obtener los videos', err);
            res.json({ errormsg: 'Error al obtener los videos' });
          } else {
            res.json(rows);
          }
        }
      );
    } else {
      // Obtener todos los videos
      db.all(
        'SELECT * FROM videos WHERE userId = ?',
        userId,
        (err, rows) => {
          if (err) {
            console.log('Error al obtener los videos', err);
            res.json({ errormsg: 'Error al obtener los videos' });
          } else {
            res.json(rows);
          }
        }
      );
    }
  }
  

//DEFINICION DE LAS RUTAS PARA CADA SERVICIO


// Ruta para el inicio de sesión
router.post('/login', (req, res) => {
  if (!req.body.user || !req.body.passwd) {
    res.json({ errormsg: 'Petición mal formada' });
  } else {
    processLogin(req, res, db);
  }
});

// Ruta para el cierre de sesión
router.put('/logout', (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    res.json({ errormsg: 'Petición mal formada' });
  } else {
    processLogout(req, res, db);
  }
});
// Ruta para insertar los videos
router.post('/insertarvideos', verifyToken, (req, res) => {
    if (!req.body.titulo || !req.body.descripcion) {
      res.json({ errormsg: 'Petición mal formada' });
    } else {
      if (req.userRole === 'ADMIN_ROLE') {
        insertVideo(req, res, db);
      } else {
        res.json({ errormsg: 'Acceso denegado. Solo los administradores pueden insertar videos.' });
      }
    }
  });
// Ruta para eliminar videos por ID
  router.delete('/videos/:videoId', verifyToken, (req, res) => {
    const videoId = req.params.videoId;
    const userId = req.userID;
    const userRole = req.userRole;
  
    if (userRole === 'ADMIN_ROLE') {
      eliminarVideo(videoId, userId, db,res);
    } else {
      res.json({ errormsg: 'Acceso denegado. Solo los administradores pueden eliminar videos.' });
    }
  });
  // Ruta para obtener todas las categorías
router.get('/categorias', verifyToken, (req,res)=> {
    listarCategorias(req,res);
});

// Ruta para obtener videos por categoría o todos los videos
router.get('/videos', verifyToken, (req,res)=>{
    listarVideos(req,res);
});


// Agregar las rutas al servidor
server.use('/', router);

// Iniciar el servidor
server.listen(port, () => {
    removeExpiredTokens(db); // Eliminar los tokens expirados existentes al iniciar el servidor
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
  
