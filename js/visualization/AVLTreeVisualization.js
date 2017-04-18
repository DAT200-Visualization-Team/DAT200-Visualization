var animationTime = 1000;
var bst;
var treeGUI;
var loadingSequence;

function makeGUIUnEditable() {
    d3.select("#g_circles").selectAll('circle').on('click', null);
    d3.select("#g_labels").selectAll('text').on('click', null);
}

function findNodeInTreeEditor(binaryNode) {
    for(var i = 0; i < treeGUI.vis.length; i++) {
        if (treeGUI.vis[i].l === binaryNode.element) return treeGUI.vis[i];
    }
}

function findGUINodeByLabel(lbl) {}

function getLeftGUIChild() {}

function getRightGUIChild() {}

function init(rootLbl) {
    if(rootLbl == null) return;
    bst = new AVLTree();
    bst.insert(rootLbl);
    treeGUI = new tree(rootLbl);

    makeGUIUnEditable();
}

function visRotateWithLeftChild(k) {
    /*k = findNodeInTreeEditor(k);
    var kp = k.f;
    var kl = kp.c*/

}

function visRotateWithRightChild(k) {

}

function visDoubleRotateWithLeftChild() {

}

function visDoubleRotateWithRightChild() {

}

function visualizeInsert() {

}

function visualizeRemove() {

}


init(50);