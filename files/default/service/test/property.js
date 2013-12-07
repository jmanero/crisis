/**
 * 
 */
function A() {
    Object.defineProperty(this, "foo", {
        value : this.foo || "bar",
        enumerable : true
    });
}

function B() {
    this.foo = "asdf";
    A.call(this);
}

console.log(new B());
console.log(new A());