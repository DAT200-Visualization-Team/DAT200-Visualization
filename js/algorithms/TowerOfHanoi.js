/*
//var report = [];

function hanoi(disks, from, to, temp) {
    if (disks === 0)
        return;
    hanoi(disks - 1, from, temp, to);
    console.log("Moving disc " + disks + " from " + from + " to " + to);
    //report.push([disks, from, to]);
    hanoi(disks - 1, temp, to, from);
}
*/

function Hanoi(disks, from, to, temp) {
    this.report = [];
    // TODO: send command ('init', disks, 'from', 'to', 'temp');
    this.calculate(disks, from, to, temp);
    // TODO: send command ('moveDisk', disk, 'from', 'to'); for every sub-array in report
}


Hanoi.prototype.calculate = function(disks, from, to, temp) {
    if (disks === 0)
        return;
    this.calculate(disks - 1, from, temp, to);
    this.report.push([disks, from, to]);
    this.calculate(disks - 1, temp, to, from);
};

Hanoi.prototype.showReport = function() {
    console.log(this.report);
};


var h = new Hanoi(3, "A", "C", "B");
h.showReport();