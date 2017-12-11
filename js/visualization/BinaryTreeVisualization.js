var animationTime = 1;
var bt;
var treeGUI = new tree();
var codeDisplayManager = new CodeDisplayManager('javascript', 'binaryTree/binaryNode');

$(document).ready(function () {
    $('#console-window').resizable({ handles: 'all', containment: 'document', minWidth: 200, minHeight: 200 });
    $('#console-window').draggable({ containment: 'document', handle: '#controls' });
});

function toggleMatrixHiding() {
    $('#console-window').toggle(200);
}

function updateConsoleBody(value, remove) {
    if(remove !== undefined && remove === true) {
        $('#content').empty();
    }
    else {
        $('#content').append("<li>" + value + "</li>");
        var animation = { e: $("#content li:last-child"), p: {opacity:1}, o: { duration: animationTime} };
        return animation;
    }

}

function init() {
    bt = new BinaryTree(treeGUI.vis[0].v);
    setChildren(bt.getRoot());

    function setChildren(binaryNode) {
        var child;
        treeGUI.vis.forEach(function(i) {
            if(i.f.v === binaryNode.element) {
                if(i.d == 'left') child = binaryNode.setLeft(new BinaryNode(i.v));
                else child = binaryNode.setRight(new BinaryNode(i.v));
                setChildren(child);
            }
        });
    }
}

function createMarker() {
    d3.select("#treesvg").append('g').attr('class', 'markers')
        .append('circle').attr('id', 'marker').attr('cx', 0).attr('cy', 0).attr('r', 14).attr('opacity', 0);
}

function moveMarker(cx, cy) {
    return [{ e: $("#marker"), p: { x: cx, y: cy, opacity: 1 }, o: { duration: animationTime} }];
}

function visualizePreOrder() {
    init();
    updateConsoleBody(null, true);
    codeDisplayManager.loadFunctions('printPreOrder');
    codeDisplayManager.changeFunction('printPreOrder');
    function preOrder(node) {
        treeGUI.vis.forEach(function(y) {
            if (y.v === node.element) {
                var tmp = moveMarker(y.p.x, y.p.y);
                tmp.push(updateConsoleBody(node.element));
                appendAnimation(0, tmp, codeDisplayManager);
            }
        });

        appendCodeLines([1], codeDisplayManager);
        if (node.left != null) {
            appendCodeLines([2], codeDisplayManager);
            preOrder(node.left);
        }

        appendCodeLines([3], codeDisplayManager);
        if (node.right != null) {
            appendCodeLines([4], codeDisplayManager);
            preOrder(node.right);
        }

        appendCodeLines([5], codeDisplayManager);
    }

    createMarker();
    preOrder(bt.getRoot());
}

function visualizeInOrder() {
    init();
    updateConsoleBody(null, true);
    codeDisplayManager.loadFunctions('printInOrder');
    codeDisplayManager.changeFunction('printInOrder');
    function inOrder(node) {

        appendCodeLines([0], codeDisplayManager);
        if (node.left != null) {
            appendCodeLines([1], codeDisplayManager);
            inOrder(node.left);
        }

        treeGUI.vis.forEach(function(y) {
            if (y.v === node.element) {
                var tmp = moveMarker(y.p.x, y.p.y);
                tmp.push(updateConsoleBody(node.element));
                appendAnimation(2, tmp, codeDisplayManager);
            }
        });

        appendCodeLines([3], codeDisplayManager);
        if (node.right != null) {
            appendCodeLines([4], codeDisplayManager);
            inOrder(node.right);
        }

        appendCodeLines([5], codeDisplayManager);
    }

    createMarker();
    inOrder(bt.getRoot());
}

function visualizePostOrder() {
    init();
    updateConsoleBody(null, true);
    codeDisplayManager.loadFunctions('printPostOrder');
    codeDisplayManager.changeFunction('printPostOrder');
    var res = [];
    var loadingSequence = [];
    function postOrder(node) {

        appendCodeLines([0], codeDisplayManager);
        if (node.left != null) {
            appendCodeLines([1], codeDisplayManager);
            postOrder(node.left);
        }

        appendCodeLines([2], codeDisplayManager);
        if (node.right != null) {
            appendCodeLines([3], codeDisplayManager);
            postOrder(node.right);
        }

        treeGUI.vis.forEach(function(y) {
            if (y.v === node.element) {
                var tmp = moveMarker(y.p.x, y.p.y);
                tmp.push(updateConsoleBody(node.element));
                appendAnimation(4, tmp, codeDisplayManager);
            }
        });

        appendCodeLines([5], codeDisplayManager);
    }
    createMarker();
    postOrder(bt.getRoot());
}

function processUploadedObject(object) {
    treeGUI = tree();
    for (var property in object.binarytree) {
        if (object.binarytree.hasOwnProperty(property)) {
            treeGUI[property] = object.binarytree[property];
        }
    }
    treeGUI.redraw();
}

$('#download-button, #download-button-mobile').on('click', function () {
    downloadObjectJson(treeGUI, 'binarytree');
});
