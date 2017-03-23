var loadingSequence = [];
var graph;

var lineColors = {
    currentPath: '#1ece21',
    pendingPath: '#d8d10a',
    slowPath: '#cc181b'
}

function addPathColorFrame(path, color, time) {
    loadingSequence.push([{ e: path, p: { fill: color, stroke: color }, o: { duration: time } }]);
};

function playAnimation() {
    $.Velocity.RunSequence(loadingSequence);
}

function buildGraph() {
    graph = new Graph();
    for (var i = 0; i < links.length; i++) {
        if (links[i].left)
            graph.addEdge(links[i].target.id, links[i].source.id, links[i].cost);
        if (links[i].right)
            graph.addEdge(links[i].source.id, links[i].target.id, links[i].cost);
    }
}

function getLinkElement(a, b) {
    return links.filter(function (l) {
        return (l.source.id == a && l.target.id == b) || (l.source.id == b && l.target.id == a);
    });
}

function clearSequence() {
    loadingSequence = [];
}

$('#download-button, #download-button-mobile').on('click', function () {
    var dijkstra = {};
    dijkstra.nodes = nodes;
    dijkstra.links = links;
    downloadObjectJson(dijkstra, 'dijkstra');
});

function processUploadedObject(object) {
    nodes = object.dijkstra.nodes;
    links = object.dijkstra.links;
    restart()
}