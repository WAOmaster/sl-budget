// Firebase Cloud Functions for Budget Buddy SMS Gateway
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Sri Lankan Bank SMS Patterns
const SMS_PATTERNS = {
  COMBANK: {
    purchase: /Purchase at (.+?) for LKR ([\d,]+\.?\d*)/i,
    atm: /ATM withdrawal.+?LKR ([\d,]+\.?\d*)/i,
    transfer: /Transfer of LKR ([\d,]+\.?\d*)/i,
  },
  SEYLAN: {
    purchase: /spent LKR\s*([\d,]+\.?\d*)\s*at\s*(.+)/i,
    transfer: /transferred LKR\s*([\d,]+\.?\d*)/i,
  },
  HNB: {
    purchase: /debited by LKR\s*([\d,]+\.?\d*)/i,
    credit: /credited.+?LKR\s*([\d,]+\.?\d*)/i,
  },
  SAMPATH: {
    purchase: /Purchase.*?LKR\s*([\d,]+\.?\d*)/i,
  },
  FRIMI: {
    purchase: /spent Rs\.\s*([\d,]+\.?\d*)/i,
    transfer: /sent Rs\.\s*([\d,]+\.?\d*)/i,
    received: /received Rs\.\s*([\d,]+\.?\d*)/i,
  },
};

// Parse SMS message
function parseSMS(message, sender) {
  const result = {
    type: "expense",
    category: "other",
    amount: 0,
    merchant: null,
    bank: sender,
    parsed: false,
  };

  const patterns = SMS_PATTERNS[sender] || SMS_PATTERNS.COMBANK;

  for (const [category, pattern] of Object.entries(patterns)) {
    const match = message.match(pattern);
    if (match) {
      result.parsed = true;
      result.category = category;
      
      if (category === "purchase" && match[2]) {
        result.merchant = match[1]?.trim();
        result.amount = parseFloat(match[2].replace(/,/g, ""));
      } else if (match[1]) {
        result.amount = parseFloat(match[1].replace(/,/g, ""));
      }
      
      if (category === "received" || category === "credit" || category === "salary") {
        result.type = "income";
      }
      break;
    }
  }

  // Fallback: extract any amount
  if (!result.parsed) {
    const amountMatch = message.match(/(?:LKR|Rs\.?)\s*([\d,]+\.?\d*)/i);
    if (amountMatch) {
      result.amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      result.parsed = true;
    }
  }

  return result;
}

// SMS Webhook - receives from SMS Gateway app
exports.smsWebhook = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, phoneNumber, receivedAt } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const parsed = parseSMS(message, phoneNumber || "UNKNOWN");
    
    if (parsed.amount > 0) {
      const transaction = {
        source: "sms",
        type: parsed.type,
        category: parsed.category,
        amount: parsed.amount,
        currency: "LKR",
        merchant: parsed.merchant,
        bank: parsed.bank,
        rawMessage: message,
        timestamp: admin.firestore.Timestamp.fromDate(
          receivedAt ? new Date(receivedAt) : new Date()
        ),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection("transactions").add(transaction);
      return res.json({ success: true, transactionId: docRef.id, ...parsed });
    }

    return res.json({ success: false, message: "Could not parse transaction" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get transactions API
exports.getTransactions = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  
  try {
    const { limit: queryLimit = 50, type, category } = req.query;
    let query = db.collection("transactions").orderBy("timestamp", "desc");
    
    if (type) query = query.where("type", "==", type);
    if (category) query = query.where("category", "==", category);
    query = query.limit(parseInt(queryLimit));

    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return res.json({ transactions, count: transactions.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get statistics API
exports.getStats = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  
  try {
    const snapshot = await db.collection("transactions").get();
    const stats = {
      totalIncome: 0, totalExpenses: 0, count: snapshot.size,
      byCategory: {}, bySource: {},
    };

    snapshot.forEach(doc => {
      const t = doc.data();
      if (t.type === "income") stats.totalIncome += t.amount || 0;
      else stats.totalExpenses += t.amount || 0;
      stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + (t.amount || 0);
      stats.bySource[t.source] = (stats.bySource[t.source] || 0) + 1;
    });

    stats.netBalance = stats.totalIncome - stats.totalExpenses;
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
