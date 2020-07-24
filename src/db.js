import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.ATLAS_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.once("open", () => console.log("❤️ Connected to DB!"))
db.on("error", error => console.log(`❌ Error on DB Connection : ${error}`))