function getSimpleHashCode(object) {
	var num = parseInt(object);

	if (isNaN(num)) {
		var stringNum = "";
		for (var i = 0; i < object.length; i++) {
			stringNum += object.charCodeAt(i);
		}
		num = parseInt(stringNum);
	}

	return num;
}

// Found at http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/ 10.01.2017 10:51
function getHashCode(object) {
    var string = object.toString();
    var hash = 0;

    if (string.length == 0)
        return hash;

    for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
	    hash = hash & hash; // Convert to 32 bit integer
    }

    return hash;
};

function nextPrime(n) {
    if(n % 2 === 0)
        n++

    for (; !isPrime(n) ; n += 2)
        ;
    
    return n;
}

// Implementation of isPrime and leastFactor taken from http://www.javascripter.net/faq/numberisprime.htm at 12.01.2017 11:00
function isPrime(n) {
    if (isNaN(n) || !isFinite(n) || n % 1 || n < 2)
        return false;
    if (n == leastFactor(n))
        return true;
    return false;
}

function leastFactor(n) {
    if (isNaN(n) || !isFinite(n))
        return NaN;
    if (n == 0)
        return 0;
    if (n % 1 || n * n < 2)
        return 1;
    if (n % 2 == 0)
        return 2;
    if (n % 3 == 0)
        return 3;
    if (n % 5 == 0)
        return 5;

    var m = Math.sqrt(n);
    for (var i = 7; i <= m; i += 30) {
        if (n % i == 0)
            return i;
        if (n % (i + 4) == 0)
            return i + 4;
        if (n % (i + 6) == 0)
            return i + 6;
        if (n % (i + 10) == 0)
            return i + 10;
        if (n % (i + 12) == 0)
            return i + 12;
        if (n % (i + 16) == 0)
            return i + 16;
        if (n % (i + 22) == 0)
            return i + 22;
        if (n % (i + 24) == 0)
            return i + 24;
    }
    return n;
}