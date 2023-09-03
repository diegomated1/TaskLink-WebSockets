import cassandra, { Client } from "cassandra-driver";

export default class ChatDatabase{

    client: Client

    constructor(){
        let user = process.env.CASSANDRA_USER!;
        let password = process.env.CASSANDRA_PASSWORD!;
        let contactPoint = process.env.CASSANDRA_CONTACTPOINT!;
        let localDataCenter = process.env.CASSANDRA_DATACENTER!;

        const authProvider = new cassandra.auth.PlainTextAuthProvider(user, password);
        this.client = new Client({
            contactPoints: [contactPoint],
            localDataCenter,
            keyspace: "TaskLink",
            authProvider
        });
    }

    connect(){
        this.client.connect().then(()=>{
            console.log("Cassandra connected");
        }).catch((err:Error)=>{
            console.log("Cannot connect to cassandra: ", err.name);
        })
    }
}