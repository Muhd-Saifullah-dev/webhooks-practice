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

const port = process.env.PORT || 3001;
type Event = "purchase" | "lesson completed";
type Webhook = {
  id: string;
  url: string;
  token: string;
  event: Event;
};
type Payload = {
  id: string;
  name: string;
  email: string;
  course: string;
};
const db: Webhook[] = [];
app.post("/api/register-webhook", (req, res) => {
  const { url, token, event } = req.body;
  db.push({
    id: Date.now().toString(),
    url,
    token,
    event,
  });
  console.log("DB", db);
  return res.json({ message: "OK" });
});

app.post("/api/purchase", (req, res) => {
  const { name, email, course } = req.body;
  // initial purchase process

  const payload: Payload = {
    id: Date.now().toString(),
    name,
    email,
    course,
  };

  // sending webhooks
  const webhooks = db.filter((webhook) => webhook.event === "purchase");

  sendWebhooks(webhooks, payload).then(()=>console.log("webhook sent !"));
  return res.json({ message: "course purchase successful !" });
});

async function sendWebhooks(webhooks: Webhook[], payload: Payload) {
  // todo implement handle error implement retry mechanism

  for (const webhook of webhooks) {
    let attempts = 0;
    let maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-Webhook-token": webhook.token,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`Response not OK (${response.status})`);
        }

        console.log(`webhook sent to ${webhook.url}`);
        break;
      } catch (error) {
        console.error(
          `❌ Attempt ${attempts} failed for ${webhook.url}:`,
          (error as Error).message
        );

        if (attempts < maxAttempts) {
          const delay = 1000 * Math.pow(2, attempts);
          console.log(`⏳ Retrying in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error(`🚫 Webhook permanently failed: ${webhook.url}`);
        }
      }
    }
  }
}

app.listen(port, () => console.log(`LMS server is running on port :: ${port}`));
