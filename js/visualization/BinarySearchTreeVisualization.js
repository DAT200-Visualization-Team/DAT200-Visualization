var animationTime = 1000;
var bst;
var treeGUI;

function init(rootLbl) {
    bst = new BinarySearchTree();
    treeGUI = new tree(rootLbl);

}

function insert(parent, dir, lbl) {
    if(parent == null) treeGUI.addLeaf(0, 'left', 30);
    else treeGUI.addLeaf(parent, dir, lbl);
}

function search() {

}

function remove() {
}

