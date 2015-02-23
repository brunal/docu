var assert = require("assert");
var Docu = require("../docu.js");
describe('Docu', function() {
    it('build empty docu', function() {
        assert.deepEqual(new Docu({}),
                {"root": undefined, "currentNode": undefined, "nodes": {}});
    });

    it('build root-less docu', function() {
        var data = {"nodes": {"node0": {"main": true}}}
        assert.deepEqual(new Docu(data),
                         {"root": undefined,
                         "currentNode": undefined,
                         "nodes": {"node0": {"name": "node0", "content": {},
                                             "next": null, "prev": null,
                                             "nextMinor": [],
                                             "prevMinor": []}}});
    });

    it('build 1-node docu', function() {
        var data = {"nodes": {"node0": {"main": true, "tagada": 5}},
                    "root": "node0"}
        var docu = new Docu(data);
        assert.deepEqual(docu.root.name, "node0");
        assert.deepEqual(docu.root.content, {"tagada": 5});
        assert.deepEqual(docu.currentNode, docu.root);
        assert.deepEqual(docu.mainNarration(), [docu.root]);
        assert(docu.root.isFirst());
        assert(docu.root.isLast());
    });

    it('build 3-nodes docu', function() {
        var data = {"nodes": {"node0": {"main": true},
                              "node1": {"main": true},
                              "node2": {"main": false}},
                    "root": "node0",
                    "edges": [["node0", "node1"],
                              ["node0", "node2"],
                              ["node2", "node1"]]}
        var docu = new Docu(data);
        var node0 = docu.nodes["node0"];
        var node1 = docu.nodes["node1"];
        var node2 = docu.nodes["node2"];

        assert.deepEqual(docu.root, node0);
        assert.deepEqual(docu.currentNode, docu.root);
        assert.deepEqual(docu.root.next, node1);
        assert.deepEqual(docu.root.nextMinor, [node2]);
        assert.deepEqual(node1.prevMinor, [node2]);
        assert.equal(docu.root.nextMinor.length, 1);
        assert.deepEqual(node2.prevMinor, [docu.root]);
        assert.deepEqual(node2.nextMinor, [node1]);
        assert.deepEqual(docu.mainNarration(), [docu.root, node1]);

        assert(docu.root.isFirst());
        assert(!docu.root.isLast());
        assert(!node1.isFirst());
        assert(node1.isLast());
        assert.equal(node2.isFirst, undefined);
        assert.equal(node2.isLast, undefined);
    });

    it('set and get hash-url', function() {
        var data = {"nodes": {"node0": {"main": true},
                              "node1": {"main": true},
                              "node2": {"main": false}},
                    "root": "node0",
                    "edges": [["node0", "node1"],
                              ["node0", "node2"],
                              ["node2", "node1"]]}
        var docu = new Docu(data);
        assert.equal(docu.currentNode, docu.root);

        var window = {"location": {"hash": ""}};
        var url = window.location;
        url.hash = "#node1";
        var docu = new Docu(data, url);
        assert.equal(docu.currentNode, docu.nodes["node1"]);

        url.hash = "#node2";
        var docu = new Docu(data, url);
        assert.equal(docu.currentNode, docu.nodes["node2"]);

        url.hash = "#foobar";
        var docu = new Docu(data, url);
        assert.equal(docu.currentNode, docu.root);

        docu.setCurrentNode(docu.nodes["node2"]);
        assert.equal(docu.currentNode, docu.nodes["node2"]);
        docu.setCurrentNode(docu.nodes["node1"], window);
        assert.equal(docu.currentNode, docu.nodes["node1"]);
        assert.equal(url.hash, "#node1");
    });
});

var DocuDisplay = require("../use_docu.js");
var jsdom = require("mocha-jsdom");
describe('DocuDisplay', function() {
    jsdom();

    before(function() {
        require("../test-dep/classList.js");
    });

    it('setup dom', function() {
        var div = document.createElement("div");
        DocuDisplay.prototype.setUpDOM(div);
        assert.equal(div.innerHTML, '<div class="docu-left-nav"></div>' +
                                    '<div class="docu-main"></div>' +
                                    '<div class="docu-right-nav"></div>')
    });

    it('constructor', function() {
        var container = document.createElement("div");
        var nodeLoader = function(node) {};
        var dd = new DocuDisplay(container, {}, nodeLoader);
        assert.equal(dd.nodeLoader, nodeLoader);
        assert.equal(dd.container.outerHTML, '<div class="docu-main"></div>');
        assert.equal(dd.container, container.children[1]);
    });

    it('navigate nodes', function() {
        var container = document.createElement("div");
        document.body.appendChild(container);

        var data = {"nodes": {"node1": {"main": true, "picture": "hi.png"},
                              "node2": {"main": true, "locationId": "deux"}},
                    "root": "node1",
                    "edges": [["node1", "node2"]]};
        var nodeLoader = function(content) {
            var text = document.createTextNode("loaded node with picture " +
                                               content.picture);
            this.container.appendChild(text);
        };

        var dd = new DocuDisplay(container, data, nodeLoader);
        dd.loadNode(dd.docu.currentNode);
        assert.equal(dd.container.innerHTML, "loaded node with picture hi.png");

        assert.throws(function() { dd.goToNode(dd.docu.nodes["node2"]) },
                      Error);

        var deux = document.createElement("div");
        deux.id = "deux";
        deux.appendChild(document.createTextNode("deux deux"));
        document.body.appendChild(deux);
        dd.loadNode(dd.docu.nodes["node2"]);

        assert.equal(dd.container.innerHTML, '<div id="deux">deux deux</div>');
        assert.equal(document.body.lastChild.outerHTML,
                     '<div id="docu-sentinel"></div>');

        dd.goToNode(dd.docu.nodes["node1"]);
        assert.equal(dd.container.innerHTML, "loaded node with picture hi.png");
        assert.equal(document.getElementById("docu-sentinel"), null);
    });
});
