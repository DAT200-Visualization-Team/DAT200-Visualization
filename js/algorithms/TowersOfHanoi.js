var report = [];

function hanoi(disks, from, to, temp) {
    if (disks === 0)
        return;
    hanoi(disks - 1, from, temp, to);
    //console.log("Moving disc " + disks + " from " + from + " to " + to);
    report.push([disks, from, to]);
    hanoi(disks - 1, temp, to, from);
}