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

Graph.prototype.getPathInner = function(dest, pathMap) {
    if(dest.prev !== null) {
        this.getPathInner(dest.prev, pathMap);
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
        var pathMap = this.getPathInner(w, pathMap);
    }
    return pathMap;
};

Graph.prototype.dijkstra = function (startName) {
    var commands = [];
    commands.push({ name: "highlightLines", data: {lines: [0, 2, 3]} })
    var pq = new BinaryHeap();

    var start = this.vertexMap[startName];
    if (start === undefined || start === null) {
        commands.push({ name: "highlightLines", data: { lines: [4] } })
        throw {name: "NoSuchElementException", message: "Start vertex not found"};
    }
    commands.push({ name: "highlightLines", data: { lines: [6, 7, 8, 10] } });
    this.clearAll();
    pq.add(new Path(start, 0));
    start.dist = 0;

    var nodesSeen = 0;
    while (!pq.isEmpty() && nodesSeen < Object.keys(this.vertexMap).length) {
        commands.push({ name: "highlightLines", data: { lines: [11, 12, 13, 14] } });
        var vrec = pq.remove();
        var v = vrec.dest;
        if (v.scratch !== 0) { // already processed v
            commands.push({ name: "highlightLines", data: { lines: [15] } });
            continue;
        }
        commands.push({ name: "highlightLines", data: { lines: [17, 18] } });
        v.scratch = 1;
        nodesSeen++;

        for (var itr = v.adj.iterator(0) ; itr.hasNext() ;) {
            commands.push({ name: "highlightLines", data: { lines: [20, 21, 22, 23, 25] } });
            var e = itr.next();
            var w = e.dest;
            var cvw = e.cost;
            commands.push({ name: "colorCurrent", data: { vertices: [v, w]} });

            if (cvw < 0) {
                commands.push({ name: "highlightLines", data: { lines: [26] } });
                throw {name: "GraphException", message: "Graph has negative edges"};
            }

            commands.push({ name: "highlightLines", data: { lines: [29] } });
            if (w.dist > v.dist + cvw) {
                commands.push({ name: "highlightLines", data: { lines: [30, 31, 32] } });
                w.dist = v.dist + cvw;
                w.prev = v;
                pq.add(new Path(w, w.dist));
                commands.push({ name: "colorPending", data: { vertices: [v, w] } });
            }
            else {
                commands.push({ name: "colorSlow", data: { vertices: [v, w], totalCost: v.dist + cvw } });
            }

            if(!itr.hasNext())
                commands.push({ name: "highlightLines", data: { lines: [20] } });
        }
    }

    //Make sure the unit tests don't fail from a non-existing function
    if(typeof executeCommands == "function")
        executeCommands(commands);
};

Graph.prototype.negative = function(startName) { // also called the Bellman-Ford algorithm
    this.clearAll();

    var start = this.vertexMap[startName];
    if(start === undefined || null) {
        throw {name: "NoSuchElementException", message: "Start vertex not found"};
    }

    var q = new LinkedList();
    q.addLast(start);
    start.dist = 0;
    start.scratch++;

    while(!q.isEmpty()) {
        var v = q.removeFirst();
        if(v.scratch++ > 2 * Object.keys(this.vertexMap).length) {
            //throw {name: "GraphException", message: "Negative cycle detected"};
            throw new Error("Negative cycle detected");
        }

        for(var itr = v.adj.iterator(0); itr.hasNext(); ) {
            var e = itr.next();
            var w = e.dest;
            var cvw = e.cost;

            if(w.dist > v.dist + cvw) {
                w.dist = v.dist + cvw;
                w.prev = v;
                // Enqueue only if not already on the queue
                if(w.scratch++ % 2 === 0) {
                    q.addLast(w);
                } else {
                    w.scratch--; // undo the enqueue increment
                }
            }
        }
    }
};

