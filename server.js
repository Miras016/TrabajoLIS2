'use strict';

const express = require('express');
const server = express();
const port = 8080;
const jwt = require('jsonwebtoken');
const secret = 'labingsoft';
const bodyParser = require('body-parser');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
  'labingsoft.db',
  (err) => {
    if (err) {
      console.log('Error en la base de datos');
    }
  }
);

// Middleware para analizar el cuerpo de las solicitudes
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

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
        // Generar el token JWT
        const payload = {
          userID: row.uid,
          rol: row.rol,
          nombre: row.nombre,
          correo: row.correo
        };
        const token = jwt.sign(payload, secret, { expiresIn: '8h' });

        // Almacenar el token en la tabla de sesiones
        db.run(
          'INSERT INTO sessions (token) VALUES (?)',
          token,
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

// Agregar las rutas al servidor
server.use('/', router);

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
