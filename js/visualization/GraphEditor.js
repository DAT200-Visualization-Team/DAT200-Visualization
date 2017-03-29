// set up SVG for D3
var width = $('#graphics').width(),
    height = $('#graphics').height(),
    colors = d3.scaleOrdinal(d3.schemeCategory10);;

var svg = d3.select('#graphics')
  .append('svg')
  .attr('oncontextmenu', 'return false;')
  .attr('width', width)
  .attr('height', height)
  .attr('text-rendering', 'optimizeLegibility');

$('#graphics').resize(function () {
    width = $('#graphics').width();
    height = $('#graphics').height();
    svg.attr('width', width);
    svg.attr('height', height);
    force.force('center', d3.forceCenter(width / 2, height / 2))
    force.alpha(0.02).restart();
});

// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
var nodes = [],
  lastNodeId = 2,
  links = [];

function processUploadedObject(object) {
    mapNodeReferences(object.graphdata.nodes, object.graphdata.links);
    restart();
}

var force = d3.forceSimulation()
    .nodes(nodes)
    .force('link', d3.forceLink(links).id(function (d) { return d.id; }).distance(150).strength(1))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(function (d) { return d.r; }).iterations(16))
    .force('y', d3.forceY(0))
    .force('x', d3.forceX(0))
    .on('tick', tick);

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
  .attr('class', 'link dragline hidden')
  .attr('d', 'M0,0L0,0');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    linklabels = svg.append('svg:g').selectAll('text'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null,
    selected_label = null;

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
    if (nodes == null || nodes.length == 0) return;

    // draw directed edges with proper padding from node centers
    path.attr('d', function (d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 17 : 12,
            targetPadding = d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return 'M ' + sourceX + ',' + sourceY + 'L ' + targetX + ',' + targetY;
    });

    circle.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });

    if (linklabels != null) {
        linklabels.attr('transform', function (d, i) {
            if (d.target.x < d.source.x) {
                bbox = this.getBBox();
                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    }
}

// update graph (called when needed)
function restart() {
    // path (link) group
    path = path.data(links);

    // update existing links
    path.classed('selected', function (d) { return d === selected_link; })
      .style('marker-start', function (d) { return d.left ? 'url(#start-arrow)' : ''; })
      .style('marker-end', function (d) { return d.right ? 'url(#end-arrow)' : ''; });

    // add new links
    var p = path.enter().append('svg:path')
      .attr('class', 'link')
      .attr('id', function (d, i) { return 'linkpath' + i })
      .classed('selected', function (d) { return d === selected_link; })
      .style('marker-start', function (d) { return d.left ? 'url(#start-arrow)' : ''; })
      .style('marker-end', function (d) { return d.right ? 'url(#end-arrow)' : ''; })
      .on('mousedown', function (d) {
          if (d3.event.ctrlKey) return;

          // select link
          mousedown_link = d;
          if (mousedown_link === selected_link) selected_link = null;
          else selected_link = mousedown_link;
          selected_node = null;
          restart();
      });

    // remove old links
    path.exit().remove();

    path = path.merge(p);

    // linklabels (link) group
    linklabels = linklabels.data(links);

    // add new link labels
    var l = linklabels.enter().append('text')
        .style('pointer-events', 'all')
        .style('font-size', '30px')
        .style('fill', '#b72121')
        .style('alignment-baseline', 'baseline')
        .style('dominant-baseline', 'baseline')
        .append('textPath')
            .attr('startOffset', '50%')
            .attr('href', function (d, i) { return '#linkpath' + i })
            .style('pointer-events', 'all')
            .style('text-anchor', 'middle')
            .style('alignment-baseline', 'baseline')
            .style('dominant-baseline', 'baseline')
            .text(function (d, i) { return d.cost })
            .on('mousedown', function (d) {
                if (selected_label != null) return;

                var windowPosition = d3.mouse(this);
                selected_label = d;

                windowPosition[0] += 50;
                windowPosition[1] += 50;

                var container = d3.select('body')
                    .append('div')
                    .attr('id', 'inputcontainer')
                    .style('position', 'absolute')
                    .style('left', windowPosition[0] + 'px')
                    .style('top', windowPosition[1] + 'px')
                    .style('width', '100px')
                    .append('form');

                container.append('input')
                    .attr('id', 'costinput')
                    .attr('type', 'text')
                    .attr('autofocus');

                container.append('input')
                    .attr('type', 'submit')
                    .style('display', 'none');

                container.on('submit', function () {
                    d3.event.preventDefault();
                    var value = d3.select('#costinput').property('value');

                    if (isNaN(value) || !/\S/.test(value)) {
                        window.alert('The cost can only be a number');
                    }
                    else {
                        d.cost = value;
                        restart();
                    }

                    selected_label = null;
                    d3.select('#inputcontainer').remove();
                });
            })
            .on('mouseup', function () {
                d3.select('#costinput').node().focus();
            });

    //Update cost
    linklabels.text(function (d) { return d.cost });

    // remove old link labels
    linklabels.exit().remove();

    linklabels = linklabels.merge(l);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, function (d) { return d.id; });

    // update existing nodes (reflexive & selected visual states)
    circle.selectAll('circle')
      .style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
      .classed('reflexive', function (d) { return d.reflexive; });

    // add new nodes
    var g = circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
      .style('stroke', function (d) { return d3.rgb(colors(d.id)).darker().toString(); })
      .classed('reflexive', function (d) { return d.reflexive; })
      .on('mouseover', function (d) {
          if (!mousedown_node || d === mousedown_node) return;
          // enlarge target node
          d3.select(this).attr('transform', 'scale(1.1)');
      })
      .on('mouseout', function (d) {
          if (!mousedown_node || d === mousedown_node) return;
          // unenlarge target node
          d3.select(this).attr('transform', '');
      })
      .on('mousedown', function (d) {
          if (d3.event.ctrlKey) return;

          // select node
          mousedown_node = d;
          if (mousedown_node === selected_node) selected_node = null;
          else selected_node = mousedown_node;
          selected_link = null;

          // reposition drag line
          drag_line
            .style('marker-end', 'url(#end-arrow)')
            .classed('hidden', false)
            .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

          restart();
      })
      .on('mouseup', function (d) {
          if (!mousedown_node) return;

          // needed by FF
          drag_line
            .classed('hidden', true)
            .style('marker-end', '');

          // check for drag-to-self
          mouseup_node = d;
          if (mouseup_node === mousedown_node) { resetMouseVars(); return; }

          // unenlarge target node
          d3.select(this).attr('transform', '');

          // add link to graph (update if exists)
          // NB: links are strictly source < target; arrows separately specified by booleans
          var source, target, direction;
          if (mousedown_node.id < mouseup_node.id) {
              source = mousedown_node;
              target = mouseup_node;
              direction = 'right';
          } else {
              source = mouseup_node;
              target = mousedown_node;
              direction = 'left';
          }

          var link;
          link = links.filter(function (l) {
              return (l.source === source && l.target === target);
          })[0];

          if (link) {
              link[direction] = true;
          } else {
              link = { source: source, target: target, left: false, right: false, cost: Math.floor(Math.random() * 10 + 1) };
              link[direction] = true;
              links.push(link);
          }

          // select new link
          selected_link = link;
          selected_node = null;

          restart();
      });

    // show node IDs
    g.append('svg:text')
        .attr('x', 0)
        .attr('y', 4)
        .attr('class', 'id')
        .text(function (d) { return d.id; });

    // remove old nodes
    circle.exit().remove();
    circle = circle.merge(g);

    force.nodes(nodes);
    force.force('link').links(links);

    // set the graph in motion
    force.alpha(0.02).restart();
}

function mousedown() {
    // prevent I-bar on drag
    //d3.event.preventDefault();

    // because :active only works in WebKit?
    svg.classed('active', true);

    if (d3.event.ctrlKey || mousedown_node || mousedown_link || selected_label != null) return;

    // insert new node at point
    var point = d3.mouse(this),
        node = { id: ++lastNodeId, reflexive: false };
    node.x = point[0];
    node.y = point[1];
    nodes.push(node);

    restart();
}

function mousemove() {
    if (!mousedown_node) return;

    // update drag line
    drag_line.attr('d', 'M ' + mousedown_node.x + ',' + mousedown_node.y + 'L ' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

    restart();
}

function mouseup() {
    if (mousedown_node) {
        // hide drag line
        drag_line
          .classed('hidden', true)
          .style('marker-end', '');
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
}

function spliceLinksForNode(node) {
    var toSplice = links.filter(function (l) {
        return (l.source === node || l.target === node);
    });
    toSplice.map(function (l) {
        links.splice(links.indexOf(l), 1);
    });
}

// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
    if (selected_label != null) return;
    d3.event.preventDefault();
    if (lastKeyDown !== -1) return;
    lastKeyDown = d3.event.keyCode;

    // ctrl
    if (d3.event.keyCode === 17) {
        circle.call(d3.drag()
            .container(d3.select('svg')._groups[0][0])
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
        svg.classed('ctrl', true);
    }

    if (!selected_node && !selected_link) return;
    switch (d3.event.keyCode) {
        case 8: // backspace
        case 46: // delete
            if (selected_node) {
                nodes.splice(nodes.indexOf(selected_node), 1);
                spliceLinksForNode(selected_node);
            } else if (selected_link) {
                links.splice(links.indexOf(selected_link), 1);
            }
            selected_link = null;
            selected_node = null;
            restart();
            break;
        case 66: // B
            if (selected_link) {
                // set link direction to both left and right
                selected_link.left = true;
                selected_link.right = true;
            }
            restart();
            break;
        case 76: // L
            if (selected_link) {
                // set link direction to left only
                selected_link.left = true;
                selected_link.right = false;
            }
            restart();
            break;
        case 82: // R
            if (selected_node) {
                // toggle node reflexivity
                selected_node.reflexive = !selected_node.reflexive;
            } else if (selected_link) {
                // set link direction to right only
                selected_link.left = false;
                selected_link.right = true;
            }
            restart();
            break;
    }
}

function dragstarted() {
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
}

function dragended() {
    if (!d3.event.active) force.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
    resetMouseVars();
}

function keyup() {
    lastKeyDown = -1;

    // ctrl
    if (d3.event.keyCode === 17) {
        circle.on('.drag', null);
        svg.classed('ctrl', false);
    }
}

function mapNodeReferences(nodeData, linkData) {
    nodes = nodeData;
    links = [];
    var highestId = 0;
    for (var i = 0; i < linkData.length; i++) {
        links.push({ source: null, target: null, left: linkData[i].left, right: linkData[i].right, cost: linkData[i].cost, index: linkData[i].index });

        for (var j = 0; j < nodes.length; j++) {
            if (linkData[i].source.id === nodes[j].id)
                links[i].source = nodes[j];
            if (linkData[i].target.id === nodes[j].id)
                links[i].target = nodes[j];
            if (nodes[i].id > highestId) highestId = nodes[i].id;
        }
    }

    lastNodeId = highestId;
}

function processUploadedObject(object) {
    mapNodeReferences(object.graphdata.nodes, object.graphdata.links);
    restart();
}

$('#download-button, #download-button-mobile').on('click', function () {
    var graphdata = {};
    graphdata.nodes = nodes;
    graphdata.links = links;
    downloadObjectJson(graphdata, 'graphdata');
});

$(document).ready(function () {
    if (nodes.length == null || nodes.length == 0) {
        nodes = [
            { id: 0, reflexive: false },
            { id: 1, reflexive: true },
            { id: 2, reflexive: false }
        ]

        links = [
            { source: nodes[0], target: nodes[1], left: false, right: true, cost: Math.floor(Math.random() * 10 + 1) },
            { source: nodes[1], target: nodes[2], left: false, right: true, cost: Math.floor(Math.random() * 10 + 1) }
        ];
        restart();
    }
});

// app starts here
svg.on('mousedown', mousedown)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);

restart();