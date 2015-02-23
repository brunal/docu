"use strict";
var DocuDisplay = require("../use_docu.js");
var d = DocuDisplay.setUp(function(content) {
    this.container.innerHTML = "<img src='" + content.picture + "'/>";
}, console.log);
