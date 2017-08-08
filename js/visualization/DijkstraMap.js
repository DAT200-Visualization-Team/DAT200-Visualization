var roads_data;
var road_json;
var intersection_json;
var graph;
var roads;
var selectedStartNode = undefined;
var selectedEndNode = undefined;

var width = $('#graphics').width(),
    height = $('#graphics').height();

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

d3.json("js/geojson/output_roads.json", function(error, norway) {

    road_json = norway;

    roads = map.selectAll(".roads")
        .data(norway.features)
        .enter()
        .append("path")
        .attr("class", "roads")
        .attr("d", path)
        .attr("stroke", "blue")
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("id", function(d) { return d.start_node + "_" + d.end_node; });

    roads_data = roads._groups[0];
});

d3.json("js/geojson/output_intersection_with_id.json", function(error, intersections) {

    intersection_json = intersections;

    var intersectionsArr = intersectionLayer.selectAll(".intersection")
        .data(intersections.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "intersection")
        .on("click", selectNode);
});

d3.json("js/geojson/buildings.json", function(error, buildings) {

    console.log(buildings);
    var building_json = buildings;

    buildingLayer.selectAll(".building, .area, .grass")
        .data(buildings.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function(data) {
            if(data.properties.fclass != undefined) {
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
        alert("Two points need to be selected.");
    }

}

function zoomed() {
    map.attr("transform", d3.event.transform);
    buildingLayer.attr("transform", d3.event.transform);
    intersectionLayer.attr("transform", d3.event.transform);

    map.selectAll(".roads")
        .style("stroke-width", 3/d3.event.transform.k);

    buildingLayer.selectAll(".building")
        .style("stroke-width", 2/d3.event.transform.k);
}

function resetLinkColors() {
    d3.selectAll('.roads')
        .style('stroke', '#000000');
}

function getLink(linkNr) {
    return map.selectAll(".roads").filter(":nth-child(" + (linkNr+1) + ")")._groups[0][0];
}

Graph.prototype.dijkstrav2 = function (startName, endName) {
    var pq = new BinaryHeap();

    var start = this.vertexMap[startName];
    if (start === undefined || start === null) {
        throw {name: "NoSuchElementException", message: "Start vertex not found"};
    }

    this.clearAll();
    pq.add(new Path(start, 0));
    start.dist = 0;

    var nodesSeen = 0;
    while (!pq.isEmpty() && nodesSeen < Object.keys(this.vertexMap).length) {
        var vrec = pq.remove();

        if(vrec.dest.name == endName) {
            nodesSeen = Object.keys(this.vertexMap).length;
            break;
        }

        var v = vrec.dest;
        if (v.scratch !== 0) { // already processed v
            continue;
        }

        v.scratch = 1;
        nodesSeen++;

        for (var itr = v.adj.iterator(0) ; itr.hasNext() ;) {
            var e = itr.next();
            var w = e.dest;
            var cvw = e.cost;

            if (w != v.prev)
                commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#255eba"} });

            if (cvw < 0) {
                throw {name: "GraphException", message: "Graph has negative edges"};
            }

            if (w.dist > v.dist + cvw) {
                w.dist = v.dist + cvw;
                w.prev = v;
                pq.add(new Path(w, w.dist));
                commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#EBCA10" } });
                if (w.name == endName) {
                    return;
                }
            }
            else {
                if (w != v.prev)
                    commands.push({ name: "colorLine", data: { vertices: [v, w], color: "#cc181b"} });
            }
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

function addPathColorFrame(path, color) {
    appendAnimation(null, [{ e: path, p: { stroke: color }, o: { duration: 1 } }], null);
    //TODO add intersection highlighting
}

function getLinkElement2(a, b) {
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

function getLinkElement(a, b) {
    var link = $("#" + a + "_" + b);
    if(link.length == 0) link = $("#" + b + "_" + a);
    console.log(link);
    return link;
}

function executeCommands(commands) {
    for (var i = 0; i < commands.length; i++) {
        var data = commands[i].data;
        switch (commands[i].name) {
            case 'colorLine':
                console.log(data);
                var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                if(path != null)
                    addPathColorFrame(path, data.color);
                break;
        }
    }
}
