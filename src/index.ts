import express,{Request,Response} from "express";
import cors from  "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
mongoose.connect(process.env.MONGO_CONFIG as string)
.then(()=> console.log("Connected to Database!"));

const app = express();

const PORT = 7000
app.use(cors());
app.use(express.json());
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoute);


app.listen(PORT, ()=>{
    console.log(`Server Started @ ${PORT}`)
})
