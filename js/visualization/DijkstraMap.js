var roads_data;
var graph;
var roads;
var intersections;
var selectedStartNode = undefined;
var selectedEndNode = undefined;
var panToOption = false; // TODO Should be set by a checkbox on GUI and should really be panning instead of snapping
var currentNode;

var startOpacity = 0;

var width = $("#graphics").width();
var height = $("#graphics").height();

var map;
var distances;
$.getJSON('js/geojson/output_roads_distance.json', function(json) {
    distances = json;
});

var proxyRoadStyle;
var newAnimation;

function togglePanning() {
	panToOption = !panToOption;
	$("#pan-icon").html(panToOption ? "gps_fixed" : "gps_not_fixed");
}

function initMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 58.9527835, lng:5.6761719},
        zoom: 15,
        disableDefaultUI: true,
        styles: [
            {
                featureType: "administrative",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },{
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ]
    });

    intersections = createMarkers(map);
    roads = createRoads(map);
}

function createMarkers(map) {
    var markers = [];
    $.getJSON('js/geojson/output_intersection_with_id_google.json', function(intersection_json) {
        for (var i = 0; i < intersection_json['features'].length; i++) {
            var data = intersection_json['features'][i];
            var latLng = new google.maps.LatLng(data['geometry']['coordinates'][1], data['geometry']['coordinates'][0]);

            // Creating a marker and putting it on the map
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                property: {
                    'id': data['properties']['id']
                },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeColor: 'blue',
                    // TODO make stroke change based on scale
                    //strokeWeight: 1,
                    fillOpacity: 1,
                    fillColor: 'white',
                    scale: 4,
                    clickable: true
                }
            });
            marker.addListener('click', function () {
             console.log("clicked on: " + this.property.id);
             selectNode(this)
             });
            markers.push(marker);
        }
    });
    return markers;
}

function createRoads(map) {
    var lines = [];
    $.getJSON('js/geojson/output_roads_google.json', function(road_json) {
        for (var i = 0; i < road_json['features'].length; i++) {
            var data = road_json['features'][i];

            var latLng = [];
            for (var j = 0; j < data['geometry']['coordinates'].length; j++) {
                latLng.push(new google.maps.LatLng(data['geometry']['coordinates'][j][1], data['geometry']['coordinates'][j][0]));
            }

            // Creating a marker and putting it on the map
            var line = new google.maps.Polyline({
                path: latLng,
                map: map,
                strokeOpacity: startOpacity,
                strokeColor: 'black'
            });
	        lines.push(line);
        }
    });

    return lines;
}

function selectNode(d) {
    var selectedNode = d.property.id;
    if(selectedStartNode == undefined && selectedNode != selectedEndNode) {
        selectedStartNode = selectedNode;
		colorNode(selectedNode, 'red');
    } else if(selectedEndNode == undefined && selectedNode != selectedStartNode) {
        selectedEndNode = selectedNode;
		colorNode(selectedNode, 'red');
    } else if(selectedStartNode == selectedNode) {
        selectedStartNode = undefined;
		colorNode(selectedNode, 'blue');
    } else if(selectedEndNode == selectedNode) {
        selectedEndNode = undefined;
		colorNode(selectedNode, 'blue');
    }
}

function colorNode(markerId, color) {
    intersections[markerId].setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: color,
            fillOpacity: 1,
            fillColor: 'white',
            scale: 4
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
    for (var i = 0; i < roads.length; i++) {
        roads[i].setOptions({
            strokeOpacity: startOpacity,
            strokeColor: 'black'
        });
    }
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

		commands.push({ name: "highlightNode", data: { vertex: v } });

        for (var itr = v.adj.iterator(0) ; itr.hasNext() ;) {
            var e = itr.next();
            var w = e.dest;
			var cvw = e.cost;

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
    var keys = Object.keys(distances);
    for (var i = 0; i < keys.length; i++) {
		var nodes = keys[i].split("_");
        graph.addEdge(nodes[0].slice(1), nodes[1].slice(1), distances[keys[i]]["distance"]);
        graph.addEdge(nodes[1].slice(1), nodes[0].slice(1), distances[keys[i]]["distance"]);
    }
}

function initProxy() {
    proxyRoadStyle = [];
    for (var i = 0; i < roads.length; i++) {
        proxyRoadStyle.push({
            strokeOpacity: 0.2,
            strokeColor: "black"
        });
    }
}

function performPathFinding(algorithm, start, end) {
    loadingSequence = [];
    initProxy();
    resetLinkColors();
    buildGraph();

    if (algorithm === 'bellmanford')
        graph.negative(start);
    else
        graph.dijkstrav2(start, end);

    graph.getPath(end);
}

function colorRoad(roadID) {
    if (panToOption) panToRoad(roadID);
    roads[roadID].setOptions({
        strokeOpacity: proxyRoadStyle[roadID].strokeOpacity,
        strokeColor: proxyRoadStyle[roadID].strokeColor
    });
}

function panToRoad(roadID) {
    var latlng = new google.maps.LatLng(roads[roadID].getPath().getAt(0).lat(), roads[roadID].getPath().getAt(0).lng());
	map.setCenter(latlng);
}

function addPathColorFrame(roadID, color, opacity) {
    appendAnimation(null, [{ e: proxyRoadStyle[roadID], p: { strokeColor: color, strokeOpacity: opacity, onUpdate: function() { colorRoad(roadID); } }, o: { duration: 1 } }], null);
}

function getLinkElement(a, b) {
    var link = distances['f' + a + '_t' + b];
    if (link == undefined) link = distances['f' + b + '_t' + a];
    return link['road_id'];
}

function colorCurrentNode(startColor, endColor) {
	appendAnimation(null, [{
		e: $("svg"), p: {
			onComplete: function (current, color) {
				colorNode(current, color);
			}, onReverseComplete: function (current, color) { colorNode(current, color); },
			onCompleteParams: [currentNode, endColor], onReverseCompleteParams:  [currentNode, startColor]
		}, o: { duration: 0 }
	}], null);
}

function executeCommands(commands) {
    for (var i = 0; i < commands.length; i++) {
        var data = commands[i].data;
        switch (commands[i].name) {
			case 'colorLine':
				var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                addPathColorFrame(path, data.color, 1);
				break;
			case 'highlightNode':
				var id = data.vertex.name;
				if (id != currentNode && id != selectedStartNode && id != selectedEndNode) {
					if (currentNode != null) {
						colorCurrentNode("green", "blue");
					}
					currentNode = id;
					console.log("Change current node");
					colorCurrentNode("white", "green");
				}
        }
    }
}
