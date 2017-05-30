var app = angular.module("app", ["ngRoute"]);

app.run(function($rootScope, $window, $location) {
  //scroll to top of page after each route change  
  $rootScope.$on("$locationChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
    window.scrollTo(0, 0);    
  });  
});

app.controller("LSTMsController", ["$scope", "$routeParams", "LSTMService", function($scope, $routeParams, LSTMService) {
  $scope.file = ($routeParams.file === undefined ? 0 : $routeParams.file);
  $scope.layer = parseInt($routeParams.layer === undefined ? "1" : $routeParams.layer);
  $scope.layerIndex = $scope.layer - 1;
  $scope.vector = ($routeParams.vector === undefined ? "cs" : $routeParams.vector);  
    
  $scope.range = [];
  
  $scope.vectorMap = {
    "cs": "Cell State",
    "hs": "Hidden State",
    "f_gate": "Forget Gate",
    "i_gate": "Input Gate",
    "j_gate": "Candidate Memory",
    "o_gate": "Output Gate"    
  };

  var colorizer = d3.interpolateGnBu;
  if ($scope.vector.startsWith("cs") || $scope.vector.startsWith("hs") || $scope.vector.startsWith("j_gate")) {
    colorizer = d3.interpolateRdBu;
  }

  d3.json("data/" + $scope.file + ".json", function(data) {    
    $scope.name = (data["name"] === undefined ? $scope.file : data["name"]);
    $scope.$apply();    

    var vectors = _.map(data[$scope.vector + $scope.layerIndex], function(x) { return LSTMService.normalizer($scope.vector, x); });
    var neuronCs = _.map(data["cs" + $scope.layerIndex], function(x) { return LSTMService.normalizer("cs", x); });
    var neuronHs = _.map(data["hs" + $scope.layerIndex], function(x) { return LSTMService.normalizer("hs", x); });
    var neuronFs = _.map(data["f_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("f_gate", x); });
    var neuronIs = _.map(data["i_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("i_gate", x); });
    var neuronJs = _.map(data["j_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("j_gate", x); });
    var neuronOs = _.map(data["o_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("o_gate", x); });

    var numVectors = vectors.length;

    var nonEmpty = _.filter(
      _.keys(data), 
      function(k) { return data[k].length > 0; }
    );
    var numLayers = (nonEmpty.length - 1) / 6;
    for (var i = 1; i <= numLayers; i++) {
      $scope.range.push(i);
    }
    $scope.$apply();

    LSTMService.vectors = vectors;
    for (var k = 0; k < Math.min(numVectors, 30); k++) {
      LSTMService.buildSequence("Neuron " + (k + 1), data["chars"], vectors[k], colorizer, $scope.file, $scope.layer, k);
    }
  });    
  
  var main = d3.select("#main");
  
  d3.select("#revealCharsButton")
    .on("click", function() {
      var self = d3.select(this)
    
      var text = "";
      var f = null;
      if (self.classed("active")) {
        text = "Hide Characters"
        f = LSTMService.convertWhitespaceToHTML;
      } else {
        text = "Show Characters";
        f = LSTMService.convertWhitespaceToHTML2;
      }
      
      self.text(text);
      main
        .selectAll(".sequence span.character")
        .html(function(x) { return f(x[0]); });
    });
}]);


app.controller("NeuronsController", ["$scope", "$routeParams", "LSTMService", function($scope, $routeParams, LSTMService) {
  $scope.file = ($routeParams.file === undefined ? 0 : $routeParams.file);
  $scope.layer = parseInt($routeParams.layer === undefined ? 0 : $routeParams.layer);
  $scope.layerIndex = $scope.layer - 1;
  $scope.neuronIndex = parseInt($routeParams.n === undefined ? 0 : $routeParams.n) - 1;
  $scope.lstmName = $scope.file;
    
  var colorizer01 = d3.interpolateGnBu;
  var colorizer11 = d3.interpolateRdBu;

  d3.json("data/" + $scope.file + ".json", function(data) {
    data["chars"] = data["chars"];
    $scope.lstmName = (data["name"] === undefined ? $scope.file : data["name"]);    
    $scope.$apply();
    
    var neuronCs = _.map(data["cs" + $scope.layerIndex], function(x) { return LSTMService.normalizer("cs", x); });
    var neuronHs = _.map(data["hs" + $scope.layerIndex], function(x) { return LSTMService.normalizer("hs", x); });
    var neuronFs = _.map(data["f_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("f_gate", x); });
    var neuronIs = _.map(data["i_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("i_gate", x); });
    var neuronJs = _.map(data["j_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("j_gate", x); });
    var neuronOs = _.map(data["o_gate" + $scope.layerIndex], function(x) { return LSTMService.normalizer("o_gate", x); });
    
    LSTMService.buildSequence("Cell State", data["chars"], neuronCs[$scope.neuronIndex], colorizer11, null, null, null, false);
    LSTMService.buildSequence("Hidden State", data["chars"], neuronHs[$scope.neuronIndex], colorizer11, null, null, null, false);
    LSTMService.buildSequence("Forget Gate", data["chars"], neuronFs[$scope.neuronIndex], colorizer01, null, null, null, false);
    LSTMService.buildSequence("Input Gate", data["chars"], neuronIs[$scope.neuronIndex], colorizer01, null, null, null, false);
    LSTMService.buildSequence("Candidate Memory", data["chars"], neuronJs[$scope.neuronIndex], colorizer11, null, null, null, false);
    LSTMService.buildSequence("Output Gate", data["chars"], neuronOs[$scope.neuronIndex], colorizer01, null, null, null, false);
  });    
  
  d3.select("#revealCharsButton")
    .on("click", function() {
      var self = d3.select(this)
    
      var text = "";
      var f = null;
      if (self.classed("active")) {
        text = "Hide Characters"
        f = LSTMService.convertWhitespaceToHTML;
      } else {
        text = "Show Characters";
        f = LSTMService.convertWhitespaceToHTML2;
      }
      
      self.text(text);      
      d3.select("#main")
        .selectAll(".sequence span.character")
        .html(function(x) { return f(x[0]); });
    });       
}]);
