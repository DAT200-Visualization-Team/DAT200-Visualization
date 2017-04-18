function maximumSubsequenceSum(array) {
    var currentMaximum, greatestMaximum;
    currentMaximum = greatestMaximum = array[0];

    for (var i = 1; i < array.length; i++) {
        currentMaximum = Math.max(array[i], currentMaximum + array[i]);
        greatestMaximum = Math.max(currentMaximum, greatestMaximum);
    }

    return greatestMaximum;
}

function maximumSubsequenceSumQuadratic(array) {
    var maxSum = array[0];
    var seqStart = 0;
    var seqEnd = 0;

    for(var i = 0; i < array.length; i++) {
        var S_ij = 0;

        for(var j = i; j < array.length; j++) {
            S_ij += array[j];

            if(S_ij > maxSum) {
                maxSum = S_ij;
                seqStart = i;
                seqEnd = j;
            }
        }
    }

    return maxSum;
}

function maximumSubsequenceSumCubic(array) {
    var maxSum = array[0];
    var seqStart = -1;
    var seqEnd = -1;
    for(var i = 0; i < array.length; i++) {
        for(var j = i; j < array.length; j++) {
            var S_ij = 0;

            for(var k = i; k <= j; k++) {
                S_ij += array[k];
            }
            if(S_ij > maxSum) {
                maxSum = S_ij;
                seqStart = i;
                seqEnd = j;
            }
        }
    }

    return maxSum;
}


var arr = [-2, -3, -1, -20, -5, -10];

console.log(maximumSubsequenceSum(arr), maximumSubsequenceSumQuadratic(arr), maximumSubsequenceSumCubic(arr));