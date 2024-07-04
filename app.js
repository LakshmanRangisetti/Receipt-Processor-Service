// Importing the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // this is to generate unique IDs

// Creating the Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());


const receipts = {};

// Endpoint to process receipts and return an ID
app.post('/receipts/process', (req, res) => {
    const receipt = req.body;

    // Validate receipt
    const validationError = validateReceipt(receipt);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const id = uuidv4(); // Generate a unique ID for the receipt
    receipts[id] = receipt;
    res.json({ id });
});

// Endpoint to get points for a receipt by ID
app.get('/receipts/:id/points', (req, res) => {
    const { id } = req.params;
    const receipt = receipts[id];
    if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found' });
    }
    const points = calculatePoints(receipt);
    res.json({ points });
});

// Function to calculate points based on receipt data
function calculatePoints(receipt) {
    let points = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name
    const alphanumericCount = receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;
    points += alphanumericCount;

    // Rule 2: 50 points if the total is a round dollar amount with no cents
    if (parseFloat(receipt.total) === Math.floor(parseFloat(receipt.total))) {
        points += 50;
    }

    // Rule 3: 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
        points += 25;
    }

    // Rule 4: 5 points for every two items on the receipt
    const itemPairs = Math.floor(receipt.items.length / 2) * 5;
    points += itemPairs;

    // Rule 5: If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer.
    // The result is the number of points earned.
    receipt.items.forEach(item => {
        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength % 3 === 0) {
            const price = parseFloat(item.price);
            const itemPoints = Math.ceil(price * 0.2);
            points += itemPoints;
        }
    });

    // Rule 6: 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    const day = purchaseDate.getUTCDate(); // Use getUTCDate to ensure the correct day
    if (day % 2 !== 0) {
        points += 6;
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const [hours, minutes] = receipt.purchaseTime.split(':').map(Number);
    if (hours >= 14 && hours < 16) {
        points += 10;
    }

    return points;
}

// Function to validate receipt data
function validateReceipt(receipt) {
    if (typeof receipt.retailer !== 'string' || !receipt.retailer.trim()) {
        return 'Invalid retailer name';
    }
    if (isNaN(Date.parse(receipt.purchaseDate))) {
        return 'Invalid purchase date';
    }
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(receipt.purchaseTime)) {
        return 'Invalid purchase time';
    }
    if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
        return 'Invalid items';
    }
    for (const item of receipt.items) {
        if (typeof item.shortDescription !== 'string' || !item.shortDescription.trim()) {
            return 'Invalid item description';
        }
        if (typeof item.price !== 'string' || isNaN(parseFloat(item.price))) {
            return 'Invalid item price';
        }
    }
    if (typeof receipt.total !== 'string' || isNaN(parseFloat(receipt.total))) {
        return 'Invalid total';
    }
    return null;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
