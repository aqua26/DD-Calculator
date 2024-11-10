const express = require('express');
const app = express();
const PORT = 3000;

// Somersaults DD tables for different board heights
const ddTable1m3m = {
    "0": { "1m": 0.9, "3m": 1.0 },
    "0.5": { "1m": 1.1, "3m": 1.3 },
    "1": { "1m": 1.2, "3m": 1.3 },
    "1.5": { "1m": 1.6, "3m": 1.5 },
    "2": { "1m": 2.0, "3m": 1.8 },
    "2.5": { "1m": 2.4, "3m": 2.2 },
    "3": { "1m": 2.7, "3m": 2.3 },
    "3.5": { "1m": 3.0, "3m": 2.8 },
    "4": { "1m": 3.3, "3m": 2.9 },
    "4.5": { "1m": 3.8, "3m": 3.5 }
};

const ddTable5m7m10m = {
    "0": { "5m": 0.9, "7.5m": 1.0, "10m": 1.0 },
    "0.5": { "5m": 1.1, "7.5m": 1.3, "10m": 1.3 },
    "1": { "5m": 1.2, "7.5m": 1.3, "10m": 1.4 },
    "1.5": { "5m": 1.6, "7.5m": 1.5, "10m": 1.5 },
    "2": { "5m": 2.0, "7.5m": 1.8, "10m": 1.9 },
    "2.5": { "5m": 2.4, "7.5m": 2.2, "10m": 2.1 },
    "3": { "5m": 2.7, "7.5m": 2.3, "10m": 2.5 },
    "3.5": { "5m": 3.0, "7.5m": 2.8, "10m": 2.7 },
    "4": { "5m": 3.3, "7.5m": 3.5, "10m": 3.5 },
    "4.5": { "5m": null, "7.5m": 3.5, "10m": 3.5 },
    "5.5": { "5m": null, "7.5m": null, "10m": 4.5 }
};

// Function to get somersaults from the dive number
function getSomersaults(diveNumber) {
    const diveString = diveNumber.toString();
    const thirdDigit = parseInt(diveString[2]);
    if (thirdDigit === 0) return "0";
    return (thirdDigit / 2).toString();
}

// Function to get Component A DD from tables
function getDDComponentA(diveNumber, height) {
    const somersaults = getSomersaults(diveNumber);
    let ddValue;

    if (["1m", "3m"].includes(height)) {
        ddValue = ddTable1m3m[somersaults] ? ddTable1m3m[somersaults][height] : null;
    } else if (["5m", "7.5m", "10m"].includes(height)) {
        ddValue = ddTable5m7m10m[somersaults] ? ddTable5m7m10m[somersaults][height] : null;
    }

    return ddValue !== null ? ddValue : 'Invalid height or somersault value';
}

// Route to handle dive number and height input
app.get('/:diveNumber/:height', (req, res) => {
    const diveNumber = req.params.diveNumber;
    const height = req.params.height;

    const ddComponentA = getDDComponentA(diveNumber, height);
    res.send(`DD Component A for dive ${diveNumber} at ${height} is: ${ddComponentA}`);
});

// Export the function for use in other files
module.exports = getDDComponentA;

/*// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/
