// Arrow class
function Arrow(arrow) {
    this.arrow = arrow;

    var arch = arrow.children().first().attr("d");
    arch = arch.split(' ');

    if(arch.length > 6) {
        this.x0 = parseInt(arch[1]);
        this.y0 = parseInt(arch[2]);
        this.x1 = parseInt(arch[6]);
        this.y1 = parseInt(arch[7]);
        this.mx = parseInt(arch[4]);
        this.my = parseInt(arch[5]);
    }
    else {
        this.x0 = parseInt(arch[1]);
        this.y0 = parseInt(arch[2]);
        this.x1 = parseInt(arch[4]);
        this.y1 = parseInt(arch[5]);
    }

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
    var arrow = this;
    if (dmy == null) {
        dmy = 0;
        arrow.mx = arrow.x0;
    }

    var tx1 = arrow.x1;
    var ty1 = arrow.y1;
    var tmy = arrow.my;
    var tmx = arrow.mx;
    if (dmy == 0) {
        arrow.mx = arrow.x0;
    }
    var tp0x = arrow.p0x;
    var tp0y = arrow.p0y;
    var tp1x = arrow.p1x;
    var tp1y = arrow.p1y;
    var tp2x = arrow.p2x;
    var tp2y = arrow.p2y;

    var progressAnimation = function (self) {
        var tweenValue = self.progress();


        arrow.x1 = tx1 + (tweenValue * dx);
        arrow.y1 = ty1 + (tweenValue * dy);
        arrow.my = tmy + (tweenValue * dmy);
        arrow.mx = (arrow.x0 + arrow.x1) / 2;
        if (dmy == 0) {
            arrow.mx = arrow.x0;
        }
        arrow.p0x = tp0x + (tweenValue * dx);
        arrow.p0y = tp0y + tweenValue * dy;
        arrow.p1x = tp1x + tweenValue * dx;
        arrow.p1y = tp1y + tweenValue * dy;
        arrow.p2x = tp2x + tweenValue * dx;
        arrow.p2y = tp2y + tweenValue * dy;

        self.target[0].setAttribute(
            "d", "M " + arrow.x0 + " " + arrow.y0 + " Q " + arrow.mx + " " + arrow.my + " " + (arrow.x1) + " " + arrow.y1
        );
        self.target[1].setAttribute(
            "d", "M " + arrow.p0x + " " + arrow.p0y + " L " + arrow.p1x + " " + arrow.p1y + " L " + arrow.p2x + " " + arrow.p2y + " Z"
        );

    };

    (sequence) ? sequence = 1 : sequence = 0;

    var animationToBeReturned = {
        e: this.arrow.children(),
        p: { onUpdate: progressAnimation, onUpdateParams: ["{self}"], ease: Power0.easeNone },
        o: { duration: animationTime, position: "-=" + sequence }
    };


    arrow.x1 = tx1 + (dx);
    arrow.y1 = ty1 + dy;
    arrow.my = tmy + (dmy);
    arrow.mx = (arrow.x0 + arrow.x1) / 2;
    if (dmy == 0) {
        arrow.mx = arrow.x0;
    }
    arrow.p0x = tp0x + (dx);
    arrow.p0y = tp0y + dy;
    arrow.p1x = tp1x + dx;
    arrow.p1y = tp1y + dy;
    arrow.p2x = tp2x + dx;
    arrow.p2y = tp2y + dy;


    return animationToBeReturned;

};


Arrow.prototype.translateStraightArrow = function(dx, dy, sequence) {
    var arrow = this;

    var tx0 = arrow.x0;
    var ty0 = arrow.y0;
    var tx1 = arrow.x1;
    var ty1 = arrow.y1;
    var tp0x = arrow.p0x;
    var tp0y = arrow.p0y;
    var tp1x = arrow.p1x;
    var tp1y = arrow.p1y;
    var tp2x = arrow.p2x;
    var tp2y = arrow.p2y;

    var progressAnimation = function (elements, complete, remaining, start, tweenValue) {
        arrow.x0 = tx0 + (tweenValue * dx);
        arrow.y0 = ty0 + (tweenValue * dy);
        arrow.x1 = tx1 + (tweenValue * dx);
        arrow.y1 = ty1 + (tweenValue * dy);
        arrow.p0x = tp0x + (tweenValue * dx);
        arrow.p0y = tp0y + tweenValue * dy;
        arrow.p1x = tp1x + tweenValue * dx;
        arrow.p1y = tp1y + tweenValue * dy;
        arrow.p2x = tp2x + tweenValue * dx;
        arrow.p2y = tp2y + tweenValue * dy;

        elements[0].setAttribute(
            "d", "M " + arrow.x0 + " " + arrow.y0 + " L " + (arrow.x1) + " " + arrow.y1
        );
        elements[1].setAttribute(
            "d", "M " + arrow.p0x + " " + arrow.p0y + " L " + arrow.p1x + " " + arrow.p1y + " L " + arrow.p2x + " " + arrow.p2y + " Z"
        );

    };

    var animationToBeReturned = { e: this.arrow.children(), p: { tween: 1 }, o: { duration: animationTime, progress: progressAnimation, sequenceQueue: sequence } };
    arrow.x0 = tx0 + (dx);
    arrow.y0 = ty0 + dy;
    arrow.x1 = tx1 + (dx);
    arrow.y1 = ty1 + dy;
    arrow.p0x = tp0x + (dx);
    arrow.p0y = tp0y + dy;
    arrow.p1x = tp1x + dx;
    arrow.p1y = tp1y + dy;
    arrow.p2x = tp2x + dx;
    arrow.p2y = tp2y + dy;


    return animationToBeReturned;

};