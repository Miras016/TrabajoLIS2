"use strict";

var app = angular.module('myApp', []);
app.controller('myController', function($scope, $http) {
  $scope.usuarioIncorrecto = false;

  $scope.enviar = function() {
    var data = {
      user: $scope.correo,
      passwd: $scope.contrasena
    };

    var config = {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };

    $http.post('http://localhost:8080/login', data, config)
      .then(function(response) {
        console.log(response.data);
        if(response.data.errormsg != null){
          $scope.usuarioIncorrecto = true;
        }else {
          sessionStorage.setItem('token', response.data.token)
          window.location.href = 'PagPrincipal/PagPrincipal.html';
        }


      })
      .catch(function(error) {
        console.log('error', error);
      });
  };
});
