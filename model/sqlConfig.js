const mysql = require("mysql2/promise");


//mysql mai pool banana parta hai
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:"",
    //NEXT PART IS database NAME.
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
  });

  module.exports = pool;