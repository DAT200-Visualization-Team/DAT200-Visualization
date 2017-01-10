var arrayList;

function Stack() {
    arrayList = new ArrayList();
}

Stack.prototype.isEmpty = function () {
    return arrayList.length == 0;
}

Stack.prototype.makeEmpty = function () {
    arrayList.clear();
}

Stack.prototype.push = function (element) {
    arrayList.add(element);
}

Stack.prototype.top = function () {
    if (this.isEmpty())
        throw { name: "UnderflowException", message: "ArrayList is empty" };
    return arrayList.get(arrayList.size() - 1);
}

Stack.prototype.pop = function () {
    if(this.isEmpty())
        throw { name: "UnderflowException", message: "ArrayList is empty" };
    return arrayList.remove(arrayList.size() - 1);
}