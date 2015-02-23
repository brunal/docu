"use strict";
/* Docu display facility.
 * Play with the DOM.
 */

var Docu = require("./docu.js");
var xhr = require("xhr");

function DocuDisplay(container, data, nodeLoader) {
    this.docu = new Docu(data, window.location);
    this.setUpDOM(container);
    this.nodeLoader = nodeLoader;
}

DocuDisplay.prototype.setUpDOM = function(container) {

    var dd = this;
    function loadFromHref(event) {
        var name = this.attributes["href"].value.substr(1);
        if(!name)
            return;
        dd.goToNode(dd.docu.nodes[name]);
        event.preventDefault();
    }

    this.leftNav = document.createElement("a");
    this.leftNav.classList.add("docu-left-nav");
    this.leftNav.addEventListener("click", loadFromHref);

    this.container = document.createElement("div");
    this.container.classList.add("docu-main");

    this.rightNav = document.createElement("a");
    this.rightNav.classList.add("docu-right-nav");
    this.rightNav.addEventListener("click", loadFromHref);

    container.appendChild(this.leftNav);
    container.appendChild(this.container);
    container.appendChild(this.rightNav);
};

DocuDisplay.setUp = function(nodeLoader, then) {
    // static method that serves as a constructor
    // generate docu from #docu-display with its docu-data tag
    // FIXME take additional setUpDOM function?
    var container = document.getElementById("docu-display");
    return xhr({"uri": container.attributes["docu-data"].value},
               function(err, resp, body) {
                   var data = JSON.parse(body);
                   var dd = new DocuDisplay(container, data, nodeLoader);
                   dd.loadNode(dd.docu.currentNode);
                   then(dd);
               });
};

DocuDisplay.prototype.goToNode = function(node) {
    this.leftNav.href = ""
    this.leftNav.innerHTML = ""
    this.rightNav.href = ""
    this.rightNav.innerHTML = ""

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
    this.docu.setCurrentNode(node, window);
    this.loadNode(node);
};

DocuDisplay.prototype.loadNode = function(node) {
    if(node.prev) {
        this.leftNav.href = node.prev.url();
        this.leftNav.innerHTML = node.prev.name;
    }
    if(node.next) {
        this.rightNav.href = node.next.url();
        this.rightNav.innerHTML = node.next && node.next.name;
    }

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
