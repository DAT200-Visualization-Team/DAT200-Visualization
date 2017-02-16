// Arrow class
function Arrow(arrow) {
    this.arrow = arrow;

    var arch = arrow.children().first().attr("d");
    arch = arch.split(' ');
    this.x0 = parseInt(arch[1]);
    this.y0 = parseInt(arch[2]);
    this.x1 = parseInt(arch[6]);
    this.y1 = parseInt(arch[7]);
    this.mx = parseInt(arch[4]);
    this.my = parseInt(arch[5]);

    var triangle = arrow.children().last().attr("d");
    triangle = triangle.split(' ');
    this.p0x = parseInt(triangle[1]);
    this.p0y = parseInt(triangle[2]);
    this.p1x = parseInt(triangle[4]);
    this.p1y = parseInt(triangle[5]);
    this.p2x = parseInt(triangle[7]);
    this.p2y = parseInt(triangle[8]);

}

Arrow.prototype.animate = function(dx, dy, dmy, sequence) {
    if (dmy == null)
        dmy = 0;
    var arrow = this;

    var tx1 = arrow.x1;
    var ty1 = arrow.y1;
    var tmy = arrow.my;
    var tp0x = arrow.p0x;
    var tp0y = arrow.p0y;
    var tp1x = arrow.p1x;
    var tp1y = arrow.p1y;
    var tp2x = arrow.p2x;
    var tp2y = arrow.p2y;




    console.log(arrow.x1);


    var progressAnimation = function (elements, complete, remaining, start, tweenValue) {
        arrow.x1 = tx1 + (tweenValue * dx);
        arrow.y1 = ty1 + (tweenValue * dy);
        arrow.my = tmy + (tweenValue * dmy);
        arrow.p0x = tp0x + (tweenValue * dx);
        arrow.p0y = tp0y + tweenValue * dy;
        arrow.p1x = tp1x + tweenValue * dx;
        arrow.p1y = tp1y + tweenValue * dy;
        arrow.p2x = tp2x + tweenValue * dx;
        arrow.p2y = tp2y + tweenValue * dy;

        /*elements[0].setAttribute(
            "d", "M " + arrow.x0 + " " + arrow.y0 + " Q " + arrow.mx + " " + ((tweenValue * dmy) + arrow.my) + " " + ((tweenValue * dx) + arrow.x1) + " " + ((tweenValue * dy) + arrow.y1)
        );
        elements[1].setAttribute(
            "d", "M " + (arrow.p0x + (dx * tweenValue)) + " " + (arrow.p0y + (dy * tweenValue)) + " L " + (arrow.p1x + (dx * tweenValue)) + " " + (arrow.p1y + (dy * tweenValue)) + " L " + (arrow.p2x + (dx * tweenValue)) + " " + (arrow.p2y + (dy * tweenValue) + " Z")
        );*/

        elements[0].setAttribute(
            "d", "M " + arrow.x0 + " " + arrow.y0 + " Q " + arrow.mx + " " + arrow.my + " " + (arrow.x1) + " " + arrow.y1
        );


        elements[1].setAttribute(
            "d", "M " + arrow.p0x + " " + arrow.p0y + " L " + arrow.p1x + " " + arrow.p1y + " L " + arrow.p2x + " " + arrow.p2y + " Z"
        );

    };

    console.log(arrow.x1);
    var animationToBeReturned = { e: this.arrow.children(), p: { tween: 1 }, o: { duration: animationTime, progress: progressAnimation, sequenceQueue: sequence } };
    arrow.x1 = tx1 + (dx);
    arrow.y1 = ty1 + dy;
    arrow.my = tmy + (dmy);
    arrow.p0x = tp0x + (dx);
    arrow.p0y = tp0y + dy;
    arrow.p1x = tp1x + dx;
    arrow.p1y = tp1y + dy;
    arrow.p2x = tp2x + dx;
    arrow.p2y = tp2y + dy;


    return animationToBeReturned;

};
