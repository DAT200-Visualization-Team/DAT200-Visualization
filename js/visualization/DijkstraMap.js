var roads_data;
var road_json;
var intersection_json;
var graph;
var roads;
var selectedStartNode = undefined;
var selectedEndNode = undefined;

var width = 960,
    height = 650;

//Book vars
var lineColors = {
    currentPath: '#255eba',
    pendingPath: '#d8d10a',
    slowPath: '#cc181b',
    fastPath: '#1ece21'
};

var loadingSequence = [];
var animationTime = 200;

// Hele Norge
//var projection = d3.geoMercator()
//    .center([18.0, 65.5])
//    .scale(1000)
//    .translate([width / 2, height / 2]);

var projection = d3.geoMercator()
    .center([5.698113, 58.936801])
    .scale(2000000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

var buildingLayer = svg.append("g");
var map = svg.append("g");
var intersectionLayer = svg.append("g");


var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

svg.call(zoom);

d3.json("js/geojson/output_roads.geojson", function(error, norway) {

    road_json = norway;

    roads = map.selectAll(".roads")
        .data(norway.features)
        .enter()
        .append("path")
        .attr("class", "roads")
        .attr("d", path)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    //buildGraph(roads._groups[0]);
    roads_data = roads._groups[0];
    //performPathFinding('dijkstra', 50, 49);
});

d3.json("js/geojson/output_intersection_with_id.geojson", function(error, intersections) {

    intersection_json = intersections;

    var intersectionsArr = intersectionLayer.selectAll(".intersection")
        .data(intersections.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "intersection")
        .on("click", selectNode);
});

//TODO the rest of the data to the map
d3.json("js/geojson/buildings.geojson", function(error, buildings) {

    var building_json = buildings;

    buildingLayer.selectAll(".building, .area, .grass")
        .data(buildings.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function(data) {
            if(data.properties.building != undefined) {
                return "building";
            } else if(data.properties.landuse == "grass" || data.properties.landuse == "forest")
            {
                return "grass";
            } else {
                return "area";
            }
        });
});

function selectNode(d) {
    var selectedNode = d.intersection_id;
    console.log(selectedStartNode);
    console.log(selectedEndNode);
    if(selectedStartNode == undefined && selectedNode != selectedEndNode) {
        markNode(selectedNode, 'start');
    } else if(selectedEndNode == undefined && selectedNode != selectedStartNode) {
        markNode(selectedNode, 'end');
    } else if(selectedStartNode == selectedNode) {
        unmarkNode('start')
    } else if(selectedEndNode == selectedNode) {
        unmarkNode('end')
    }
}

function markNode(nodeNr, nodeType) {
    console.log("mark " + nodeNr);
    if(nodeType == 'start') {
        selectedStartNode = nodeNr;
    } else {
        selectedEndNode = nodeNr;
    }
    intersectionLayer.selectAll(".intersection").filter(":nth-child(" + (nodeNr+1) + ")")
        .style('stroke', 'red');
}

function unmarkNode(node) {
    console.log("unmark " + node);
    if(node == 'start') {
        intersectionLayer.selectAll(".intersection").filter(":nth-child(" + (selectedStartNode+1) + ")")
            .style('stroke', 'blue');
        selectedStartNode = undefined;
    } else {
        intersectionLayer.selectAll(".intersection").filter(":nth-child(" + (selectedEndNode+1) + ")")
            .style('stroke', 'blue');
        selectedEndNode = undefined;
    }
}

function start() {
    if(selectedStartNode != undefined && selectedEndNode != undefined) {
        performPathFinding('dijkstra', selectedStartNode, selectedEndNode);
    } else {
        //TODO show error
    }

}

function zoomed() {
    //console.log(d3.event.transform);
    map.attr("transform", d3.event.transform);
    buildingLayer.attr("transform", d3.event.transform);
    intersectionLayer.attr("transform", d3.event.transform);

    map.selectAll(".roads")
        .style("stroke-width", 3/d3.event.transform.k);

    buildingLayer.selectAll(".building")
        .style("stroke-width", 2/d3.event.transform.k);

    //path.pointRadius(3/d3.event.transform.k);
}

//Book code
function resetLinkColors() {
    d3.selectAll('.roads')
    //.transition()
    //.duration(1000)
        .style('stroke', '#000000');
}

function getLink(linkNr) {
    return map.selectAll(".roads").filter(":nth-child(" + (linkNr+1) + ")")._groups[0][0];
}

Graph.prototype.dijkstrav2 = function (startName, endName) {
    commands.push({ name: "highlightLines", data: { lines: [0, 2, 3] } });
    var pq = new BinaryHeap();

    var start = this.vertexMap[startName];
    if (start === undefined || start === null) {
        commands.push({ name: "highlightLines", data: { lines: [4] } });
        throw {name: "NoSuchElementException", message: "Start vertex not found"};
    }

    commands.push({ name: "highlightLines", data: { lines: [6, 7] } });

    this.clearAll();
    pq.add(new Path(start, 0));
    start.dist = 0;

    commands.push({ name: "setCurrentCost", data: { line: 8, id: start.name, newCost: start.dist } });
    commands.push({ name: "highlightLines", data: { lines: [10] } });

    var nodesSeen = 0;
    while (!pq.isEmpty() && nodesSeen < Object.keys(this.vertexMap).length) {
        commands.push({ name: "highlightLines", data: { lines: [11, 12, 13, 14] } });
        var vrec = pq.remove();

        if(vrec.dest.name == endName) {
            nodesSeen = Object.keys(this.vertexMap).length;
            continue;
        }

        var v = vrec.dest;
        if (v.scratch !== 0) { // already processed v
            commands.push({ name: "highlightLines", data: { lines: [15] } });
            continue;
        }

        commands.push({ name: "newNode", data: { vertex: v } });
        commands.push({ name: "updateMatrixCost", data: { id: v.name, newCost: v.dist } });

        commands.push({ name: "highlightLines", data: { lines: [17, 18] } });
        v.scratch = 1;
        nodesSeen++;

        for (var itr = v.adj.iterator(0) ; itr.hasNext() ;) {
            commands.push({ name: "highlightLines", data: { lines: [20] } });
            var e = itr.next();
            var w = e.dest;
            var cvw = e.cost;

            if (w != v.prev)
                commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#255eba", line: 21 } });
            commands.push({ name: "highlightLines", data: { lines: [22, 23, 25] } });

            if (cvw < 0) {
                commands.push({ name: "highlightLines", data: { lines: [26] } });
                throw {name: "GraphException", message: "Graph has negative edges"};
            }

            commands.push({ name: "highlightLines", data: { lines: [29] } });
            if (w.dist > v.dist + cvw) {
                commands.push({ name: "setCurrentCost", data: { id: w.name, newCost: v.dist + cvw, line: 30 } });
                commands.push({ name: "highlightLines", data: { lines: [31] } });
                w.dist = v.dist + cvw;
                w.prev = v;
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

function buildGraph() {
    graph = new Graph();
    var links = roads_data;//roads.features;
    console.log(links);
    for (var i = 0; i < links.length; i++) {
        if(links[i].__data__.end_node == undefined || links[i].__data__.start_node == undefined) continue;
        graph.addEdge(links[i].__data__.end_node, links[i].__data__.start_node, links[i].getTotalLength());
        graph.addEdge(links[i].__data__.start_node, links[i].__data__.end_node, links[i].getTotalLength());
    }
    console.log("hei");
}

function performPathFinding(algorithm, start, end) {
    loadingSequence = [];
    resetLinkColors();
    buildGraph();

    if (algorithm === 'bellmanford')
        graph.negative(start);
    else
        graph.dijkstrav2(start, end);

    graph.getPath(end);
}

function addPathColorFrame(path, color, time) {
    loadingSequence.push({ e: path, p: { stroke: color }, o: { duration: time } });
}

function playAnimation() {
    console.log($(".roads").queue());
    $(".roads").velocity("stop", true);
    $(".roads").removeClass(".velocity-animating");
    $(document).clearQueue();

    resetLinkColors();
    $.Velocity.RunSequence(loadingSequence);
}

function getLinkElement(a, b) {
    if(a == undefined || b == undefined) return null;
    var intersectionAEdges = intersection_json.features[a].properties;

    for(var link in intersectionAEdges) {
        if (intersectionAEdges.hasOwnProperty(link)) {
            var currentEdge = road_json.features[intersectionAEdges[link]];
            if(currentEdge.start_node == b || currentEdge.end_node == b) {
                return getLink(intersectionAEdges[link]);
            }
        }
    }
    return null;
}

function executeCommands(commands) {
    for (var i = 0; i < commands.length; i++) {
        switch (commands[i].name) {
            case 'colorCurrent':
                var path = getLinkElement(commands[i].data.vertices[0].name, commands[i].data.vertices[1].name);
                if(path != null)
                    addPathColorFrame(path, lineColors.currentPath, animationTime);
                break;
            case 'colorPending':
                var path = getLinkElement(commands[i].data.vertices[0].name, commands[i].data.vertices[1].name);
                if (path != null)
                    addPathColorFrame($(path), lineColors.pendingPath, animationTime);
                break;
            case 'colorSlow':
                var path = getLinkElement(commands[i].data.vertices[0].name, commands[i].data.vertices[1].name);
                if (path != null)
                    addPathColorFrame(path, lineColors.slowPath, animationTime);
                break;
            case 'colorFast':
                var path = getLinkElement(commands[i].data.vertices[0].name, commands[i].data.vertices[1].name);
                if (path != null)
                    addPathColorFrame(path, lineColors.fastPath, animationTime * 5);
                break;
            case 'highlightLines':
                //loadingSequence = loadingSequence.concat(codeDisplayManager.getMultipleVelocityFrameHighlights(commands[i].data.lines, animationTime));
                break;
            case 'setVariable':

                break;
        }
    }
    playAnimation();
}
