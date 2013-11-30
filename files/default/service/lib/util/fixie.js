/**
 * Util: Fixie
 * 
 * Some useful ruby-isms for JavaScript. <%= Insert hipster jokes here... %>
 */

Object.defineProperties(Array.prototype, {
    last : {
        get : function() {
            return this[this.length - 1];
        },
        enumerable : false
    },
    next : {
        get : function() {
            return this.shift();
        },
        enumerable : false
    },
    has : {
        value : function(key) {
            return this.indexOf(key) > -1;
        },
        writable : true,
        enumerable : false
    },
    each : {
        value : function(iter) {
            if (typeof iter !== "function")
                return;

            for (var i = 0; i < this.length; i++) {
                if (iter(this[i], i))
                    return true;
            }
        },
        writable : true,
        enumerable : false
    },
    clone : {
        value : function() {
            return this.map(function(elm) {
                if (!!elm && typeof elm === "object")
                    return elm.clone();
                return elm;
            });
        },
        writable : true,
        enumerable : false
    }
});

Object.defineProperties(Object.prototype, {
    count : {
        value : function() {
            return Object.keys(this).length;
        },
        writable : true,
        enumerable : false
    },
    key : {
        value : function(key) {
            return (typeof this[key] !== "undefined");
        },
        writable : true,
        enumerable : false
    },
    each : {
        value : function(iter) {
            if (typeof iter !== "function")
                return;

            Object.keys(this).each((function(key) {
                iter(this[key], key);
            }).bind(this));
        },
        writable : true,
        enumerable : false
    },
    filter : {
        value : function(iter) {
            if (typeof iter !== "function")
                return this;

            var result = {};
            this.each((function(value, key) {
                if (iter(key, this[key]))
                    result[key] = value;
            }).bind(this));

            return result;
        },
        writable : true,
        enumerable : false
    },
    map : {
        value : function(iter) {
            if (typeof iter !== "function")
                return this;

            var result = {};
            this.each((function(value, key) {
                result[key] = iter(value, key);
            }).bind(this));

            return result;
        },
        writable : true,
        enumerable : false
    },
    clone : {
        value : function() {
            return this.map(function(value, key) {
                if (!!value && typeof value === "object")
                    return value.clone();
                return value;
            });
        },
        writable : true,
        enumerable : false
    },
    merge : {
        value : function(from) {
            from = from || {};
            var to = this.clone();

            from.each(function(value, key) {
                // Knock-out
                if (value === null)
                    return delete to[key];

                // Array
                if (Array.isArray(value))
                    return to[key] = value;

                // Object
                if (typeof to[key] === "object" && typeof value === "object")
                    return to[key].merge(value);

                // Scalar
                to[key] = value;
            });
            return to;
        },
        writable : true,
        enumerable : false
    },
    $merge : {
        value : function(from) {
            from = from || {};
            from.each((function(value, key) {
                // Knock-out
                if (value === null)
                    return delete this[key];

                // Array
                if (Array.isArray(value))
                    return this[key] = value;

                // Object
                if (typeof this[key] === "object" && typeof value === "object")
                    return this[key].merge(value);

                // Scalar
                this[key] = value;
            }).bind(this));
            return this;
        },
        writable : true,
        enumerable : false
    }
});
