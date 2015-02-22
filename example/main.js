//use strict;

var Docu = require("../docu.js");
var data = {
    "nodes": {"node1": {"main": true, "picture": "hi.png"},
              "node2": {"main": true, "picture": ""},
              "node1-1": {"main": false, "picture": ""}},
    "root": "node1",
    "edges": [["node1", "node2"],
              ["node1", "node1-1"],
              ["node1-1", "node2"]]
};

d = new Docu(data, window.location);
var node = d.current_node;
document.getElementById("sandbox").src = node.content.picture;
