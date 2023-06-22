angular.module('myApp', [])
  .controller('myController', function($scope, $http) {

    if (performance.navigation.type === 1) {
      sessionStorage.removeItem('CategoriaSeleccionada');
    }

    $scope.displayBloque = "none";
    var token = sessionStorage.getItem('token');

    $scope.selectChange = function() {
      var opcionSeleccionada = $scope.selectedCategoria;
      sessionStorage.setItem('CategoriaSeleccionada', opcionSeleccionada);
      if (opcionSeleccionada) {
        MostrarVideosCategorias(opcionSeleccionada);
      }
    };

    function MostrarVideosCategorias(categoria) {
      $scope.main = [];
      var url = "http://localhost:8080/videos?categoria=" + categoria;

      var myHeaders = {
        "Authorization": "Bearer " + token
      };

      var config = {
        headers: myHeaders
      };

      $http.get(url, config)
        .then(function(response) {
          $scope.movies = response.data;
        })
        .catch(function(error) {
          console.log('error', error);
        });
    };

    $scope.openForm = function(event, formName) {
      if (formName === 'form1') {
        $scope.fetchUsers();
      }
      document.getElementById('form1').style.display = 'none';
      document.getElementById('form2').style.display = 'none';
      document.getElementById('form3').style.display = 'none';
      document.getElementById(formName).style.display = 'block';
    };

    $scope.BuscarPeliculas = function() {
      $scope.main = [];
      var pelibuscada = $scope.busqueda.toLowerCase();

      var myHeaders = {
        "Authorization": "Bearer " + token
      };
      var config = {
        headers: myHeaders
      };

      $http.get("http://localhost:8080/videos", config)
        .then(function(response) {
          var result = response.data;
          var validMovies = []; // Arreglo para almacenar las películas válidas

          result.forEach(function(video) {
            var titulo = video.titulo;
            var categoria = video.categoria;
            var nombre = titulo.toLowerCase();
            var CategoriaSeleccionada = sessionStorage.getItem('CategoriaSeleccionada');
            if ((nombre.includes(pelibuscada) && categoria == CategoriaSeleccionada) || (nombre.includes(pelibuscada) && sessionStorage.getItem('CategoriaSeleccionada') === null)) {
              validMovies.push(video); // Agregar la película válida al arreglo
            }
          });

    $scope.movies = validMovies;
        })
        .catch(function(error) {
          console.log('error', error);
        });
    };

    $scope.cerrarBloque = function() {
      $scope.displayBloque = "none";
      location.reload();
    };

    $scope.abrirBloque = function() {
      $scope.displayBloque = "block";
    };

    $scope.createMovie = function() {
      var url = "http://localhost:8080/insertarvideos/1";
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      var newMovie = {
        titulo: $scope.newMovie.titulo,
        descripcion: $scope.newMovie.descripcion,
        url: $scope.newMovie.url,
        categoria: $scope.newMovie.categoria.nombre
      };

      $http.post(url, newMovie, config)
      .then(function(response) {
        $scope.movies.push(response.data);
        $scope.newMovie = {};
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };


    $scope.fetchMovies = function() {
      var url = "http://localhost:8080/videos";

      var myHeaders = {
        "Authorization": "Bearer " + token
      };

      var config = {
        headers: myHeaders
      };

      $http.get(url, config)
        .then(function(response) {
          $scope.movies = response.data;
        })
        .catch(function(error) {
          console.log('error', error);
        });
    };

    $scope.fetchCategorias = function() {
      var url = "http://localhost:8080/categorias";
      var config = {
        headers: {
          "Authorization": "Bearer " + token
        }
      };
      $http.get(url, config)
        .then(function(response) {
          $scope.categorias = response.data;
        })
        .catch(function(error) {
          console.log('error', error);
        });
    };

    $scope.fetchUsers = function() {
      var url = "http://localhost:8080/users";
      var config = {
        headers: {
          "Authorization": "Bearer " + token
        }
      };

      $http.get(url, config)
      .then(function(response) {
        $scope.users = response.data;
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };

    $scope.reiniciarPagina = function() {
      location.reload();
    };

    $scope.updateMovie = function(movie) {
      var url = "http://localhost:8080/videos/1/" + movie.id;
      var config = {
        headers: {
          "Authorization": "Bearer " + token
        }
      };
      $http.put(url, movie, config)
        .then(function(response) {
          console.log('Movie updated successfully');
        })
        .catch(function(error) {
          console.log('error', error);
        });
    };

    $scope.deleteMovie = function(movie) {
      var url = "http://localhost:8080/videos/1/" + movie.id;
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer " + token
        }
      };
      $http.delete(url, config)
        .then(function(response) {
          var index = $scope.movies.indexOf(movie);
          if (index > -1) {
            $scope.movies.splice(index, 1);
          }
          console.log('Movie deleted successfully');
        })
        .catch(function(error) {
          console.log('error', error);
        });
    };



    $scope.createCategoria = function() {
      var url = "http://localhost:8080/categorias/1";
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      var newCategoria = {
        nombre: $scope.newCategoria.nombre
      };


      $http.post(url, newCategoria, config)
      .then(function(response) {
        $scope.categorias.push(response.data);
        $scope.newCategoria = {};
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };

    $scope.updateCategoria = function(categoria) {
      var url = "http://localhost:8080/categorias/" + categoria.id;
      var config = {
        headers: {
          "Authorization": "Bearer " + token
        }
      };
      $http.put(url, categoria, config)
      .then(function(response) {
        console.log('Categoría actualizada exitosamente');
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };

    $scope.deleteCategoria = function(categoria) {
      var url = "http://localhost:8080/categoria/1/" + categoria.id;
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer " + token
        }
      };
      $http.delete(url, config)
      .then(function(response) {
        var index = $scope.categorias.indexOf(categoria);
        if (index > -1) {
          $scope.categorias.splice(index, 1);
        }
        console.log('Categoría eliminada exitosamente');
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };

    $scope.createUser = function() {
      var url = "http://localhost:8080/users";
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      var newUser = {
        nombre: $scope.newUser.nombre,
        correo: $scope.newUser.correo,
        password: $scope.newUser.password,
        rol: "USER_ROL"
      };

      $http.post(url, newUser, config)
      .then(function(response) {
        $scope.users.push(response.data);
        $scope.newUser = {};
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };

    $scope.updateUser = function(user) {
      var url = "http://localhost:8080/users/" + user.uid;
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      $http.put(url, user, config)
      .then(function(response) {
        console.log('Usuario actualizado exitosamente');
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };

    $scope.deleteUser = function(user) {
      var url = "http://localhost:8080/users/" + user.uid;
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      };

      $http.delete(url, config)
      .then(function(response) {
        var index = $scope.users.indexOf(user);
        if (index > -1) {
          $scope.users.splice(index, 1);
        }
        console.log('Usuario eliminado exitosamente');
      })
      .catch(function(error) {
        console.log('error', error);
      });
    };
});
