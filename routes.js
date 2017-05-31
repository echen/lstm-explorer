app.config(["$routeProvider", "$compileProvider", function($routeProvider, $compileProvider) {
    $routeProvider.    
      when("/network", {
        templateUrl: "network.html",
        controller: "LSTMsController"
      }).
      when("/neuron", {
        templateUrl: "neuron.html",
        controller: "NeuronsController"
      }).
      when("/about", {
        templateUrl: "about.html",
      }).
      when("/gallery", {
        templateUrl: "gallery.html",
      }).            
      otherwise({
        redirectTo: "/gallery"
      });
  }]);