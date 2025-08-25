import express from express;
import cors from cors;
import dotenv from dotenv;
import mongoose from mongoose;

dotenv.config();

const app = express();

app.use(express.json({limit : '30mb'}))
app.use(cors({origin : process.env.CLIENT_ORIGIN}));

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => console.log("Mongoose error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`server running on port: ${PORT}`)
);