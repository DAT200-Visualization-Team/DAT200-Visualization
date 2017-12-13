var animationTime = 1;
var bst;
var treeGUI;
var loadingSequence;
var codeDisplayManager;
var markerInitialPosition;

function makeGUIUnEditable() {
    d3.select("#g_circles").selectAll('circle').on('click', null);
    d3.select("#g_labels").selectAll('text').on('click', null);
}

function findNodeInTreeEditor(binaryNode) {
    for (var i = 0; i < treeGUI.vis.length; i++) {
        if (treeGUI.vis[i].l === binaryNode.element) return treeGUI.vis[i];
    }
}

function createMarker(x, y) {
    markerInitialPosition = treeGUI.vis[0].p;
    /*if (x !== undefined && y !== undefined)
        markerInitialPosition = {x: x, y: y};*/
    d3.select("#treesvg").append('g').attr('class', 'markers').append('circle').attr('id', 'marker')
        .attr('cx', markerInitialPosition.x).attr('cy', markerInitialPosition.y).attr('r', 14)/*.attr('opacity', 0)*/;
}

function moveMarker(cx, cy) {
    return [{ e: $("#marker"), p: { x: cx - markerInitialPosition.x, y: cy - markerInitialPosition.y, opacity: 1 },
        o: { duration: animationTime} }];
}

function removeMarker() {$("#marker").remove()}

function init(rootLbl) {
    if (rootLbl == null) return;
    codeDisplayManager = new CodeDisplayManager("javascript", "binarySearchTree");
    bst = new BinarySearchTree();
    bst.insert(rootLbl);
    treeGUI = new tree(rootLbl);

    makeGUIUnEditable();
}

function visualizeInsert(lbl) {
    function getVertixMarkAnimation(n) {
        var point = findNodeInTreeEditor(n).p;
        return moveMarker(point.x, point.y);
    }

    function insert(x, t) {
        var hasBeenInIf = false;
        if (t !== null) {
            appendAnimation(null, getVertixMarkAnimation(t), codeDisplayManager);
        }
        else {
            var p = treeGUI.getFutureLeafPositionHelper(findNodeInTreeEditor(parent).v, direction);
            var tmp = moveMarker(p.x, p.y);
            appendAnimation(null, tmp, codeDisplayManager);
        }
        appendCodeLines([0], codeDisplayManager);

        if (t === null && !hasBeenInIf) {
            hasBeenInIf = true;
            t = new BinaryNode(x);

            // Following line of animation does nothing in particular.
            // It is a dummy animation in order to access and utilize onComplete and onReverseComplete
            var tmp = [{e: $("#marker"), p: {attr:{stroke: "red"}}, o:{duration: animationTime}}];

            tmp[0].p.onComplete = function() {
                var parentInGUI = findNodeInTreeEditor(parent);
                treeGUI.addLeaf(parentInGUI.v, direction, lbl);
                //$("#marker").animate()
            };
            tmp[0].p.onReverseComplete = function() {
                var parentInGUI = findNodeInTreeEditor(parent);
                for(var i = 0; i < parentInGUI.c.length; i++) {
                    if(parentInGUI.c[i].d === direction) {
                        treeGUI.removeLeaf(parentInGUI.c[i].v);
                    }
                }
                t = null;
            };

            appendAnimation(1, tmp, codeDisplayManager);
            appendCodeLines([2, 4, 6], codeDisplayManager);
        }

        else if (x - t.getElement() < 0 && !hasBeenInIf) {
            hasBeenInIf = true, direction = "left", parent = t;
            appendCodeLines([2, 3], codeDisplayManager);
            t.setLeft(insert(x, t.getLeft()));
            appendCodeLines([4, 6], codeDisplayManager);
        }

        else if (x - t.getElement() > 0 && !hasBeenInIf) {
            hasBeenInIf = true, direction = "right", parent = t;
            appendCodeLines([2, 4, 5], codeDisplayManager);
            t.setRight(insert(x, t.getRight()));
            appendCodeLines([6], codeDisplayManager);
        }

        else if(!hasBeenInIf) {
            hasBeenInIf = true;
            //throw { name: "DuplicateItemException", message: "Duplicate items are not allowed" };
            var animation = [{ e: $("#graphics, .treeEditor svg"), p: {"background-color": "#ff0000", opacity: 0.5}, o: { duration: animationTime/2} }];
            animation.push({ e: $("#graphics, .treeEditor svg"), p: {"background-color": "#fcfcfc", opacity: 1}, o: { duration: animationTime/2} });
            appendAnimation(7, animation, codeDisplayManager);
            return t;
        }
        appendCodeLines([8], codeDisplayManager);
        return t;
    }

    removeMarker();
    createMarker();
    codeDisplayManager.loadFunctions("insertNode");
    codeDisplayManager.changeFunction("insertNode");
    var parent = bst.root, direction = null;
    insert(lbl, bst.root);
    makeGUIUnEditable();
}

function visualizeSearch(lbl) {
    function getVertixMarkAnimation(n) {
        var point = findNodeInTreeEditor(n).p;
        return moveMarker(point.x, point.y);
    }
    removeMarker();
    codeDisplayManager.loadFunctions("findNode");
    codeDisplayManager.changeFunction("findNode");
    var t = bst.root;
    createMarker();
    while (t !== null) {
        var hasBeenInIf = false;
        appendCodeLines([0], codeDisplayManager);
        appendCodeLines([1], codeDisplayManager);
        if (lbl - t.getElement() < 0) {
            t = t.getLeft();
            if (t !== null) {
                appendAnimation(2, getVertixMarkAnimation(t), codeDisplayManager);
            }
            appendCodeLines([3, 5, 7], codeDisplayManager);
            hasBeenInIf = true;
        }
        else if (lbl - t.getElement() > 0 && !hasBeenInIf) {
            appendCodeLines([3], codeDisplayManager);
            t = t.getRight();
            if (t !== null) {
                appendAnimation(4, getVertixMarkAnimation(t), codeDisplayManager);
            }
            appendCodeLines([5, 7], codeDisplayManager);
            hasBeenInIf = true;
        }
        else if(!hasBeenInIf) {
            appendCodeLines([3, 5], codeDisplayManager);
            var animation = [{ e: $("#marker"), p: {stroke: "#00cd00", "stroke-width": 5}, o: { duration: animationTime} }];
            appendAnimation(6, animation, codeDisplayManager);
            return t; // Match
        }
    }

    var animation = [{ e: $("#graphics, .treeEditor svg"), p: {"background-color": "#ff0000", opacity: 0.5}, o: { duration: animationTime/2} }];
    animation.push({ e: $("#graphics, .treeEditor svg"), p: {"background-color": "#fcfcfc", opacity: 1}, o: { duration: animationTime/2} });
    appendAnimation(9, animation, codeDisplayManager);
    makeGUIUnEditable();
    return null; // Not Found
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
    removeMarker();
    codeDisplayManager.loadFunctions("removeNode");
    codeDisplayManager.changeFunction("removeNode");
    var parent = bst.root, direction = null;
    remove(lbl, bst.root);
    makeGUIUnEditable();
}

init(50);
/*
setTimeout(function(){
    visualizeInsert(90);
    setTimeout(function() {
        visualizeInsert(30);
    }, 3000)
}, 3000);
*/
