/**
 * Util: Turnstyle
 */
var Turnstyle = module.exports = function(permissions, parameters) {
    this.permissions = permissions || [];
    this.parameters = parameters || {}; 
};

Turnstyle.prototype.select = function(query) {
    var permissions = this.permissions.clone();

    // Scalars
    [ "platform", "service", "owner", "applicant" ].each(function(param) {
        if (!query.key(param))
            return;

        permissions = permissions.filter(function(perm) {
            return query[param] === perm[param];
        });
    });

    // Actions
    if (query.key("actions")) {
        permissions = permissions.filter(function(perm) {
            if (!Array.isArray(query.actions))
                query.actions = [ query.actions ];
            return query.actions.each(function(action) {
                return perm.actions.has(action);
            });
        });
    }

    // Resource
    if (query.key("resource")) {
        permissions = permissions.filter(function(perm) {
            var q = Array.isArray(query.resource) ? query.resource : [ query.resource ];
            var p = perm.resources;

            for (var i = 0; i < q.length; i++) {
                if (i >= p.length) // Trailing wildcard
                    return p.last === "*";
                if (p[i] === "*") // Embedded Wildcard
                    continue;

                if (p[i][0] === ":") { // Variable Match
                    if(!this.parameters.key(p[i].slice(1)))
                        return false;
                    if(this.parameters[p[i].slice(1)] === q[i])
                        return true;
                    return false
                }

                // Static Match
                return p[i] === q[i];
            }
        });
    }
};

Turnstyle.prototype.can = function(query) {
    var perms = this.select(query);
    if (!perms.length)
        return false;

    return !(perms.each(function(perm) {
        return perm.deny;
    }));
};
