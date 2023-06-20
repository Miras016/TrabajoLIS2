angular.module('myApp', []).controller('myController', function($scope., $http) {
        $scope.displayBloque = "none";
        var token = sessionStorage.getItem('token');

        $scope.openForm = function(event, formName) {
          // Lógica para abrir el formulario específico
        };

        $scope.cerrarBloque = function() {
          $scope.displayBloque = "none";
          location.reload();
        };

        $scope.abrirBloque = function() {
          $scope.displayBloque = "block";
        };

        $scope.BuscarPeliculas = function() {
          // Lógica para buscar películas
        };

        $scope.fetchCategorias = function() {
          var url = "http://localhost:8080/categorias";
          var token = token;

          var config = {
            headers: {
              "Authorization": "Bearer " + token
            }
          };

          $http.get(url, config)
          .then(function(response) {
            $scope.categorias = response.data;
           });
          })
          .catch(function(error) {
            console.log('error', error);
          });
        };

      });

      // const select = document.getElementById('sele')
      // function BarraCategorias() {
      //       fetch("https://localhost:8080/categorias", requestOptions)
      //         .then(response => response.json())
      //         .then(result => { result.categorias.forEach(cat => {
      //                         const {id, nombre} = cat;
      //                         var opt = document.createElement("option");
      //                         opt.value = id;
      //                         opt.textContent = nombre;
      //                         select.appendChild(opt);
      //                       }) }
      //                     )
      //         .catch(error => console.log('error', error));
      //     }
      //
      //     select.addEventListener("change", function() {
      //       const opcionSeleccionada = select.options[select.selectedIndex];
      //       const valor = opcionSeleccionada.getAttribute("value");
      //       sessionStorage.setItem('CategoriaSeleccionada', valor);
      //       if (valor) {
      //         MostrarVideosCategorias(valor);
      //       }
      //     });
