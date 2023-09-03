process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let cassandra = require('cassandra-driver');
let authProvider = new cassandra.auth.PlainTextAuthProvider('diegoupb', 'wWkEtiK9t5tAHCvkngPW7FZH0ptyPYt0la0zZSdbDdpA7svs02vnVadW4uMW5EJGgYlwGzER0sZTACDbmChZ1g==');
let client = new cassandra.Client({
    contactPoints: ['diegoupb.cassandra.cosmos.azure.com:10350'],
    keyspace: 'tasklink',
    localDataCenter: "West US",
    authProvider: authProvider,
    sslOptions: {
        rejectUnauthorized: false
    }
});

client.connect().then(() => {
    console.log("conectado")
}).catch((err) => {
    console.log(err)
})