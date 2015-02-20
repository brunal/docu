var assert = require("assert");
var Docu = require("../docu.js");
describe('Docu', function() {
    it('build empty docu', function() {
        assert.deepEqual(new Docu({}), {"root": undefined});
    });

    it('build root-lest docu', function() {
        var data = {"nodes": {"node0": {"main": true, "tagada": 5}}}
        assert.deepEqual(new Docu(data), {"root": undefined});
    });

    it('build 1-node docu', function() {
        var data = {"nodes": {"node0": {"main": true, "tagada": 5}},
                    "root": "node0"}
        var docu = new Docu(data);
        assert.deepEqual(docu.root.content, {"tagada": 5});
        assert.deepEqual(docu.main_narration(), [docu.root]);
        assert(docu.root.isFirst());
        assert(docu.root.isLast());
    });

    it('build 3-nodes docu', function() {
        var data = {"nodes": {"node0": {"main": true, "tagada": 5},
                              "node1": {"main": true, "tagada": 6},
                              "node2": {"main": false, "tagada": 12}},
                    "root": "node0",
                    "edges": [["node0", "node1"],
                              ["node0", "node2"],
                              ["node2", "node1"]]}
        var docu = new Docu(data);
        assert.deepEqual(docu.root.content, {"tagada": 5});
        assert.deepEqual(docu.root.next.content, {"tagada": 6});
        var node1 = docu.root.next;
        assert.deepEqual(docu.root.next_minor, node1.prev_minor);
        assert.equal(docu.root.next_minor.length, 1);
        var node2 = docu.root.next_minor[0];
        assert.deepEqual(node2.content, {"tagada": 12});
        assert.deepEqual(node2.prev_minor, [docu.root]);
        assert.deepEqual(node2.next_minor, [node1]);
        assert.deepEqual(docu.main_narration(), [docu.root, node1]);

        assert(docu.root.isFirst());
        assert(!docu.root.isLast());
        assert(!node1.isFirst());
        assert(node1.isLast());
        assert.equal(node2.isFirst, undefined);
        assert.equal(node2.isLast, undefined);
    });
});
