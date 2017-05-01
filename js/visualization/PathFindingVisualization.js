var loadingSequence = [];
var graph;
var animationTime = 200;

var codeDisplayManager = new CodeDisplayManager('javascript', 'graph');
var currentAlgorithm;
var matrixColumns;
var finishedColumns;

var currentStartNode;

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
            $('#matrix-window').resizable({ handles: 'all', containment: 'document', minWidth: 200, minHeight: 200 });
            $('#matrix-window').draggable({ containment: 'document', handle: '#controls' });
            break;
        case '/bellmanford.html':
            codeDisplayManager.loadFunctions('bellmanford');
            codeDisplayManager.changeFunction('bellmanford');
            currentAlgorithm = 'bellmanford';
            $('#matrix-window').resizable({ handles: 'all', containment: 'document', minWidth: 200, minHeight: 200 });
            $('#matrix-window').draggable({ containment: 'document', handle: '#controls' });
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
    playAnimation();
}

function performCurrentPathfinding(start, end) {
    currentStartNode = start;
    $('#matrix-header, #matrix-body').empty();
    initializeHeader();
    performPathFinding(currentAlgorithm, start, end)
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

function changeCurrentCost(nodeId, newCost) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == nodeId)
            nodes[i].currentCost = newCost;
    }
    var currentLabel = d3.selectAll('.current-cost-label').filter(function (d) { return d.id == nodeId });
    return { e: $(currentLabel.node()), p: 'callout.flash', o: { complete: function () { currentLabel.text(newCost) } } };
}

function executeCommands(commands) {
    for (var i = 0; i < commands.length; i++) {
        var data = commands[i].data;
        switch (commands[i].name) {
            case 'colorCurrent':
                var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                if(path != null)
                    addPathColorFrame(path, lineColors.currentPath, animationTime);
                break;
            case 'colorPending':
                var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                if (path != null)
                    addPathColorFrame($(path), lineColors.pendingPath, animationTime);
                if ($('#matrix'))
                    updateNodeCell(data.vertices[1].name, data.vertices[1].cost);
                break;
            case 'colorSlow':
                var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                if (path != null)
                    addPathColorFrame(path, lineColors.slowPath, animationTime);
                break;
            case 'colorFast':
                var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                if (path != null)
                    addPathColorFrame(path, lineColors.fastPath, animationTime * 5);
                break;
            case 'highlightLines':
                loadingSequence = loadingSequence.concat(codeDisplayManager.getMultipleVelocityFrameHighlights(data.lines, animationTime));
                break;
            case 'setCurrentCost':
                loadingSequence.push(changeCurrentCost(data.id, data.newCost));
                break;
            case 'newNode':
                if ($('#matrix')) {
                    var current = data.vertex.name;
                    $('#current-row').children().each(function () {
                        if (this.innerHTML == '')
                            this.innerHTML = '\u221E';
                    });
                    setCellBorder(data.vertex.name, 'blue');
                    createNewRow(data.vertex.name);
                    console.log('new node', data.vertex.name);
                }
                break;
            case 'updateMatrixCost':
                if ($('matrix')) {
                    console.log('updating', data.id);
                    updateNodeCell(data.id, data.newCost);
                }
                break;
        }
    }
}

function toggleMatrixHiding() {
    $('#matrix-window').toggle(200);
}

function initializeHeader() {
    matrixColumns = [];
    finishedColumns = [];
    $('#matrix-header').append('<th>V</th>');
    nodes.forEach(function (node) {
        $('#matrix-header').append('<th>' + node.id + '</th>');
        matrixColumns.push(node.id);
    });
}

function createNewRow(label) {
    $('#current-row').attr('id', '');
    $('#matrix-body').append('<tr id="current-row"><td>' + label + '</td></tr>');

    matrixColumns.forEach(function (column) {
        $('#current-row').append('<td></td>');
    });
}

function findNodeCellFromId(nodeId) {
    var index = matrixColumns.indexOf(nodeId) + 1; // Add one to compensate for label
    if (index == -1) return null;
    return $('#current-row').children().eq(index);
}

function updateNodeCell(nodeId, newCost) {
    if(!(nodeId in finishedColumns))
        findNodeCellFromId(nodeId).text(newCost);
}

function setCellBorder(nodeId, color) {
    findNodeCellFromId(nodeId).css('border', '3px solid ' + color);
    finishedColumns.push(nodeId);
}