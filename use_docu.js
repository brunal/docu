"use strict";

var Docu = require("./docu.js");

function DocuDisplay(container, data, nodeLoader) {
    this.docu = new Docu(data, window.location);
    this.container = this.setUpDOM(container);
    this.nodeLoader = nodeLoader;
}

DocuDisplay.prototype.setUpDOM = function(container) {
    var leftNav = document.createElement("div");
    leftNav.classList.add("docu-left-nav");
    var main = document.createElement("div");
    main.classList.add("docu-main");
    var rightNav = document.createElement("div");
    rightNav.classList.add("docu-right-nav");
    container.appendChild(leftNav);
    container.appendChild(main);
    container.appendChild(rightNav);
    return main;
};

DocuDisplay.setUp = function() {
    // static method that serves as a constructor
    // generate docu from #docu-display with its docu_data tag
    var container = document.getElementById("docu-display");
    var data = require(container.docu_data);
    var dd = new DocuDisplay(container, data);
    dd.loadNode(dd.docu.currentNode);
    return dd;
};

DocuDisplay.prototype.goToNode = function(node) {
    if(this.docu.currentNode.content.locationId) {
        // restore it to its original location
        var sentinel = document.getElementById("docu-sentinel");
        sentinel.parentNode.insertBefore(this.container.childNodes[0], sentinel);
        sentinel.parentNode.removeChild(sentinel);
    } else {
        // empty the container
        while(this.container.hasChildNodes()) {
            this.container.removeChild(this.container.lastChild);
        }
    }
    this.docu.setCurrentNode(node);
    this.loadNode(node);
};

DocuDisplay.prototype.loadNode = function(node) {
    if(node.content.locationId) {
        // everything is in a node, copy its content in the docu-main div
        // and put a mark on its original location
        var sentinel = document.createElement("div");
        sentinel.id = "docu-sentinel";
        var content = document.getElementById(node.content.locationId);
        if(content === null)
            throw new Error("Cannot find element of id '" +
                            node.content.locationId +
                            "' for node " + node.name);
        content.parentNode.insertBefore(sentinel, content);
        this.container.appendChild(content);
    } else {
        // put picture, links, etc.
        this.nodeLoader(node.content);
    }
};

module.exports = DocuDisplay;
