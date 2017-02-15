function naiveFib(n) {
    if (n < 1)
        throw new { name: "IllegalArgumentException", message: "The Fibonacci numbers start at 1." };
    if (n === 1) return 1;
    if (n === 2) return 1;

    return naiveFib(n - 1) + naiveFib(n - 2);
}

function iterativeFib(n) {
    if(n <= 0)
        throw new { name: "IllegalArgumentException", message: "The Fibonacci numbers start at 1." };
    if (n === 1) return 1;
    if (n === 2) return 1;

    var nMinusOne = 1;
    var nMinusTwo = 1;
    var result = 0;

    for (var i = 3; i <= n; i++) {
        result = nMinusOne + nMinusTwo;
        nMinusTwo = nMinusOne;
        nMinusOne = result;
    }

    return result;
}

function FibCalculator(n) {
    this.oldNumbers = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0);
    this.result = this.recursiveFib(n);
}

FibCalculator.prototype.getResult = function () {
    return this.result;
};


FibCalculator.prototype.recursiveFib = function (n) {
    if (this.oldNumbers[n - 1] != 0) return this.oldNumbers[n - 1];
    if (n === 1) return 1;
    if (n === 2) return 1;

    this.oldNumbers[n - 1] = this.recursiveFib(n - 1) + this.recursiveFib(n - 2);
    return this.oldNumbers[n - 1];
};