var animationTime = 1;
var bst;
var treeGUI;
var loadingSequence;
var codeDisplayManager;

function makeGUIUnEditable() {
    d3.select("#g_circles").selectAll('circle').on('click', null);
    d3.select("#g_labels").selectAll('text').on('click', null);
}

function findNodeInTreeEditor(binaryNode) {
    for (var i = 0; i < treeGUI.vis.length; i++) {
        if (treeGUI.vis[i].l === binaryNode.element) return treeGUI.vis[i];
    }
}

function createMarker() {
    d3.select("#treesvg").append('g').attr('class', 'markers')
        .append('circle').attr('id', 'marker').attr('cx', 0).attr('cy', 0).attr('r', 14).attr('opacity', 0);
}

function moveMarker(cx, cy) {
    return [{ e: $("#marker"), p: { x: cx, y: cy, opacity: 1 }, o: { duration: animationTime} }];
}

function init(rootLbl) {
    if (rootLbl == null) return;
    codeDisplayManager = new CodeDisplayManager("javascript", "binarySearchTree");
    bst = new BinarySearchTree();
    bst.insert(rootLbl);
    treeGUI = new tree(rootLbl);

    makeGUIUnEditable();
}

function visualizeInsert(lbl) {
    function highlightNodeEdge(n, dir) {
        var point = findNodeInTreeEditor(n).p;
        $("#g_lines line").each(function () {
            if (point.x == $(this).attr("x2") && point.y == $(this).attr("y2")) {

                var lineToHighLight;
                if (dir == 'left') lineToHighLight = 3;
                else lineToHighLight = 5;
                var tmp = {e: $(this), p: {stroke: "#FFFF00"}, o: {duration: animationTime}};
                appendAnimation(lineToHighLight, [tmp], codeDisplayManager);
            }
        });
    }

    function insert(x, t) {
        var hasNotBeenInIf = true;
        var highlightedEdges = [];

        /*if (parent != bst.root) {
            var point = findNodeInTreeEditor(parent).p;
            $("#g_lines line").each(function () {
                if (point.x == $(this).attr("x2") && point.y == $(this).attr("y2")) {

                    var lineToHighLight;
                    if (direction == 'left') lineToHighLight = 3;
                    else lineToHighLight = 5;
                    var tmp = {e: $(this), p: {stroke: "#FFFF00"}, o: {duration: animationTime}};
                    appendAnimation(lineToHighLight, [tmp], codeDisplayManager);
                }
            });
        }*/

        appendCodeLines([0], codeDisplayManager);
        if (t === null && hasNotBeenInIf) {
            hasNotBeenInIf = false;
            t = new BinaryNode(x);
            if (parent != bst.root) {
                var tmp = {e: "#g_lines line", p: {attr: {stroke: "#808080"}}, o: {duration: animationTime}};
                tmp.p.onComplete = function() {
                    var parentInGUI = findNodeInTreeEditor(parent);
                    treeGUI.addLeaf(parentInGUI.v, direction, lbl);
                };
                tmp.p.onReverseComplete = function() {
                    var parentInGUI = findNodeInTreeEditor(parent);
                    var dir = 0;
                    (direction == 'left') ? dir = 0 : dir = 1;
                    for(var i = 0; i < parentInGUI.c.length; i++) {
                        if(parentInGUI.c[i].d == direction) {
                            treeGUI.removeLeaf(parentInGUI.c[i].v);
                        }
                    }
                    t = null;
                };
                appendAnimation(1, [tmp], codeDisplayManager);
            }
            else {
                var tmp = {e: "#g_lines line", p: {attr: {stroke: "#808080"}}, o: {duration: animationTime}};
                tmp.p.onComplete = function() {
                    var parentInGUI = findNodeInTreeEditor(parent);
                    treeGUI.addLeaf(parentInGUI.v, direction, lbl);
                };
                tmp.p.onReverseComplete = function() {
                    var parentInGUI = findNodeInTreeEditor(parent);
                    var dir = 0;
                    (direction == 'left') ? dir = 0 : dir = 1;
                    for(var i = 0; i < parentInGUI.c.length; i++) {
                        if(parentInGUI.c[i].d == direction) {
                            treeGUI.removeLeaf(parentInGUI.c[i].v);
                        }
                    }
                    t = null;
                };
                appendAnimation(1, [tmp], codeDisplayManager);
            }
        }

        else if (x - t.getElement() < 0 && hasNotBeenInIf) {
            hasNotBeenInIf = false;
            parent = t, direction = 'left';
            if (parent == bst.root) appendCodeLines([3], codeDisplayManager);
            highlightNodeEdge(parent, 'left')
            t.setLeft(insert(x, t.getLeft()));
        }

        else if (x - t.getElement() > 0 && hasNotBeenInIf) {
            hasNotBeenInIf = false;
            parent = t, direction = 'right';
            if (parent == bst.root) appendCodeLines([5], codeDisplayManager);
            highlightNodeEdge(parent, 'right')
            t.setRight(insert(x, t.getRight()));
        }

        else if(hasNotBeenInIf) {
            hasNotBeenInIf = false;
            //TODO: visualize error
            //throw { name: "DuplicateItemException", message: "Duplicate items are not allowed" };
        }
        appendCodeLines([8], codeDisplayManager);
        return t;
    }

    codeDisplayManager.loadFunctions("insertNode");
    codeDisplayManager.changeFunction("insertNode");
    var parent = bst.root, direction = null;
    insert(lbl, bst.root);
    makeGUIUnEditable();
}

function visualizeSearch(lbl) {
    function highlightNodeEdge(n, dir) {
        var point = findNodeInTreeEditor(n).p;
        $("#g_lines line").each(function () {
            if (point.x == $(this).attr("x2") && point.y == $(this).attr("y2")) {

                var lineToHighLight;
                if (dir == 'left') lineToHighLight = 2;
                else lineToHighLight = 4;
                var tmp = {e: $(this), p: {stroke: "#FF0000"}, o: {duration: animationTime}};
                appendAnimation(lineToHighLight, [tmp], codeDisplayManager);
            }
        });
    }

    codeDisplayManager.loadFunctions("findNode");
    codeDisplayManager.changeFunction("findNode");
    var t = bst.root;
    appendCodeLines([0], codeDisplayManager);
    while (t !== null) {
        if (lbl - t.getElement() < 0) {
            appendCodeLines([1], codeDisplayManager);
            t = t.getLeft();
            if (t !== null) highlightNodeEdge(t, 'left');

        }
        else if (lbl - t.getElement() > 0) {
            appendCodeLines([1], codeDisplayManager);
            t = t.getRight();
            if (t !== null) highlightNodeEdge(t, 'right');

        }
        else {
            appendCodeLines([5], codeDisplayManager);
            appendCodeLines([6], codeDisplayManager);
            // TODO: show node

            return t; // Match
            appendCodeLines([7, 0], codeDisplayManager);
        }

    }

    // TODO: show fail
    appendCodeLines([9], codeDisplayManager);
    return null; // Not Found


    makeGUIUnEditable();
}

function visualizeRemove(lbl) {
    function remove(x, t) {
        if (parent != bst.root) {
            var point = findNodeInTreeEditor(parent).p;
            $("#g_lines line").each(function () {
                if (point.x == $(this).attr("x2") && point.y == $(this).attr("y2")) {
                    loadingSequence.push({e: $(this), p: {stroke: "#ffff00"}, o: {duration: animationTime}});
                }
            });
        }

        if (t === null) {
        }//TODO: give error
        if (x - t.getElement() < 0) {
            parent = t, direction = 'left';
            t.setLeft(remove(x, t.getLeft()));
        }
        else if (x - t.getElement() > 0) {
            parent = t, direction = 'right';
            t.setRight(remove(x, t.getRight()));
        }
        else if (t.getLeft() !== null && t.getRight() !== null) { // Two children
            t.setElement(bst.findMinNode(t.getRight()).getElement()); // Bytter verdiene på elementene
            t.setRight(bst.removeMinNode(t.getRight())); // Fjerner noden den har bytta med, og setter
        }
        else {
            if (t.getLeft() !== null) {
                parent = t, direction = 'left';
                t = t.getLeft();
            }
            else {
                parent = t, direction = 'right';
                t = t.getRight();
            }
        }
        return t;
    }

    codeDisplayManager.loadFunctions("removeNode");
    codeDisplayManager.changeFunction("removeNode");
    var parent = bst.root, direction = null;
    remove(lbl, bst.root);
    makeGUIUnEditable();
}

init(50);
setTimeout(function(){
    visualizeInsert(90);
    setTimeout(function() {
        visualizeInsert(30);
    }, 3000)
}, 3000);
