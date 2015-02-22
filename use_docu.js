var Docu = require("./docu.js");

function DocuDisplay(container, data) {
    this.container = container;
    this.docu = new Docu(data, window.location);
    this.setUpDOM(container);
}

DocuDisplay.prototype.setUpDOM = function(container) {
    // put all needed tags in container
    // FIXME
}

DocuDisplay.prototype.setUp = function() {
    // static method that serves as a constructor
    // generate docu from #docu-display with its docu_data tag
    var container = document.getElemetById("docu-display");
    var data = required(container.docu_data);
    var dd = new DocuDisplay(container, data);
    dd.loadNode(dd.docu.current_node);
    return dd;
};

DocuDisplay.prototype.goToNode = function(node) {
    this.container.setCurrentNode(node);
    this.loadNode(node);
}

DocuDisplay.prototype.loadNode = function(node) {
    if(node.content.locationId) {
        // everything is in a node, copy its content in the main div?
        // FIXME
    } else {
        // put picture, links, etc.
    }
}
