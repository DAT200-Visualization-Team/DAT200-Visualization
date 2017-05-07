var animationTime = 1000;
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

function init(rootLbl) {
    if (rootLbl == null) return;
    codeDisplayManager = new CodeDisplayManager("javascript", "binarySearchTree");
    bst = new BinarySearchTree();
    bst.insert(rootLbl);
    treeGUI = new tree(rootLbl);

    makeGUIUnEditable();
}

function visualizeInsert(lbl) {
    function insert(x, t) {
        if (parent != bst.root) {
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
        }
        appendCodeLines([0], codeDisplayManager);
        if (t === null) {
            t = new BinaryNode(x);
            if (parent != bst.root) {
                var tmp = {e: "#treesvg", p: {}, o: {duration: animationTime}};
                tmp.p.onComplete = function() {
                    parent = findNodeInTreeEditor(parent);
                    treeGUI.addLeaf(parent.v, direction, lbl);
                    $("#g_lines line").each(function (i) {
                        $(this).removeAttr("style");
                        $(this).attr("stroke", "#808080");
                    });
                };
                appendAnimation(2, [tmp], codeDisplayManager);
            }
            else {
                var tmp = {e: "#treesvg", p: {}, o: {duration: animationTime}};
                tmp.p.onComplete = function() {
                    parent = findNodeInTreeEditor(parent);
                    treeGUI.addLeaf(parent.v, direction, lbl);
                };
                appendAnimation(2, [tmp], codeDisplayManager);
            }
        }
        else if (x - t.getElement() < 0) {
            parent = t, direction = 'left';
            t.setLeft(insert(x, t.getLeft()));
        }
        else if (x - t.getElement() > 0) {
            parent = t, direction = 'right';
            t.setRight(insert(x, t.getRight()));
        }
        else {
            //TODO: visualize error
            //throw { name: "DuplicateItemException", message: "Duplicate items are not allowed" };
        }
        return t;
    }

    codeDisplayManager.loadFunctions("insertNode");
    codeDisplayManager.changeFunction("insertNode");
    var parent = bst.root, direction = null;
    insert(lbl, bst.root);
    makeGUIUnEditable();
}

function visualizeSearch(lbl) {
    function search(x, t) {
        while (t !== null) {
            if (parent != bst.root) {
                var point = findNodeInTreeEditor(parent).p;
                $("#g_lines line").each(function () {
                    if (point.x == $(this).attr("x2") && point.y == $(this).attr("y2")) {
                        loadingSequence.push({e: $(this), p: {stroke: "#ffff00"}, o: {duration: animationTime}});
                    }
                });
            }
            if (x - t.getElement() < 0) {
                parent = t, direction = 'left';
                t = t.getLeft();
            }
            else if (x - t.getElement() > 0) {
                parent = t, direction = 'right';
                t = t.getRight();
            }
            else {
                if (t != bst.root) {
                    var point = findNodeInTreeEditor(t).p;
                    $("#g_lines line").each(function () {
                        if (point.x == $(this).attr("x2") && point.y == $(this).attr("y2")) {
                            loadingSequence.push({e: $(this), p: {stroke: "#ffff00"}, o: {duration: animationTime}});
                        }
                    });
                }
                $("#g_labels text").each(function () {
                    if (t.element == $(this).text()) {
                        d3.select("#treesvg").append('circle').attr('id', 'result')
                            .attr('cx', $(this).attr("x")).attr('cy', $(this).attr("y") - 5)
                            .attr('r', 13).attr('opacity', 0).style('fill', 'none').style('stroke', '#ffff00');
                        loadingSequence.push({e: $("#result"), p: {opacity: 1}, o: {duration: animationTime}});

                        loadingSequence[loadingSequence.length - 1].o.complete = function () {
                            $("#result").remove();
                            $("#g_lines line").each(function (i) {
                                $(this).removeAttr("style");
                                $(this).attr("stroke", "#808080");
                            });
                        };
                    }
                });

                return;
            }
        }
    }

    loadingSequence = [];
    var parent = bst.root, direction = null;
    search(lbl, bst.root);
    $.Velocity.RunSequence(loadingSequence);
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

    loadingSequence = [];
    var parent = bst.root, direction = null;
    remove(lbl, bst.root);
    $.Velocity.RunSequence(loadingSequence);
    makeGUIUnEditable();
}

init(50);
/*visualizeInsert(70);
 visualizeInsert(60);
 visualizeInsert(80);
 visualizeInsert(30);
 visualizeInsert(20);
 visualizeInsert(40);*/
