function Hanoi(disks, from, to, temp) {
    if (disks > 9) {
        throw {name: "ArgumentOutOfRangeException", message: "GUI can only handle maximum 9 disks"};
    }
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

function doHanoi(numdisks, from, to) {
    var speed = parseInt($("#speed").val());
    //animationTime = baseAnimationTime / speed;

    var arr = ["A", "B", "C"].filter(function(value) {
        return from !== value && to !== value;
    });

    new Hanoi(numdisks, from, to, arr[0]);
}