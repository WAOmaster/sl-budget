// Firebase Cloud Functions for Budget Buddy SMS Gateway
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Sri Lankan Bank SMS Patterns - Updated for real SMS formats
const SMS_PATTERNS = {
  // Commercial Bank
  COMBANK: {
    purchase: /Purchase at (.+?) for LKR ([\d,]+\.?\d*)/i,
    creditCard: /Purchase at (.+?) for LKR ([\d,]+\.?\d*).*?credit card #(\d+).*?AVL BAL ([\d,]+\.?\d*)/i,
    atm: /ATM withdrawal.*?LKR ([\d,]+\.?\d*)/i,
    transfer: /Transfer of LKR ([\d,]+\.?\d*)/i,
  },
  // Seylan Bank
  SEYLAN: {
    purchase: /spent LKR\s*([\d,]+\.?\d*)\s*at\s*(.+)/i,
    transfer: /transferred LKR\s*([\d,]+\.?\d*)/i,
  },
  // HNB
  HNB: {
    purchase: /debited by LKR\s*([\d,]+\.?\d*)/i,
    credit: /credited.*?LKR\s*([\d,]+\.?\d*)/i,
  },
  // Sampath Bank
  SAMPATH: {
    purchase: /Purchase.*?LKR\s*([\d,]+\.?\d*)/i,
    debit: /debited.*?LKR\s*([\d,]+\.?\d*)/i,
  },
  // FriMi / Nations Trust
  FRIMI: {
    purchase: /spent Rs\.?\s*([\d,]+\.?\d*)/i,
    transfer: /sent Rs\.?\s*([\d,]+\.?\d*)/i,
    received: /received Rs\.?\s*([\d,]+\.?\d*)/i,
  },
  // Dialog / Mobitel
  DIALOG: {
    recharge: /recharged.*?Rs\.?\s*([\d,]+\.?\d*)/i,
    payment: /payment.*?Rs\.?\s*([\d,]+\.?\d*)/i,
  },
  // Utility bills
  LECO: { bill: /bill.*?Rs\.?\s*([\d,]+\.?\d*)/i },
  CEB: { bill: /bill.*?Rs\.?\s*([\d,]+\.?\d*)/i },
  NWSDB: { bill: /water.*?Rs\.?\s*([\d,]+\.?\d*)/i },
};

// Category mapping
const CATEGORY_MAP = {
  purchase: "shopping",
  creditCard: "shopping", 
  atm: "cash",
  transfer: "transfer",
  bill: "utilities",
  recharge: "mobile",
  payment: "bill_payment",
  received: "income",
  credit: "income",
  debit: "expense",
};

// Parse SMS message
function parseSMS(message, sender) {
  const result = {
    type: "expense",
    category: "uncategorized",
    amount: 0,
    merchant: null,
    bank: sender,
    cardLast4: null,
    balance: null,
    parsed: false,
  };

  // Normalize sender (remove numbers, get bank name)
  const bankName = sender.replace(/[0-9\s\-]/g, "").toUpperCase();
  
  // Try specific bank patterns first
  const patterns = SMS_PATTERNS[bankName] || {};
  
  for (const [txType, pattern] of Object.entries(patterns)) {
    const match = message.match(pattern);
    if (match) {
      result.parsed = true;
      result.category = CATEGORY_MAP[txType] || txType;
      
      // Handle different pattern capture groups
      if (txType === "creditCard") {
        // Credit card purchase with balance
        result.merchant = match[1]?.trim();
        result.amount = parseFloat(match[2].replace(/,/g, ""));
        result.cardLast4 = match[3];
        result.balance = parseFloat(match[4].replace(/,/g, ""));
      } else if (txType === "purchase" && match[2]) {
        // Purchase with merchant first, amount second
        result.merchant = match[1]?.trim();
        result.amount = parseFloat(match[2].replace(/,/g, ""));
      } else if (match[1]) {
        // Amount only patterns
        result.amount = parseFloat(match[1].replace(/,/g, ""));
        if (match[2]) result.merchant = match[2]?.trim();
      }
      
      // Set type based on category
      if (["income", "received", "credit"].includes(result.category)) {
        result.type = "income";
      } else if (result.category === "transfer") {
        result.type = "transfer";
      } else {
        result.type = "expense";
      }
      
      break;
    }
  }

  // Fallback: extract any LKR/Rs amount if no pattern matched
  if (!result.parsed || result.amount === 0) {
    const amountMatch = message.match(/(?:LKR|Rs\.?)\s*([\d,]+\.?\d*)/i);
    if (amountMatch) {
      result.amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      result.parsed = true;
    }
    
    // Try to extract merchant from "Purchase at X" or "at X"
    const merchantMatch = message.match(/(?:Purchase at|at)\s+([A-Za-z0-9\s\(\)]+?)(?:\s+for|\s+LKR|\s+Rs)/i);
    if (merchantMatch) {
      result.merchant = merchantMatch[1].trim();
      result.category = "shopping";
      result.type = "expense";
    }
    
    // Extract card number if present
    const cardMatch = message.match(/card\s*#?(\d{4})/i);
    if (cardMatch) result.cardLast4 = cardMatch[1];
    
    // Extract balance if present
    const balMatch = message.match(/(?:AVL\s*BAL|Balance)[:\s]*([\d,]+\.?\d*)/i);
    if (balMatch) result.balance = parseFloat(balMatch[1].replace(/,/g, ""));
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
        cardLast4: parsed.cardLast4,
        balance: parsed.balance,
        rawMessage: message,
        timestamp: admin.firestore.Timestamp.fromDate(
          receivedAt ? new Date(receivedAt) : new Date()
        ),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Remove null values
      Object.keys(transaction).forEach(k => transaction[k] == null && delete transaction[k]);

      const docRef = await db.collection("transactions").add(transaction);
      return res.json({ 
        status: "success", 
        transactionId: docRef.id, 
        parsed: parsed 
      });
    }

    return res.json({ status: "skipped", message: "No amount found", parsed });
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
    let query = db.collection("transactions").orderBy("createdAt", "desc");
    
    if (type) query = query.where("type", "==", type);
    if (category) query = query.where("category", "==", category);
    query = query.limit(parseInt(queryLimit));

    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return res.json({ success: true, count: transactions.length, transactions });
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
      totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: snapshot.size,
      byCategory: {}, bySource: {},
    };

    snapshot.forEach(doc => {
      const t = doc.data();
      if (t.type === "income") stats.totalIncome += t.amount || 0;
      else stats.totalExpense += t.amount || 0;
      stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + (t.amount || 0);
      const src = t.source === "sms" ? t.bank : t.source;
      stats.bySource[src] = (stats.bySource[src] || 0) + 1;
    });

    stats.balance = stats.totalIncome - stats.totalExpense;
    return res.json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
