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
    this.calculate(disks, from, to, temp);
    resetGUI();
    sendCommands(this.commands, disks, from);
}


Hanoi.prototype.calculate = function(disks, from, to, temp) {
    this.commands.push(0);
    if (disks === 0) {
        this.commands.push(1);
        return;
    }
    this.commands.push(2);
    this.calculate(disks - 1, from, temp, to);
    this.commands.push([disks, from, to]);
    this.commands.push(4);
    this.calculate(disks - 1, temp, to, from);
};

Hanoi.prototype.showReport = function() {
    console.log(this.commands);
    return this.commands;
};



//var h = new Hanoi(3, "A", "C", "B");
//var rep = h.showReport();
//console.log(rep[0]);*/


