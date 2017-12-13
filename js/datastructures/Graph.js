// Single-source weighted shortest-path algorithm

//const INFINITY = Number.MAX_VALUE;

function Graph() {
    this.vertexMap = new Object();
}

Graph.prototype.getVertex = function(vertexName) {
    var v = this.vertexMap[vertexName];
    if(v === undefined || v === null) {
        v = new Vertex(vertexName);
        this.vertexMap[vertexName] = v;
    }
    return v;
};

Graph.prototype.addEdge = function(sourceName, destName, cost) {
    var v = this.getVertex(sourceName);
    var w = this.getVertex(destName);
    v.adj.addLast(new Edge(w, cost));
};

Graph.prototype.clearAll = function() {
    for(var v in this.vertexMap) {
        this.vertexMap[v].reset();
    }
};

Graph.prototype.printPathInner = function(dest) {
    if(dest.prev !== null) {
        this.printPathInner(dest.prev);
        console.log(" to ");
    }
    console.log(dest.name);
};

Graph.prototype.printPath = function(destName) {
    var w = this.vertexMap[destName];
    if(w === null) {
        throw {name: "NoSuchElementException"};
    }
    else if(w.dist === INFINITY) {
        console.log(destName + " is unreachable");
    }
    else {
        console.log("(Cost is: " + w.dist + ") ");
        this.printPathInner(w);
    }
};

var commands = [];

Graph.prototype.getPathInner = function(dest, pathMap) {
    if (dest.prev !== null) {
        this.getPathInner(dest.prev, pathMap);
        commands.push({ name: "colorLine", data: { vertices: [dest.prev, dest], color: "#1ece21", line: 0 } });
    }
    pathMap[dest.name] = dest.dist;

    return pathMap;
};

Graph.prototype.getPath = function(destName) {
    var pathMap = new Object();
    var w = this.vertexMap[destName];
    if(w === null) {
        throw {name: "NoSuchElementException"};
    }
    else if(w.dist === INFINITY) {
        console.log(destName + " is unreachable");
    }
    else {
		pathMap = this.getPathInner(w, pathMap);
    }

    //Make sure the unit tests don't fail from a non-existing function
    if (typeof executeCommands === "function")
        executeCommands(commands);

    return pathMap;
};

Graph.prototype.dijkstra = function (startName) {
    commands.push({ name: "highlightLines", data: { lines: [0, 2, 3] } });
    var pq = new BinaryHeap();

	var start = this.vertexMap[startName];
	commands.push({ name: "updateVar", data: { name: "start", value: start.varString() } });
    if (start === undefined || start === null) {
        commands.push({ name: "highlightLines", data: { lines: [4] } });
        throw {name: "NoSuchElementException", message: "Start vertex not found"};
    }

    commands.push({ name: "highlightLines", data: { lines: [6, 7] } });

    this.clearAll();
    pq.add(new Path(start, 0));
	start.dist = 0;
	commands.push({ name: "updateVar", data: { name: "start", value: start.varString() } });

    commands.push({ name: "setCurrentCost", data: { line: 8, id: start.name, newCost: start.dist } });
    commands.push({ name: "highlightLines", data: { lines: [10] } });
	var nodesSeen = 0;
	commands.push({ name: "updateVar", data: { name: "nodesSeen", value: nodesSeen.toString() } });
    while (!pq.isEmpty() && nodesSeen < Object.keys(this.vertexMap).length) {
		commands.push({ name: "highlightLines", data: { lines: [11, 12] } });
		var vrec = pq.remove();
		console.log(vrec)
		commands.push({ name: "updateVar", data: { name: "vrec", value: vrec.varString() } });
		commands.push({ name: "highlightLines", data: { lines: [13] } });
		var v = vrec.dest;
		commands.push({ name: "updateVar", data: { name: "v", value: v.varString() } });
		commands.push({ name: "highlightLines", data: { lines: [14] } });
        if (v.scratch !== 0) { // already processed v
            commands.push({ name: "highlightLines", data: { lines: [15] } });
            continue;
        }

        commands.push({ name: "newNode", data: { vertex: v } });
        commands.push({ name: "updateMatrixCost", data: { id: v.name, newCost: v.dist } });

        commands.push({ name: "highlightLines", data: { lines: [17] } });
		v.scratch = 1;
		commands.push({ name: "updateVar", data: { name: "v", value: v.varString() } });
		commands.push({ name: "highlightLines", data: { lines: [18] } });
		nodesSeen++;
		commands.push({ name: "updateVar", data: { name: "nodesSeen", value: nodesSeen.toString() } });

		commands.push({ name: "highlightLines", data: { lines: [20] } });
        for (var itr = v.adj.iterator(0); itr.hasNext();) {
            var e = itr.next();
            var w = e.dest;
            var cvw = e.cost;

			if (w != v.prev) {
				commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#255eba", line: 21 } });
				commands.push({ name: "updateVar", data: { name: "e", value: e.varString() } });
			}
			commands.push({ name: "highlightLines", data: { lines: [22] } });
			commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
			commands.push({ name: "highlightLines", data: { lines: [23] } });
			commands.push({ name: "updateVar", data: { name: "cvw", value: cvw.toString() } });
			commands.push({ name: "highlightLines", data: { lines: [25] } });

            if (cvw < 0) {
                commands.push({ name: "highlightLines", data: { lines: [26] } });
                throw {name: "GraphException", message: "Graph has negative edges"};
            }

            commands.push({ name: "highlightLines", data: { lines: [29] } });
            if (w.dist > v.dist + cvw) {
                commands.push({ name: "setCurrentCost", data: { id: w.name, newCost: v.dist + cvw, line: 30 } });
				w.dist = v.dist + cvw;
				commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
				commands.push({ name: "highlightLines", data: { lines: [31] } });
				w.prev = v;
				commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
                pq.add(new Path(w, w.dist));
                commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#d8d10a", line: 32 } });
            }
            else {
                if (w != v.prev)
                    commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#cc181b", line: 33 } });
            }

            commands.push({ name: "updateMatrixCost", data: { id: w.name, newCost: w.dist } });

            if(!itr.hasNext())
                commands.push({ name: "highlightLines", data: { lines: [20] } });
        }
    }
};

Graph.prototype.negative = function (startName) { // also called the Bellman-Ford algorithm
    commands.push({ name: "highlightLines", data: { lines: [0] } });
    this.clearAll();

	commands.push({ name: "highlightLines", data: { lines: [2] } });
	var start = this.vertexMap[startName];
	commands.push({ name: "updateVar", data: { name: "start", value: start.varString() } });

	commands.push({ name: "highlightLines", data: { lines: [3] } });
    if (start == null) {
		commands.push({ name: "highlightLines", data: { lines: [4] } });
        throw {name: "NoSuchElementException", message: "Start vertex not found"};
    }
    commands.push({ name: "highlightLines", data: { lines: [7, 8] } });
    var q = new LinkedList();
    q.addLast(start);
    start.dist = 0;
	commands.push({ name: "setCurrentCost", data: { line: 9, id: start.name, newCost: start.dist } });
	commands.push({ name: "updateVar", data: { name: "start", value: start.varString() } });
    commands.push({ name: "highlightLines", data: { lines: [10] } });
	start.scratch++;
	commands.push({ name: "updateVar", data: { name: "start", value: start.varString() } });

    while (!q.isEmpty()) {
        commands.push({ name: "highlightLines", data: { lines: [12, 13] } });
		var v = q.removeFirst();
		commands.push({ name: "updateVar", data: { name: "v", value: v.varString() } });
		commands.push({ name: "highlightLines", data: { lines: [14] } });
		if (v.scratch++ > 2 * Object.keys(this.vertexMap).length) {
			commands.push({ name: "updateVar", data: { name: "v", value: v.varString() } });
            commands.push({ name: "highlightLines", data: { lines: [15] } });
            throw {name: "GraphException", message: "Negative cycle detected"};
		}
		commands.push({ name: "updateVar", data: { name: "v", value: v.varString() } });

        commands.push({ name: "newNode", data: { vertex: v } });
        commands.push({ name: "updateMatrixCost", data: { id: v.name, newCost: v.dist } });

        for (var itr = v.adj.iterator(0); itr.hasNext();) {
            commands.push({ name: "highlightLines", data: { lines: [18] } });

            var e = itr.next();
            var w = e.dest;
            var cvw = e.cost;

			if (w != v.prev) {
				commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#255eba", line: 19 } });
				commands.push({ name: "updateVar", data: { name: "e", value: e.varString() } });
			}

			commands.push({ name: "highlightLines", data: { lines: [20] } });
			commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
			commands.push({ name: "highlightLines", data: { lines: [21] } });
			commands.push({ name: "updateVar", data: { name: "cvw", value: cvw.toString() } });

			commands.push({ name: "highlightLines", data: { lines: [23] } });
            if (w.dist > v.dist + cvw) {
                w.dist = v.dist + cvw;
                w.prev = v;

				commands.push({ name: "setCurrentCost", data: { line: 24, id: w.name, newCost: w.dist } });
				commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
				commands.push({ name: "highlightLines", data: { lines: [25] } });
				commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });

				commands.push({ name: "highlightLines", data: { lines: [27] } });
				
                // Enqueue only if not already on the queue
				if (w.scratch++ % 2 === 0) {
					commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
                    commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#d8d10a", line: 28 } });
                    q.addLast(w);
				} else {
					commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
                    commands.push({ name: "highlightLines", data: { lines: [29, 30] } });
					w.scratch--; // undo the enqueue increment
					commands.push({ name: "updateVar", data: { name: "w", value: w.varString() } });
                }
            }
            else {
                if(w != v.prev)
                    commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#cc181b", line: 32 } });
            }
            commands.push({ name: "updateMatrixCost", data: { id: w.name, newCost: w.dist } });
        }
    }
};

