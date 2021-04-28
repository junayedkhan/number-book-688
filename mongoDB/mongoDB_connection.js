const mongoose = require("mongoose")
const uri = "mongodb+srv://junayedkhan:khan_0258@cluster0.4dhi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const mongoDB_connection = async()=>{
    try {
        const connection = await mongoose.connect(uri ,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("mongoDB connected on " + connection.connections[0].host)

    } catch (error) {
        console.log(error);
        process.exit(1)
    }
} 

module.exports = mongoDB_connection;