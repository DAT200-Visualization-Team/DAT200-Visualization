function ExpressionTree() {
    this.inOrderResult = "";
}

ExpressionTree.prototype.isOperator = function (c) {
    var operators = ['+', '-', '*', '/', '^', '%']
    return operators.indexOf(c) !== -1;
};

ExpressionTree.prototype.inOrder = function (t, result) {

    if (t.left != null) this.inOrder(t.left, this.inOrderResult);
    this.inOrderResult += t.element + " ";
    if (t.right != null) this.inOrder(t.right, this.inOrderResult);

    return this.inOrderResult.trim();
};

ExpressionTree.prototype.constructTree = function (postfix) {
    var st = new Stack();
    var t, t1, t2;

    for (var i = 0; i < postfix.length; i++) {
        if (!this.isOperator(postfix[i])) {
            t = new BinaryNode(postfix[i]);
            st.push(t);
        }
        else {
            t = new BinaryNode(postfix[i]);

            t1 = st.pop();
            t2 = st.pop();

            t.right = t1;
            t.left = t2;

            st.push(t);
        }
    }

    t = st.pop();

    return t;
};