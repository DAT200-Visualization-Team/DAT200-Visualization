var element;
var isActive; // Marked false if deleted

function HashEntry(e, i) {
    element = e;
    isActive = i;
}

// Found at http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/ 10.01.2017 10:51
HashEntry.prototype.hashCode = function () {
    var string = element.toString();
    var hash = 0;

    if (string.length == 0)
        return hash;

    for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash // Convert to 32 bit integer
    }

    return hash;
};