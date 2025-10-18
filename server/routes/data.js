const express = require('express');
const router = express.Router();

// Import Models
const Expense = require('../models/Expense');
const UserCategory = require('../models/UserCategory');
const Budget = require('../models/Budget');
const GlobalState = require('../models/GlobalState');
const { getIconForCategory } = require('../services/geminiService');

const ICON_KEYS = ['groceries', 'transport', 'housing', 'entertainment', 'health', 'education', 'other'];

// --- Helper to initialize data ---
async function initializeData() {
    const categoryCount = await UserCategory.countDocuments();
    if (categoryCount === 0) {
        console.log('Initializing default categories...');
        const defaultCategories = [
            { name: 'Groceries', icon: 'groceries' },
            { name: 'Transport', icon: 'transport' },
            { name: 'Housing', icon: 'housing' },
            { name: 'Entertainment', icon: 'entertainment' },
            { name: 'Health', icon: 'health' },
            { name: 'Education', icon: 'education' },
            { name: 'Other', icon: 'other' },
        ];
        await UserCategory.insertMany(defaultCategories);
    }
    const state = await GlobalState.findOne();
    if (!state) {
        console.log('Initializing global state...');
        await GlobalState.create({ monthlyBudget: 100000, archivedSpend: 0 });
    }
}
initializeData();


// --- Global State Routes ---
router.get('/state', async (req, res) => {
    try {
        const state = await GlobalState.findOne();
        res.json(state);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/state', async (req, res) => {
    try {
        const { monthlyBudget, archivedSpend } = req.body;
        const state = await GlobalState.findOneAndUpdate({}, { monthlyBudget, archivedSpend }, { new: true, upsert: true });
        res.json(state);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- Expense Routes ---
router.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses.map(e => ({...e.toObject(), id: e._id })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/expenses', async (req, res) => {
    const expense = new Expense(req.body);
    try {
        const newExpense = await expense.save();
        res.status(201).json({...newExpense.toObject(), id: newExpense._id});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/expenses/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({...updatedExpense.toObject(), id: updatedExpense._id});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/expenses/reset', async (req, res) => {
    try {
        const state = await GlobalState.findOne();
        const expenses = await Expense.find();
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) + state.archivedSpend;
        const newMonthlyBudget = Math.max(0, state.monthlyBudget - totalExpenses);
        
        await Expense.deleteMany({});
        const updatedState = await GlobalState.findOneAndUpdate({}, { monthlyBudget: newMonthlyBudget, archivedSpend: 0 }, { new: true });
        
        res.json(updatedState);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Category Routes ---
router.get('/categories', async (req, res) => {
    try {
        const categories = await UserCategory.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/categories', async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await UserCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const icon = await getIconForCategory(name, ICON_KEYS);
        const category = new UserCategory({ name, icon });
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/categories/:name', async (req, res) => {
    try {
        const categoryName = req.params.name;
        await UserCategory.deleteOne({ name: categoryName });
        await Budget.deleteOne({ category: categoryName });
        await Expense.deleteMany({ category: categoryName });
        res.json({ message: 'Category and associated data deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- Budget Routes ---
router.get('/budgets', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/budgets', async (req, res) => {
    try {
        const { category, amount } = req.body;
        const updatedBudget = await Budget.findOneAndUpdate(
            { category },
            { amount },
            { new: true, upsert: true }
        );
        res.status(201).json(updatedBudget);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;
