/**
 * Util: Fixie
 * 
 * Some useful ruby-isms for JavaScript. <%= Insert hipster jokes here... %>
 */

Object.defineProperties(Array.prototype, {
    each : {
        value : Array.prototype.forEach,
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
        enumerable : false
    }
});

Object.defineProperties(Object.prototype, {
    each : {
        value : function(iter) {
            if (typeof iter !== "function")
                return; // console.log(iter);

            Object.keys(this).each((function(key) {
                iter(this[key], key);
            }).bind(this));
        },
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
        enumerable : false
    },
    merge : {
        value : function(mergein) {
            mergein = mergein || {};
            var result = this.clone();

            mergein.each(function(value, key) {
                if (!result[key]) // Nothing in target[key]. Merge away...
                    return result[key] = (!!value && typeof value === "object") ? value.clone() : value;

                // Don't merge arrays
                if (Array.isArray(result[key]))
                    return;
                if (Array.isArray(value) || !value)
                    return;

                // Both are objects. Recurse.
                if (typeof result[key] === "object" && typeof value === "object")
                    result[key].merge(value);
            });

            return result;
        },
        enumerable : false
    },
    $merge : {
        value : function(mergein) {
            mergein = mergein || {};
            mergein.each((function(value, key) {
                if (!this[key]) // Nothing in target[key]. Merge away...
                    return this[key] = (!!value && typeof value === "object") ? value.clone() : value;
                if (Array.isArray(this[key])) // target[key] is an array...
                    // Don't
                    // merge
                    return;
                if (Array.isArray(value) || !value)
                    return;

                // Both are objects. Recurse.
                if (typeof this[key] === "object" && typeof value === "object")
                    this[key].$merge(value);
            }).bind(this));

            return this;
        },
        enumerable : false
    }
});
