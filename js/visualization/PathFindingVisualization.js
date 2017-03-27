var loadingSequence = [];
var graph;
var animationTime = 200;

var codeDisplayManager = new CodeDisplayManager('javascript', 'graph');
var currentAlgorithm;

var lineColors = {
    currentPath: '#255eba',
    pendingPath: '#d8d10a',
    slowPath: '#cc181b',
    fastPath: '#1ece21',
}

$(document).ready(function () {
    switch (window.location.pathname) {
        case '/dijkstra.html':
            codeDisplayManager.loadFunctions('dijkstra');
            codeDisplayManager.changeFunction('dijkstra');
            currentAlgorithm = 'dijkstra';
            break;
        case '/bellmanford.html':
            codeDisplayManager.loadFunctions('bellmanford');
            codeDisplayManager.changeFunction('bellmanford');
            currentAlgorithm = 'bellmanford';
            break;
    }
});

function performPathFinding(algorithm, start, end) {
    loadingSequence = [];
    resetLinkColors();
    buildGraph();

    if (algorithm === 'bellmanford')
        graph.negative(start);
    else
        graph.dijkstra(start);

    graph.getPath(end);
}

function addPathColorFrame(path, color, time) {
    loadingSequence.push({ e: path, p: { fill: color, stroke: color }, o: { duration: time } });
};

function resetLinkColors() {
    d3.selectAll('.link').transition().duration(1000).style('stroke', '#000000');
}

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
    var link = links.filter(function (l) {
        return (l.source.id == a && l.target.id == b) || (l.source.id == b && l.target.id == a);
    });

    if(link != null)
        return $(('#linkpath' + link[0].index));
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
                loadingSequence = loadingSequence.concat(codeDisplayManager.getMultipleVelocityFrameHighlights(commands[i].data.lines, animationTime));
                break;
            case 'setVariable':

                break;
        }
    }
    playAnimation();
}

$('#download-button, #download-button-mobile').on('click', function () {
    var graph = {};
    graph.nodes = nodes;
    graph.links = links;
    downloadObjectJson(graph, 'graph');
});

function processUploadedObject(object) {
    nodes = object.graph.nodes;
    links = object.graph.links;
    restart()
}