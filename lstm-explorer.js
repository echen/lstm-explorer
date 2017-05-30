app.factory("LSTMService", function($rootScope) {
  var factory = {};
  var vectors = [];

  function normalize(x, min, max) {
    return (x - min) / (max - min);
  }

  function normalizer(gate_type, xs) {
    if (gate_type.startsWith("hs") || gate_type.startsWith("j_gate")) {
      var min = -1;
      var max = 1;
      return _.map(xs, function(x) { return normalize(x, min, max); });
    } else if (gate_type.startsWith("cs")) {
      var min = _.min(xs);
      var max = _.max(xs);
      var m = Math.max(Math.abs(min), Math.abs(max));

      return _.map(xs, function(x) { return normalize(x, -1 * m, m); });
    } else {
      return xs;
    }  
  }

  factory.convertWhitespaceToHTML = function(str) {
    if (str === " ") {
      return "&nbsp;";
    } else if (str === "\n" || str === "\\n") {
      return "<br/>";
    } else if (str === "\t" || str == "\\t") {
      // Replace any tabs with four spaces.    
      return "&nbsp;&nbsp;&nbsp;&nbsp;";
    } else {
      return str;
    }
  }

  factory.convertWhitespaceToHTML2 = function(str) {
    if (str === "\n" || str === "\\n") {
      return "<br/>";
    } else {
      return "";
    }
  }

  factory.normalizer = normalizer;

  factory.buildSequence = function(neuronName, chars, weights, colorizer, file, layer, neuronIndex, link = true) {
    appendTo = d3.select("#sequences");

    var sequence = 
      appendTo
        .append("div")
        .attr("class", "sequence");

    if (link) {
      sequence    
        .append("a")
          .attr("href", "#/neuron/?file=" + file + "&layer=" + (layer) + "&n=" + (neuronIndex + 1))
          .html("<h5>" + neuronName + "</h5>");
    } else {
      sequence    
        .append("h5")
          .text(neuronName);
    }

    var block = sequence
      .append("div")
        .attr("class", "text")
        .selectAll("span")
        .data(_.zip(chars, weights))
        .enter()
          .append("span")
          .attr("class", "character")
          .attr("weight", function(x) { return x[1]; })
          .style("border-color", function(x) { return colorizer(x[1]); })
          .style("background-color", function(x) { return colorizer(x[1]); })
          .html(function(x) { return factory.convertWhitespaceToHTML(x[0]); });
  }
  
  return factory;
});