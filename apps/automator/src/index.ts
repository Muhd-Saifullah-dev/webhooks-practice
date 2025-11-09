import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["POST", "GET", "OPTIONS"],
  })
);

app.use(express.json());

const port = process.env.PORT || 3000;

// type Payload = {
//   id: string;
//   name: string;
//   email: string;
//   course: string;
// };

// app.post("/api/register-webhook", (req, res) => {
//   const { url, token, event } = req.body;
//   db.push({
//     id: Date.now().toString(),
//     url,
//     token,
//     event,
//   });
//   console.log("DB", db);
//   return res.json({ message: "OK" });
// });




app.listen(port, () => console.log(`Automator server is running on port :: ${port}`));
