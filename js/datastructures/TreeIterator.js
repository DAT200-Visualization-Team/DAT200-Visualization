function TreeIterator(theTree) {
    this.t = theTree;
    this.current = null;
}

TreeIterator.prototype.isValid = function () {
    return this.current != null;
};

TreeIterator.prototype.retrieve = function () {
    if (this.current == null)
        throw { name: "NoSuchElementException", message: "The element does not exist" };
    return this.current.getElement();
};

TreeIterator.prototype.postOrderIterator = function () {
    var treeIterator = this;
    var s = new Stack();
    s.push(this.t.root);

    return {
        first: function () {
            s.makeEmpty();
            if (treeIterator.t.root != null) {
                s.push(new StNode(treeIterator.t.getRoot()));
                this.advance();
            }
        },

        advance: function () {
            if (s.isEmpty()) {
                if (treeIterator.current == null)
                    throw { name: "NoSuchElementException", message: "The element does not exist" };
                treeIterator.current = null;
                return;
            }

            var cnode;
            for (; ;) {
                cnode = s.pop();

                if (++cnode.timesPopped == 3) {
                    treeIterator.current = cnode.node;
                    return;
                }

                s.push(cnode);
                if (cnode.timesPopped == 1) {
                    if (cnode.node.getLeft() != null)
                        s.push(new StNode(cnode.node.getLeft()));
                }
                else { // cnode.timesPopped == 2
                    if (cnode.node.getRight() != null)
                        s.push(new StNode(cnode.node.getRight()));
                }
            }
        }
    };
};

TreeIterator.prototype.inOrderIterator = function () {
    var treeIterator = this;
    var s = new Stack();
    s.push(this.t.root);

    return {
        first: function () {
            s.makeEmpty();
            if (treeIterator.t.getRoot() != null) {
                s.push(new StNode(treeIterator.t.getRoot()));
                this.advance();
            }
        },

        advance: function () {
            if (s.isEmpty()) {
                if (treeIterator.current == null)
                    throw { name: "NoSuchElementException", message: "The element does not exist" };
                treeIterator.current = null;
                return;
            }

            var cnode;
            for (; ;) {
                cnode = s.pop();

                if (++cnode.timesPopped == 2) {
                    treeIterator.current = cnode.node;
                    if (cnode.node.getRight() != null)
                        s.push(new StNode(cnode.node.getRight()));
                    return;
                }
                // First time through
                s.push(cnode);
                if (cnode.node.getLeft() != null)
                    s.push(new StNode(cnode.node.getLeft()));
            }
        }
    };
};

TreeIterator.prototype.preOrderIterator = function () {
    var treeIterator = this;
    var s = new Stack();
    s.push(new StNode(this.t.root));

    return {
        first: function() {
            s.makeEmpty();
            if (treeIterator.t.getRoot() != null) {
                s.push(treeIterator.t.getRoot());
                this.advance();
            }
        },

        advance: function () {
            if (s.isEmpty()) {
                if (treeIterator.current == null)
                    throw { name: "NoSuchElementException", message: "The element does not exist" };
                treeIterator.current = null;
                return;
            }

            treeIterator.current = s.pop();

            if (treeIterator.current.getRight() != null)
                s.push(treeIterator.current.getRight());
            if (treeIterator.current.getLeft() != null)
                s.push(treeIterator.current.getLeft());
        }
    };
};

TreeIterator.prototype.levelOrderIterator = function () {
    var treeIterator = this;
    var q = new Queue();
    q.enqueue(this.t.root);

    return {
        first: function () {
            q.makeEmpty();
            if (treeIterator.t.getRoot() != null) {
                q.enqueue(treeIterator.t.getRoot());
                this.advance();
            }
        },

        advance: function () {
            if (q.isEmpty()) {
                if (treeIterator.current == null)
                    throw { name: "NoSuchElementException", message: "The element does not exist" };
                treeIterator.current = null;
                return;
            }

            treeIterator.current = q.dequeue();

            if (treeIterator.current.getLeft() != null)
                q.enqueue(treeIterator.current.getLeft());
            if (treeIterator.current.getRight() != null)
                q.enqueue(treeIterator.current.getRight());
        }
    };
};

function StNode(n) {
    this.node = n;
    this.timesPopped = 0;
}