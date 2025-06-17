import { db } from "../config/db.js";
  
export async function getTransactionsByuserId(req, res) {
  try {
    const { user_id } = req.params;
    const result = await db.query(`
      SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC
      `, [user_id]);
    res.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createTransaction (req, res){
  try {
    const { user_id, title, amount, category } = req.body;

    // Validate required fields
    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ 
        error: "All fields are required",
        received: { user_id, title, amount, category }
      });
    }

    // Validate amount is a number
    if (isNaN(amount)) {
      return res.status(400).json({ 
        error: "Amount must be a number",
        received: amount 
      });
    }

    console.log('Attempting to insert transaction with values:', { user_id, title, amount, category });

    const result = await db.query(`
      INSERT INTO transactions 
        (user_id, title, amount, category) 
      VALUES 
        ($1, $2, $3, $4) 
      RETURNING *
    `, [user_id, title, amount, category]);

    console.log('Query result:', result);

    if (!result || result.length === 0) {
      console.error('Database query returned no rows');
      throw new Error('No data returned from insert');
    }

    console.log('Created transaction:', result[0]);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export async function deleteTransaction (req, res) {
  try {
    const { id } = req.params;

    if(isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const result = await db.query(`
      DELETE FROM transactions WHERE id = $1
      RETURNING *
    `, [id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ 
      message: "Transaction deleted successfully",
      deletedTransaction: result[0]
    });
    
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTransactionSummary (req, res) {
  try {
    const { user_id } = req.params;
    const balanceResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions 
      WHERE user_id = $1
    `, [user_id]);

    const incomeResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions 
      WHERE user_id = $1 AND amount > 0
    `, [user_id]);

    const expenseResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions 
      WHERE user_id = $1 AND amount < 0
    `, [user_id]);

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });
    
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}