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