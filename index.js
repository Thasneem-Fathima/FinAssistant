const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({
    origin: '*', // For development. You can restrict to 127.0.0.1:5500 if needed
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static("public")); 
require("dotenv").config(); 

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const FINANCIAL_ASSISTANT_PROMPT = `
You are a Financial Assistant AI designed to provide investment guidance in India.
Your primary goal is to help users understand financial concepts and make informed investment decisions.
- Use simple language for beginners and advanced terms for experienced investors.
- Follow SEBI and RBI guidelines.
- Do not provide direct stock tips or unverified predictions.

### User Profile:
- Risk Appetite: Low/Medium/High
- Investment Goals: Short-term (1-3 years), Mid-term (3-7 years), Long-term (7+ years)
- Preferences: Mutual Funds, Stocks, Fixed Deposits, Real Estate, SIPs
- Regulations: Comply with SEBI, RBI, and Indian tax laws.

### Response Format:
- **Financial Advice**: Provide investment strategies based on risk and goals.
- **Regulation Compliance**: Ensure investments follow Indian financial laws.
- **Market Insights**: Offer general market trends but NO stock-specific buy/sell recommendations.

**Now, answer the user's query.**
`;

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: `${FINANCIAL_ASSISTANT_PROMPT}\nUser: ${userMessage}` }] }],
        });

        const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process that.";
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Deploy as Firebase Function
// exports.api = functions.https.onRequest(app);
const PORT = 5001;
app.listen(PORT, () => {
console.log(`Server running locally on http://localhost:${PORT}`);
});
