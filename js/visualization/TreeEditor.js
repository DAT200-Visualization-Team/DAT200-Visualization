//http://bl.ocks.org/NPashaP/7683252

/*
** This program is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
 # Change Log
 All notable changes to this file will be documented here.

 27.03.2017
 (-) Removed gracefulLabels and supporting functions
 (-) Removed incMatx and supporting functions
 (+) Support only two children can be added per vertix

 */

function tree() {
    var svgW = 958, svgH = 460, vRad = 12, tree = {cx: 300, cy: 30, w: 40, h: 70};
    tree.vis = {v: 0, l: '?', p: {x: tree.cx, y: tree.cy}, c: []};
    tree.size = 1;
    tree.glabels = [];
    tree.incX = 500, tree.incY = 30, tree.incS = 20;

    tree.getVertices = function () {
        var v = [];

        function getVertices(t, f) {
            v.push({v: t.v, l: t.l, p: t.p, f: f});
            t.c.forEach(function (d) {
                return getVertices(d, {v: t.v, p: t.p});
            });
        }

        getVertices(tree.vis, {});
        return v.sort(function (a, b) {
            return a.v - b.v;
        });
    };

    tree.getEdges = function () {
        var e = [];

        function getEdges(_) {
            _.c.forEach(function (d) {
                e.push({v1: _.v, l1: _.l, p1: _.p, v2: d.v, l2: d.l, p2: d.p});
            });
            _.c.forEach(getEdges);
        }

        getEdges(tree.vis);
        return e.sort(function (a, b) {
            return a.v2 - b.v2;
        });
    };

    tree.addLeaf = function (_) {
        function addLeaf(t) {
            if (t.v == _) {
                if(t.c.length >= 2) return;
                t.c.push({v: tree.size++, l: '?', p: {}, c: []});
                return;
            }
            t.c.forEach(addLeaf);
        }

        addLeaf(tree.vis);
        reposition(tree.vis);
        if (tree.glabels.length != 0) {
            tree.glabels = [];
            relabel(
                {
                    lbl: d3.range(0, tree.size).map(function (d) {
                        return '?';
                    })
                });
            d3.select("#labelnav").style('visibility', 'hidden');
        }
        redraw();
    };

    relabel = function (lbl) {
        function relbl(t) {
            t.l = lbl.lbl[t.v];
            t.c.forEach(relbl);
        }

        relbl(tree.vis);
    };

    redraw = function () {
        var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());

        edges.transition().duration(500)
            .attr('x1', function (d) {
                return d.p1.x;
            }).attr('y1', function (d) {
                return d.p1.y;
            })
            .attr('x2', function (d) {
                return d.p2.x;
            }).attr('y2', function (d) {
            return d.p2.y;
        });

        edges.enter().append('line')
            .attr('x1', function (d) {
                return d.p1.x;
            }).attr('y1', function (d) {
                return d.p1.y;
            })
            .attr('x2', function (d) {
                return d.p1.x;
            }).attr('y2', function (d) {
                return d.p1.y;
            })
            .transition().duration(500)
            .attr('x2', function (d) {
                return d.p2.x;
            }).attr('y2', function (d) {
            return d.p2.y;
        });

        var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices());

        circles.transition().duration(500).attr('cx', function (d) {
            return d.p.x;
        }).attr('cy', function (d) {
            return d.p.y;
        });

        circles.enter().append('circle').attr('cx', function (d) {
            return d.f.p.x;
        }).attr('cy', function (d) {
            return d.f.p.y;
        }).attr('r', vRad)
            .on('click', function (d) {
                //console.log(getLeafCount(tree.getVertices()[d.v]));
                //console.log(tree.getVertices()[d.v], d);
                //console.log(getChildrenCount(d));
                return tree.addLeaf(d.v);
            })
            .transition().duration(500).attr('cx', function (d) {
            return d.p.x;
        }).attr('cy', function (d) {
            return d.p.y;
        });

        var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices());

        labels.text(function (d) {
            return d.l;
        }).transition().duration(500)
            .attr('x', function (d) {
                return d.p.x;
            }).attr('y', function (d) {
            return d.p.y + 5;
        });

        labels.enter().append('text').attr('x', function (d) {
            return d.f.p.x;
        }).attr('y', function (d) {
                return d.f.p.y + 5;
            })
            .text(function (d) {
                return d.l;
            }).on('click', function (d) {
                //console.log(getLeafCount(tree.getVertices()[d.v]));
                return tree.addLeaf(d.v);
            })
            .transition().duration(500)
            .attr('x', function (d) {
                return d.p.x;
            }).attr('y', function (d) {
            return d.p.y + 5;
        });
    };

    getLeafCount = function (_) {
        //console.log(_);
        if (_.c.length == 0) return 1;
        else return _.c.map(getLeafCount).reduce(function (a, b) {
            return a + b;
        });

    };

    reposition = function (v) {
        //console.log(v);
        var lC = getLeafCount(v), left = v.p.x - tree.w * (lC - 1) / 2;
        v.c.forEach(function (d) {
            var w = tree.w * getLeafCount(d);
            left += w;
            d.p = {x: left - (w + tree.w) / 2, y: v.p.y + tree.h};
            reposition(d);
        });
    };

    initialize = function () {

        d3.select(".body").append("svg").attr("width", svgW).attr("height", svgH).attr('id', 'treesvg');

        d3.select("#treesvg").append('g').attr('id', 'g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
            .attr('x1', function (d) {
                return d.p1.x;
            }).attr('y1', function (d) {
                return d.p1.y;
            })
            .attr('x2', function (d) {
                return d.p2.x;
            }).attr('y2', function (d) {
            return d.p2.y;
        });
        //console.log(d3.select("#treesvg").data(tree.getEdges()).enter().append('line'));

        d3.select("#treesvg").append('g').attr('id', 'g_circles').selectAll('circle').data(tree.getVertices()).enter()
            .append('circle').attr('cx', function (d) {
            return d.p.x;
        }).attr('cy', function (d) {
            return d.p.y;
        }).attr('r', vRad)
            .on('click', function (d) {
                //console.log(getLeafCount(this));
                return tree.addLeaf(d.v);
            });

        d3.select("#treesvg").append('g').attr('id', 'g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
            .attr('x', function (d) {
                return d.p.x;
            }).attr('y', function (d) {
            return d.p.y + 5;
        }).text(function (d) {
                return d.l;
            })
            .on('click', function (d) {
                //console.log(getLeafCount(this));
                return tree.addLeaf(d.v);
            });

        d3.select("#treesvg").append('g').attr('id', 'g_elabels').selectAll('text').data(tree.getEdges()).enter().append('text')
            .attr('x', function (d) {
                return (d.p1.x + d.p2.x) / 2 + (d.p1.x < d.p2.x ? 8 : -8);
            }).attr('y', function (d) {
                return (d.p1.y + d.p2.y) / 2;
            })
            .text(function (d) {
                return tree.glabels.length == 0 ? '' : Math.abs(d.l1 - d.l2);
            });


        tree.addLeaf(0);
        tree.addLeaf(0);
    };
    initialize();

    return tree;
}
var tree = tree();