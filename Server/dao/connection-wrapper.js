const mySQL = require('mysql2');
// The connection data to the DB
const connection = mySQL.createConnection({
    host: "eu-cdbr-west-01.cleardb.com",
    user: "b3b38873d89e36",
    password: "268448d1",
    database: "heroku_068a832144574ef",
    multipleStatements: true
});

// Connect to the database: 
connection.connect(error => {
    if (error) {
        console.log("Failed to create connection + " + error);
        return;
    }
    console.log("We're connected to MySQL");
});


// One function for executing select / insert / update / delete: 
function execute(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

function executeWithParameters(sql, parameters) {
    return new Promise((resolve, reject) => {
        connection.query(sql, parameters, (err, result) => {
            if (err) {
                console.log("Failed interacting with DB, calling reject");
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

// This one added by adar to keep connection alive after deployment because if server didnt communicate in a few hours it will kill connection
setInterval(function () {
    try {
        connection.execute('SELECT 1 FROM users');
    }

    catch(error){
        console.log("\n\n\n\n\n\n\n\nCONNECTION TO DB LOSTTTTTT!!!!\n\n\n\n\n\n\n\n");
        throw new error;
    }
    
}, 5000);



module.exports = {
    execute,
    executeWithParameters
};
