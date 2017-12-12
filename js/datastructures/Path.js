// Represents an entry in the priority queue for Dijkstra's algorithm.

function Path(dest, cost) {
    this.dest = dest;
    this.cost = cost;
}

Path.prototype.compareTo = function (rhs) {
	var otherCost = rhs.cost;
	return this.cost < otherCost ? - 1 : this.cost > otherCost ? 1 : 0;
};

Path.prototype.varString = function () {
	return "Path: <br> &emsp; dest: " + this.dest.name + "<br> &emsp; cost: " + this.cost;
};