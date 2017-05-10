var graph;

var codeDisplayManager = new CodeDisplayManager('javascript', 'graph');
var currentAlgorithm;
var matrixColumns;
var finishedColumns;
var lockedColumns;

var currentStartNode;

$(document).ready(function () {
    var location = window.location.pathname.split('/').slice(-1)[0];
    switch (location) {
        case 'dijkstra.html':
            codeDisplayManager.loadFunctions('dijkstra');
            codeDisplayManager.changeFunction('dijkstra');
            currentAlgorithm = 'dijkstra';
            $('#matrix-window').resizable({ handles: 'all', containment: 'document', minWidth: 200, minHeight: 200 });
            $('#matrix-window').draggable({ containment: 'document', handle: '#controls' });
            break;
        case 'bellmanford.html':
            codeDisplayManager.loadFunctions('bellmanford');
            codeDisplayManager.changeFunction('bellmanford');
            currentAlgorithm = 'bellmanford';
            $('#matrix-window').resizable({ handles: 'all', containment: 'document', minWidth: 200, minHeight: 200 });
            $('#matrix-window').draggable({ containment: 'document', handle: '#controls' });
            break;
    }
});

function performPathFinding(algorithm, start, end) {
    resetLinkColors();
    buildGraph();

    if (algorithm === 'bellmanford')
        graph.negative(start);
    else
        graph.dijkstra(start);

    graph.getPath(end);
}

function performCurrentPathfinding(start, end) {
    currentStartNode = start;
    $('#matrix-header, #matrix-body').empty();
    initializeHeader();
    resetAccumulativeCosts();
    performPathFinding(currentAlgorithm, start, end)
}

function addPathColorFrame(line, path, color) {
    appendAnimation(line, [{ e: path, p: { fill: color, stroke: color }, o: { duration: 1 } }], codeDisplayManager);
};

function resetLinkColors() {
    d3.selectAll('.link').transition().duration(1000).style('stroke', '#000000');
}

function resetAccumulativeCosts() {
    nodes.forEach(function (node) {
        node.currentCost = '\u221E';
    });
    restart();
}

function buildGraph() {
    graph = new Graph();
    for (var i = 0; i < links.length; i++) {
        if (links[i].left)
            graph.addEdge(links[i].target.id, links[i].source.id, parseInt(links[i].cost));
        if (links[i].right)
            graph.addEdge(links[i].source.id, links[i].target.id, parseInt(links[i].cost));
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

function changeCurrentCost(line, nodeId, newCost) {
    var oldCost;

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == nodeId) {
            oldCost = nodes[i].currentCost;
            nodes[i].currentCost = newCost;
        }
    }
    var currentLabel = d3.selectAll('.current-cost-label').filter(function (d) { return d.id == nodeId });
    appendAnimation(line, [{
        e: currentLabel.node,
        p: {
            fill: 'green', yoyo: true,
            onComplete: function () { currentLabel.text(newCost); },
            onReverseComplete: function () { currentLabel.text(oldCost); }
        }, o: { duration: 1 }
    }], codeDisplayManager)
}

function executeCommands(commands) {
    for (var i = 0; i < commands.length; i++) {
        var data = commands[i].data;
        switch (commands[i].name) {
            case 'colorLine':
                var path = getLinkElement(data.vertices[0].name, data.vertices[1].name);
                if(path != null)
                    addPathColorFrame(data.line, path, data.color);
                break;
            case 'highlightLines':
                appendCodeLines(data.lines, codeDisplayManager);
                break;
            case 'setCurrentCost':
                changeCurrentCost(data.line, data.id, data.newCost);
                break;
            case 'newNode':
                if ($('#matrix')) {
                    createNewRow(data.vertex.name);
                    setCellBorder(data.vertex.name, 'blue');

                    lockedColumns = finishedColumns.slice();
                    finishedColumns.push(data.vertex.name);

                    fillInAllOldValues();

                    nodes.forEach(function (node) {
                        if (!(node.id in finishedColumns)) {
                            var cell = findNodeCellFromId(node.id);
                            if(cell.html() == '')
                                cell.html('\u221E');
                        }
                        else {
                            if (node.id == data.vertex.name)
                                findNodeCellFromId(node.id).html('');
                        }
                    });
                    
                    updateNodeCell(data.vertex.name, data.vertex.dist);
                }
                break;
            case 'updateMatrixCost':
                if ($('matrix')) {
                    insertPreviousValueIfExists(data.id);
                    if (!(data.id in lockedColumns)) {
                        updateNodeCell(data.id, data.newCost);
                    }
                }
                break;
        }
    }
}

function insertPreviousValueIfExists(nodeId) {
    var previousValue = findPreviousValue(nodeId);

    if (previousValue != null && previousValue != '' && previousValue != '\u221E')
        findNodeCellFromId(nodeId).html(previousValue);
}

function fillInAllOldValues() {
    matrixColumns.forEach(function (id) {
        if (!(id in finishedColumns)) {
            var cell = findNodeCellFromId(id);
            var content = cell.html();
            var prevValue = findPreviousValue(id);
            if ((prevValue != null && prevValue != '' && prevValue != '\u221E') && (content == '' || content == '\u221E')) {
                insertPreviousValueIfExists(id);
            }
        }
    });
}

function toggleMatrixHiding() {
    $('#matrix-window').toggle(200);
}

function initializeHeader() {
    matrixColumns = [];
    finishedColumns = [];
    lockedColumns = [];
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

function findPreviousValue(nodeId) {
    var colIndex = matrixColumns.indexOf(nodeId) + 1;
    var newestNumber = null;
    $('#current-row').parent().children().each(function (rowIndex) {
        $(this).find('td').each(function (cellIndex) {
            if (colIndex == cellIndex) {
                if (!isNaN(parseInt($(this).html())))
                    newestNumber = $(this).html();
            }
        });
    });
    return newestNumber;
}

function findNodeCellFromId(nodeId) {
    var index = matrixColumns.indexOf(nodeId) + 1; // Add one to compensate for label
    return $('#current-row').children().eq(index);
}

function updateNodeCell(nodeId, newCost) {
    findNodeCellFromId(nodeId).text(newCost);
}

function setCellBorder(nodeId, color) {
    findNodeCellFromId(nodeId).css('border', '3px solid ' + color);
}
