const mysql = require('mysql2')

const conection = mysql.createConnection({
    host: 'mysql.api-doe.kinghost.net',
    port: 3306,
    user: 'apidoe_add1',
    password: 'dbapidev784',
    database: 'apidoe'
})

module.exports = conection