var roads_data;
var road_json;
var intersection_json;
var graph;
var roads;
var selectedStartNode = undefined;
var selectedEndNode = undefined;

var width = $('#graphics').width(),
    height = $('#graphics').height();

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 58.9527835, lng:5.6761719},
        zoom: 15,
        disableDefaultUI: true
    });

    map.data.setStyle({
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: 'red',
            // TODO make stroke change based on scale
            //strokeWeight: 1,
            fillOpacity: 1,
            fillColor: 'white',
            scale: 4
        }
    });

    map.data.loadGeoJson('js/geojson/output_intersection_with_id_google.json');
    
    map.data.addListener('click', function (event) {
       console.log("clicked on: " + event.feature.getProperty('id'));
       selectNode(event)
    });
}

/*d3.json("js/geojson/output_roads.json", function(error, norway) {

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
});*/

function selectNode(d) {
    var selectedNode = d.feature.getProperty('id');
    if(selectedStartNode == undefined && selectedNode != selectedEndNode) {
        selectedStartNode = selectedNode;
        colorNode(d, 'blue');
    } else if(selectedEndNode == undefined && selectedNode != selectedStartNode) {
        selectedEndNode = selectedNode;
        colorNode(d, 'blue');
    } else if(selectedStartNode == selectedNode) {
        selectedStartNode = undefined;
        colorNode(d, 'red');
    } else if(selectedEndNode == selectedNode) {
        selectedEndNode = undefined;
        colorNode(d, 'red');
    }
}

function colorNode(event, color) {
    map.data.overrideStyle(event.feature, {
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: color,
            // TODO make stroke change based on scale
            //strokeWeight: 1,
            fillOpacity: 1,
            fillColor: 'white',
            scale: 4
        }
    });
}

function start() {
    if(selectedStartNode != undefined && selectedEndNode != undefined) {
        performPathFinding('dijkstra', selectedStartNode, selectedEndNode);
    } else {
        alert("Two points need to be selected.");
    }
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
