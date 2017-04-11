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
 (+) Support only two children per vertix

 29.03.2017
 (+) Added method for removing leaf vertices
 (-/+) Restructured and changed variable names
 */

function tree(rootLbl) {
    var svgW = 958, svgH = 460, vRad = 12, tree = {cx: 300, cy: 30, w: 40, h: 70};
    tree.id = 0;
    if (rootLbl == null) rootLbl = tree.id;
    tree.vis = [{v: tree.id, l: rootLbl, d: 'r', p: {x: tree.cx, y: tree.cy}, f: {}, c: []}];
    tree.glabels = [];
    tree.incX = 500, tree.incY = 30, tree.incS = 20;

    tree.getVerticeById = function (id) {
        for(var i = 0; i < tree.vis.length; i++)
            if (tree.vis[i].v == id) return tree.vis[i];

        return -1;
    };

    tree.getVertices = function () {
        return tree.vis;
    };

    tree.getEdges = function () {
        var e = [];

        function getEdges(_) {
            _.forEach(function (i) {
                i.c.forEach(function (d) {
                    e.push({v1: i.v, /*l1: i.l,*/ p1: i.p, v2: d.v, /*l2: d.l,*/ p2: d.p});
                });
            });
            //_.forEach(getEdges);
        }

        getEdges(tree.vis);
        return e.sort(function (a, b) {
            return a.v2 - b.v2;
        });
    };

    tree.addLeaf = function (_, d, l) {
        tree.id++;
        if (l == null) l = tree.id;
        var insertable = true;

        function addLeaf(n) {
            n.forEach(function (t) {
                if (t.v == _) {
                    if (t.c.length >= 2) insertable = false;
                    t.c.forEach(function (c) {
                        if (c.d == d) insertable = false;
                    });

                    if (insertable) {
                        t.c.push({v: tree.id, d: d, p: {}});
                        tree.vis.push({
                            v: tree.id,
                            l: l, d: d, p: {},
                            f: {v: t.v, d: t.d, p: {x: t.p.x, y: t.p.y}},
                            c: []
                        });
                        return;
                    }
                }
            });
        }

        addLeaf(tree.vis);
        reposition(tree.vis);
        redraw();
    };

    tree.removeLeaf = function (_) {
        function removeLeaf(n) {
            n.forEach(function (t) {
                if (t.v == _) {
                    if (t.c.length === 0) {
                        var parentV = t.f.v;
                        tree.vis.forEach(function (s) {
                            if (s.v == parentV) {
                                if (s.c[0].v == t.v) s.c.shift();
                                else s.c.pop();
                            }
                        });
                        tree.vis.splice($.inArray(t, tree.vis), 1);
                    }
                }
            });
        }

        if (tree.vis.length == 1) return;
        removeLeaf(tree.vis);
        reposition(tree.vis);
        redraw();
    };

    redraw = function () {
        var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges(), function(d) {return d.v2});

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

        var e = edges.enter().append('line')
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

        edges.exit().remove();
        edges = edges.merge(e);


        var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices(), function(d) {return d.v});

        circles.transition().duration(500).attr('cx', function (d) {
            return d.p.x;
        }).attr('cy', function (d) {
            return d.p.y;
        });

        var c = circles.enter().append('circle').attr('cx', function (d) {
            return d.f.p.x;
        }).attr('cy', function (d) {
            return d.f.p.y;
        }).attr('r', vRad)
            .on('click', function (d) {
                if (d3.event.shiftKey) return tree.removeLeaf(d.v);
                else if (d3.event.altKey) return tree.addLeaf(d.v, 'right');
                else return tree.addLeaf(d.v, 'left');
            })
            .transition().duration(500).attr('cx', function (d) {
                return d.p.x;
            }).attr('cy', function (d) {
                return d.p.y;
            });

        circles.exit().remove();
        //console.log(d3.selectAll("circle"));

        circles = circles.merge(c);


        var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices(), function(d) {return d.v});

        labels.text(function (d) {
            return d.l;
        }).transition().duration(500)
            .attr('x', function (d) {
                return d.p.x;
            })
            .attr('y', function (d) {
                    return d.p.y + 5;
                }
            );

        var l = labels.enter().append('text').attr('x', function (d) {
            return d.f.p.x;
        }).attr('y', function (d) {
                return d.f.p.y + 5;
            })
            .text(function (d) {
                return d.l;
            }).on('click', function (d) {
                if (d3.event.shiftKey) return tree.removeLeaf(d.v);
                else if (d3.event.altKey) return tree.addLeaf(d.v, 'right');
                else return tree.addLeaf(d.v, 'left');
            })
            .transition().duration(500)
            .attr('x', function (d) {
                return d.p.x;
            }).attr('y', function (d) {
                return d.p.y + 5;
            });

        labels.exit().remove();
        labels = labels.merge(l);
    };

    getLeafCount = function (v) {
        var counter = 0;

        function getLfCnt(s) {
            if (s.c.length == 0)
                counter++;
            else {
                s.c.forEach(function (i) {
                    getLfCnt(tree.getVerticeById(i.v));
                });
            }
        }

        v = tree.getVerticeById(v);
        if(v.c.length == 0) return 1;
        v.c.forEach(function (i) {
            getLfCnt(tree.getVerticeById(i.v));
        });

        return counter;
    };

    reposition = function (v) {
        /*function repos(v) {
            var lC = getLeafCount(v.v), left = v.p.x - tree.w * (lC - 1) / 2;
            v.c.forEach(function (d) {
                var vc = d;
                d = tree.getVerticeById(d.v);
                var w = tree.w * getLeafCount(d.v);
                left += w;
                d.p = {x: left - (w + tree.w) / 2, y: v.p.y + tree.h};
                vc.p = d.p;
                repos(d);
            });
        }
        repos(v[0]);*/

        function repos(v) {
            var lC = getLeafCount(v.v),
                left = v.p.x;

            v.c.forEach(function (d) {
                var vc = d;
                d = tree.getVerticeById(d.v);

                var w = 0;
                if(d.d == 'right') { w += 15 * lC }
                if(d.d == 'left') { w -= 15 * lC }

                d.p = {x: left + w, y: v.p.y + tree.h};
                vc.p = d.p;
                repos(d);
            });
        }

        repos(v[0]);
    };

    initialize = function () {

        d3.select(".treeEditor").append("svg").attr("width", svgW).attr("height", svgH).attr('id', 'treesvg').attr('class', 'noselect');

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

        d3.select("#treesvg").append('g').attr('id', 'g_circles').selectAll('circle').data(tree.getVertices()).enter()
            .append('circle').attr('cx', function (d) {
            return d.p.x;
        }).attr('cy', function (d) {
            return d.p.y;
        }).attr('r', vRad)
            .on('click', function (d) {
                if (d3.event.shiftKey) return tree.removeLeaf(d.v);
                else if (d3.event.altKey) return tree.addLeaf(d.v, 'right');
                else return tree.addLeaf(d.v, 'left');
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
                if (d3.event.shiftKey) return tree.removeLeaf(d.v);
                else if (d3.event.altKey) return tree.addLeaf(d.v, 'right');
                else return tree.addLeaf(d.v, 'left');

            });

        //tree.addLeaf(0);
        //tree.addLeaf(0, 'right');
    };

    initialize();
    return tree;
}
//var tree = tree();