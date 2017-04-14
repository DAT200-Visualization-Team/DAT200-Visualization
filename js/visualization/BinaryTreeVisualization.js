var animationTime = 1000;
var bt;
var treeGUI = new tree();

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
    var marker = $("#marker");
    return { e: marker, p: { translateX: cx, translateY: cy, opacity: 1 }, o: { duration: animationTime,/*, sequenceQueue: false*/ delay: 50} };
}

function visualizePreOrder() {
    init();
    var res = [];
    var loadingSequence = [];
    function preOrder(node) {
        res.push(node.element);
        if (node.left != null)
            preOrder(node.left);
        if (node.right != null)
            preOrder(node.right);
    }

    preOrder(bt.getRoot());
    createMarker();

    for(var i = 0; i < res.length; i++) {
        treeGUI.vis.forEach(function(y) {
            if (y.v === res[i]) {
                loadingSequence.push(moveMarker(y.p.x, y.p.y));
            }
        });
    }

    $.Velocity.RunSequence(loadingSequence);
}

function visualizeInOrder() {
    init();
    var res = [];
    var loadingSequence = [];
    function inOrder(node) {
        if (node.left != null)
            inOrder(node.left);
        res.push(node.element);
        if (node.right != null)
            inOrder(node.right);
    }

    inOrder(bt.getRoot());
    createMarker();

    for(var i = 0; i < res.length; i++) {
        treeGUI.vis.forEach(function(y) {
            if (y.v === res[i]) {
                loadingSequence.push(moveMarker(y.p.x, y.p.y));
            }
        });
    }

    $.Velocity.RunSequence(loadingSequence);
}

function visualizePostOrder() {
    init();
    var res = [];
    var loadingSequence = [];
    function postOrder(node) {
        if (node.left != null)
            postOrder(node.left);
        if (node.right != null)
            postOrder(node.right);
        res.push(node.element);
    }

    postOrder(bt.getRoot());
    createMarker();

    for(var i = 0; i < res.length; i++) {
        treeGUI.vis.forEach(function(y) {
            if (y.v === res[i]) {
                loadingSequence.push(moveMarker(y.p.x, y.p.y));
            }
        });
    }

    $.Velocity.RunSequence(loadingSequence);
}