/**
 * 
 */

var default_admin = new Subject({
    name : process.argv[2],
    type : "User",
    tenant : tenant,
    password : process.argv[3],
    inherits : [ admin ]
})

var default_key = new Key({
    subject : default_admin
})
