app.config(["$routeProvider", "$compileProvider", function($routeProvider, $compileProvider) {
    $routeProvider.    
      when("/", {
        templateUrl: "network.html",
        controller: "LSTMsController"
      }).
      when("/neuron", {
        templateUrl: "neuron.html",
        controller: "NeuronsController"
      }).      
      otherwise({
        redirectTo: "/"
      });
  }]);