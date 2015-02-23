"use strict";
/* Core docu code.
 * Load a json description, build a graph and offer navigation.
 */

var Node = function() {
    this.content = null;
    this.nextMinor = [];
    this.prevMinor = [];
};

var Edge = function(n1, n2) {
    this.from = n1;
    this.to = n2;
};

function MainNode() {
    Node.call(this);
    this.next = null;
    this.prev = null;
}
MainNode.prototype = Object.create(Node.prototype);
MainNode.prototype.constructor = MainNode;


MainNode.prototype.isFirst = function() {
    return this.prev === null;
};
MainNode.prototype.isLast = function() {
    return this.next === null;
};

function Docu(data_json, url) {
    // parse data into a graph
    var nodes = {};
    for(var node_name in data_json.nodes) {
        var node;
        if(data_json.nodes[node_name].main) {
            node = new MainNode();
        } else {
            node = new Node();
        }
        delete data_json.nodes[node_name].main;
        node.content = data_json.nodes[node_name];
        node.name = node_name;
        nodes[node_name] = node;
    }

    (data_json.edges || []).forEach(function(edge) {
        var from = nodes[edge[0]];
        var to = nodes[edge[1]];
        if(from instanceof MainNode && to instanceof MainNode) {
            from.next = to;
            to.prev = from;
        } else {
            from.nextMinor.push(to);
            to.prevMinor.push(from);
        }
    });
    this.nodes = nodes;
    this.root = nodes[data_json.root];
    var hash = url && url.hash || "";
    this.currentNode = this.nodes[hash.substr(1)] || this.root;
}

Docu.prototype.mainNarration = function() {
    var narr = [];
    var node = this.root;
    while(node !== null) {
        narr.push(node);
        node = node.next;
    }
    return narr;
};

Docu.prototype.setCurrentNode = function(node, window) {
    this.currentNode = node;
    if(window)
        window.location.hash = "#" + node.name;
};

module.exports = Docu;
