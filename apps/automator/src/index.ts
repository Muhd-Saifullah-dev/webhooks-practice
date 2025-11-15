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

app.post("/webhook", (req, res) => {

console.log("headers ",req.headers);


 const token = req.headers["x-webhook-token"]; // lowercase!

  if (token !== "someSecret") {
    return res.status(401).json({ message: "token is mismatch" });
  }


const {id,name,email,course}=req.body
  // console.log("body",req.body)
  //create dsicord invite
  // send email to the student

  console.log(`Invite sent to ${name} on ${email} for course ${course}`)

  return res.json({ message: "OK" });
});




app.listen(port, () => console.log(`Automator server is running on port :: ${port}`));
