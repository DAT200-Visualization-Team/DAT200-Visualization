// Represents a vertex in the graph

const INFINITY = Number.MAX_VALUE;

function Vertex(name) {
    this.name = name;                   // Vertex name
    this.adj = new LinkedList();        // Adjacent vertices
    this.dist = INFINITY;               // Cost
    this.prev = null;                   // Previous vertex on shortest path
    this.scratch = 0;                   // Extra variable used in algorithm
}

Vertex.prototype.reset = function() {
    this.dist = Number.MAX_VALUE;
    this.prev = null;
    this.pos = null;
    this.scratch = 0;
};

Vertex.prototype.varString = function () {
	var prev = this.prev === null ? "null" : this.prev.name;
	return "Vertex: <br> &emsp; name: " + this.name + "<br> &emsp; adj: Linked List of neighbours <br> &emsp; dist: " + this.dist
		+ "<br> &emsp; prev: " + prev + "<br> &emsp; scratch: " + this.scratch;
};