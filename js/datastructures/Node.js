function Node(dat, p, n) {
    this.data = dat;
    this.prev = p;
    this.next = n;
}

Node.prototype.varString = function (prevDir) {
    var prev = "null";
    var next = "null";
    if (this.prev != null) prev = this.prev.data;
    if (this.next != null) next = this.next.data;
    return "Node: <br> &emsp; data: " + this.data + "<br> &emsp; prev: " + prev + "<br> &emsp; next: " + next;
};