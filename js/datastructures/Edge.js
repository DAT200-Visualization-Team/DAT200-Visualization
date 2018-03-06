function Edge(d, c) {
    this.dest = d;
    this.cost = c;
}

Edge.prototype.varString = function () {
	return "Edge: <br> &emsp; dest: " + this.dest.name + "<br> &emsp; cost: " + this.cost;
};