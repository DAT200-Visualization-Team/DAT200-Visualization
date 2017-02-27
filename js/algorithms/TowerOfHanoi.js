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
    this.commands = [];
    // TODO: send command ('init', disks, 'from', 'to');
    this.calculate(disks, from, to, temp);
    // TODO: send command ('moveDisk', disk, 'from', 'to'); for every sub-array in commands
    sendCommands(this.commands);
}


Hanoi.prototype.calculate = function(disks, from, to, temp) {
    if (disks === 0)
        return;
    this.calculate(disks - 1, from, temp, to);
    this.commands.push([disks, from, to]);
    this.calculate(disks - 1, temp, to, from);
};

Hanoi.prototype.showReport = function() {
    console.log(this.commands);
    return this.commands;
};



var h = new Hanoi(9, "A", "C", "B");
//var rep = h.showReport();
//console.log(rep[0]);*/


