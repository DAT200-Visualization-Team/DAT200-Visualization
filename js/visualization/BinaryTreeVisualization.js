var animationTime = 1;
var bt;
var treeGUI = new tree();
var codeDisplayManager = new CodeDisplayManager('javascript', 'binaryTree/binaryNode');

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
    return [{ e: $("#marker"), p: { x: cx, y: cy, opacity: 1 }, o: { duration: animationTime/*, delay: 50*/} }];
}

function visualizePreOrder() {
    init();
    codeDisplayManager.loadFunctions('printPreOrder');
    codeDisplayManager.changeFunction('printPreOrder');
    function preOrder(node) {
        treeGUI.vis.forEach(function(y) {
            if (y.v === node.element) {
                appendAnimation(0, moveMarker(y.p.x, y.p.y), codeDisplayManager);
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
                appendAnimation(2, moveMarker(y.p.x, y.p.y), codeDisplayManager);
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
                appendAnimation(4, moveMarker(y.p.x, y.p.y), codeDisplayManager);
            }
        });

        appendCodeLines([5], codeDisplayManager);
    }
    createMarker();
    postOrder(bt.getRoot());
}