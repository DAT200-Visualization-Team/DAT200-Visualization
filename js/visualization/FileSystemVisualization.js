/*Copyright (c) 2013-2016, Rob Schmuecker
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Rob Schmuecker may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

// This is based on an upgrade of the tree at http://bl.ocks.org/robschmuecker/7880033 to d3 v4, which is found at
// https://jsfiddle.net/Tokker/mwm1sxhh/20/ (03.04.2017)

// Get JSON data
treeJSON = d3.json("./js/visualization/filetree.json", function (error, treeData) {

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var nodes;
    var links;

    var root = d3.hierarchy(treeData, function (d) { return d.children; });

    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var treemap;

    // A recursive helper function for performing some setup by walking through all nodes
    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;
        visitFn(parent);
        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function (d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);
    }, function (d) { return d.children && d.children.length > 0 ? d.children : null; });

    // TODO: Pan function, can be better implemented.
    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function () {
                pan(domNode, speed, direction);
            }, 50);
        }
    }
    // Define the zoom function for the zoomable tree
    function zoom() {
        if (d3.event.transform != null) {
            svgGroup.attr("transform", d3.event.transform);
        }
    }
    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
    function centerNode(source) {
        //scale = zoomListener.scale();
        t = d3.zoomTransform(baseSvg.node());
        x = -source.y0;
        y = -source.x0;
        x = x * t.k + viewerWidth / 2;
        y = y * t.k + viewerHeight / 2;
        d3.select('svg').transition().duration(duration).call(zoomListener.transform, d3.zoomIdentity.translate(x, y).scale(t.k));
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });

        // if nodes has children, remove the links and nodes
        if (draggingNode.descendants().length > 1) {
            svgGroup.selectAll("path.link").data(links, function (d) { return d.id; })
				.filter(function (d, i) {
				    if (draggingNode.descendants().map(function (d) { return d.id }).indexOf(d.id) != -1) {
				        return true;
				    }
				    return false;
				}).remove();

            // remove child nodes
            svgGroup.selectAll("g.node").data(nodes, function (d) { return d.id; })
				.filter(function (d, i) {
				    if (draggingNode.descendants().map(function (d) { return d.id }).indexOf(d.id) != -1 && d != draggingNode) {
						return true;
					}
					return false;
				}).remove();
        }
        // remove parent link
        svgGroup.selectAll('path.link').filter(function (d, i) {
            if (d.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree-container").append("svg").attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.drag()
        .on("start", function(d) {
            if (d == root) {
                return;
            }
            dragStarted = true;

            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }
    
            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {
    
                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {
    
                }
            }
    
            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;

            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("end", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children != null || typeof selectedNode._children != null) {
                    if (selectedNode.children != null) {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so the user can see added node is correctly moved
                expand(selectedNode);
                endDrag();
            } else {
                endDrag();
            }
        });
    
    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            console.log(treeData);
            treeData.children.push({ children: [{ name: 500 }, { name: 501 }], name: 502 });
            root = d3.hierarchy(treeData, function (d) { return d.children; });
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }
    // Helper functions for collapsing and expanding nodes.
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function (d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function (d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function () {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", function (d) {
                var o = { x: data[0].source.x, y: data[0].source.y };
                return diagonal(o, o);
            })
            .attr('pointer-events', 'none');

        link.attr("d", function (d) {
            var o = { x: data[0].source.x, y: data[0].source.y };
            return diagonal(o, o);
        });

        link.exit().remove();
    };

    // Toggle children function
    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.
    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function diagonal(s, d) {
        if (s != null &&
           d != null) {
            var path = "M " + s.y + " " + s.x
                          + " C " + ((s.y + d.y) / 2) + " " + s.x + ","
                          + ((s.y + d.y) / 2) + " " + d.x + ","
                          + " " + d.y + " " + d.x;

            return path;
        }
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function (level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line

        treemap = d3.tree().size([newHeight, viewerWidth]);

        var treeData = treemap(root);

        // Compute the new tree layout.
        nodes = treeData.descendants(),
		        links = treeData.descendants().slice(1);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function (d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node").data(nodes, function (d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g").call(dragListener)
                                    .attr("class", "node")
                                    .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                                    .on('click', click);
        nodeEnter.append("circle").attr('class', 'nodeCircle')
                                  .attr("r", 4.5)
                                  .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeEnter.append("text").attr("x", function (d) { return d.children || d._children ? -10 : 10; })
                                .attr("dy", ".35em")
                                .attr('class', 'nodeText')
                                .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
                                .text(function (d) { return d.data.name; })
                                .style("fill-opacity", 0);
        
        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle").attr('class', 'ghostCircle')
                                  .attr("r", 30)
                                  .attr("opacity", 0.2) // change this to zero to hide the target area
                                  .style("fill", "red")
                                  .attr('pointer-events', 'mouseover')
                                  .on("mouseover", function(node) { overCircle(node); })
                                  .on("mouseout", function(node) { outCircle(node); });

        // Update the text to reflect whether node has children or not.
        node.select('text').attr("x", function (d) { return d.children || d._children ? -10 : 10; })
                           .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
                           .text(function (d) { return d.data.name; });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle").attr("r", 4.5).style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

        // Transition nodes to their new position.
        var nodeUpdate = nodeEnter.merge(node);
        nodeUpdate.transition().duration(duration).attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

        // Fade the text in
        nodeUpdate.select("text").style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; }).remove();
        nodeExit.select("circle").attr("r", 0);
        nodeExit.select("text").style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link").data(links, function (d) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal(o, o);
            });

        // Transition links to their new position.
        var linkUpdate = linkEnter.merge(link);
        linkUpdate.transition().duration(duration).attr('d', function (d) { return diagonal(d, d.parent) });

        // Transition exiting nodes to the parent's new position.
        var linkExit = link.exit().transition().duration(duration).attr("d", function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal(o, o);
        })
        .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root.x0 = viewerHeight / 2;
    root.y0 = 50;

    // Layout the tree initially and center on the root node.
    update(root);
    centerNode(root);
});