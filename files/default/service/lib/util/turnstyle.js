/**
 * Util: PermissionResolver
 */
var Turnstyle = module.exports = function(permissions) {
    this.permissions = permissions;
};

Turnstyle.prototype.can = function(query) {
    return this.permissions.each(function(perm) {
        if(!query.platform || query.platform != perm.platform)
            return;
        if(!query.service || query.service != perm.service)
            return;
        if(!query.action || !perm.actions.has(query.action))
            return;
        
    });
};
