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

// Get JSON data
treeJSON = d3.json("./js/visualization/filetree.json", function (error, treeData) {
    if (error) throw error;

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20;
    // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var treemap = d3.tree().size([viewerHeight, viewerWidth]);

    var nodes = d3.hierarchy(treeData, function (d) { return d.children; })

    nodes = treemap(nodes);

    var svg = d3.select('#tree-container').append('svg')
        .attr('width', viewerWidth)
        .attr('height', viewerHeight),
    g = svg.append('g')
        .attr('transform', 'translate(' + 90 + ',' + 20 + ')');

    var link = g.selectAll('.link')
        .data(nodes.descendants().slice(1))
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', function (d) {
            return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
        });

    var node = g.selectAll('.node')
        .data(nodes.descendants())
        .enter().append('g')
        .attr('class', function (d) { return 'node' + (d.children ? ' node--internal' : ' node--leaf'); })
        .attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')'; });

    node.append('circle')
        .attr('r', 10);

    node.append('text')
        .attr('dy', '.35em')
        .attr('x', function (d) { return d.children ? -13 : 13 })
        .style('text-anchor', function (d) { return d.children ? 'end' : 'start'; })
        .text(function (d) { return d.data.name; });

    function update(source) {
        
    }
});
