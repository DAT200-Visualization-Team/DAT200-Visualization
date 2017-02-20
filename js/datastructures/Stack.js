function Stack() {
    this.arrayList = new ArrayList();
}

Stack.prototype.isEmpty = function () {
    return this.arrayList.size() === 0;
}

Stack.prototype.makeEmpty = function () {
    this.arrayList.clear();
}

Stack.prototype.push = function (element) {
    this.arrayList.add(element);
}

Stack.prototype.top = function () {
    if (this.isEmpty())
        throw { name: 'UnderflowException', message: 'ArrayList is empty' };
    return this.arrayList.get(this.arrayList.size() - 1);
}

Stack.prototype.pop = function () {
    if(this.isEmpty())
        throw { name: 'UnderflowException', message: 'ArrayList is empty' };
    return this.arrayList.removeAtPos(this.arrayList.size() - 1);
}