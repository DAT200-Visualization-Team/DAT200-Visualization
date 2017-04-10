var animationTime = 1000;
var bt;

function initialize() {
    bt = new BinaryTree(tree.vis[0].v);
    setChildren(bt.getRoot());

    function setChildren(binaryNode) {
        var child;
        tree.vis.forEach(function(i) {
            if(i.f.v === binaryNode.element) {
                if(i.d == 'left') child = binaryNode.setLeft(new BinaryNode(i.v));
                else child = binaryNode.setRight(new BinaryNode(i.v));
                setChildren(child);
            }
        });
    }
}