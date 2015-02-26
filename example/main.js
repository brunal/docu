"use strict";
var DocuDisplay = require("../use_docu.js");
var d = new DocuDisplay({"nodeLoader": function(content) {
    this.container.innerHTML = "<img src='" + content.picture + "'/>";
}});
