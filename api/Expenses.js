// api/expenses.js

// Simple in-memory storage for demonstration purposes.
// In a real application, you would connect to a database here.
let expenses = [
  { id: 1, description: "Groceries", amount: 55.50, date: new Date().toISOString() },
  { id: 2, description: "Online Course Subscription", amount: 12.99, date: new Date().toISOString() }
];

let nextId = 3;

export default async function handler(req, res) {
  // Set CORS headers for local development or specific domain access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- GET Request: Fetch all expenses ---
  if (req.method === 'GET') {
    return res.status(200).json(expenses);
  }

  // --- POST Request: Add a new expense ---
  if (req.method === 'POST') {
    const { description, amount } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ error: 'Description and amount are required.' });
    }
    
    // Validate amount is a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
        return res.status(400).json({ error: 'Amount must be a valid number.' });
    }

    const newExpense = {
      id: nextId++,
      description,
      amount: parsedAmount,
      date: new Date().toISOString(),
    };

    expenses.push(newExpense);
    return res.status(201).json(newExpense);
  }

  // --- Handle unsupported methods ---
  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
