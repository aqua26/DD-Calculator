const express = require('express');
const app = express();
const PORT = 3000;

// Flight position table for 1m and 3m springboards
const flightPositionTable1m3m = {
    "0-1": {
        "C": { "Fwd": 0.1, "Back": 0.1, "Rev": 0.1, "Inw": -0.3 },
        "B": { "Fwd": 0.2, "Back": 0.2, "Rev": 0.2, "Inw": -0.2 },
        "A": { "Fwd": 0.3, "Back": 0.3, "Rev": 0.3, "Inw": 0.1 },
        "D": { "Fwd": 0.1, "Back": 0.1, "Rev": 0.1, "Inw": -0.1 },
        "E": { "Fwd": 0.2, "Back": 0.1, "Rev": 0.1, "Inw": 0.4 }
    },
    "1.5-2": {
        "C": { "Fwd": 0, "Back": 0, "Rev": 0, "Inw": 0.1 },
        "B": { "Fwd": 0.1, "Back": 0.3, "Rev": 0.3, "Inw": 0.3 },
        "A": { "Fwd": 0.4, "Back": 0.5, "Rev": 0.6, "Inw": 0.8 },
        "D": { "Fwd": 0, "Back": -0.1, "Rev": -0.1, "Inw": 0.2 },
        "E": { "Fwd": 0.2, "Back": 0.2, "Rev": 0.2, "Inw": 0.5 }
    },
    "2.5": {
        "C": { "Fwd": 0, "Back": 0.1, "Rev": 0, "Inw": 0.2 },
        "B": { "Fwd": 0.2, "Back": 0.3, "Rev": 0.2, "Inw": 0.5 },
        "A": { "Fwd": 0.5, "Back": 0.7, "Rev": 0.6, "Inw": null },
        "D": { "Fwd": 0, "Back": -0.2, "Rev": -0.2, "Inw": 0.4 },
        "E": { "Fwd": 0.3, "Back": 0.3, "Rev": 0.3, "Inw": 0.7 }
    },
    "3-3.5": {
        "C": { "Fwd": 0, "Back": 0, "Rev": 0, "Inw": 0.3 },
        "B": { "Fwd": 0.3, "Back": 0.3, "Rev": 0.3, "Inw": 0.6 },
        "A": { "Fwd": null, "Back": null, "Rev": null, "Inw": null },
        "D": { "Fwd": null, "Back": null, "Rev": null, "Inw": null },
        "E": { "Fwd": 0.4, "Back": null, "Rev": null, "Inw": null }
    },
    "4-4.5": {
        "C": { "Fwd": 0, "Back": 0.1, "Rev": 0.2, "Inw": 0.4 },
        "B": { "Fwd": 0.4, "Back": 0.4, "Rev": 0.5, "Inw": 0.8 },
        "A": { "Fwd": null, "Back": null, "Rev": null, "Inw": null },
        "D": { "Fwd": null, "Back": null, "Rev": null, "Inw": null },
        "E": { "Fwd": null, "Back": null, "Rev": null, "Inw": null }
    }
};

// Flight position table for high boards (5m, 7.5m, 10m)
const flightPositionTableHighBoard = {
    "0-1": {
        "C": { "Fwd": 0.1, "Back": 0.1, "Rev": 0.1, "Inw": -0.3, "Arm": 0.1 },
        "B": { "Fwd": 0.2, "Back": 0.2, "Rev": 0.2, "Inw": -0.2, "Arm": 0.3 },
        "A": { "Fwd": 0.3, "Back": 0.3, "Rev": 0.3, "Inw": 0.1, "Arm": 0.4 },
        "D": { "Fwd": 0.1, "Back": 0.1, "Rev": 0.1, "Inw": -0.1, "Arm": 0.1 },
        "E": { "Fwd": 0.2, "Back": 0.1, "Rev": 0.1, "Inw": 0.4, "Arm": null }
    },
    "1.5-2": {
        "C": { "Fwd": 0, "Back": 0, "Rev": 0, "Inw": 0.1, "Arm": 0.1 },
        "B": { "Fwd": 0.1, "Back": 0.3, "Rev": 0.3, "Inw": 0.3, "Arm": 0.3 },
        "A": { "Fwd": 0.4, "Back": 0.5, "Rev": 0.6, "Inw": 0.8, "Arm": 0.5 },
        "D": { "Fwd": 0, "Back": -0.1, "Rev": -0.1, "Inw": 0.2, "Arm": 0.1 },
        "E": { "Fwd": 0.2, "Back": 0.2, "Rev": 0.2, "Inw": 0.5, "Arm": null }
    },
    "2.5": {
        "C": { "Fwd": 0, "Back": 0.1, "Rev": 0, "Inw": 0.2, "Arm": 0.1 },
        "B": { "Fwd": 0.2, "Back": 0.3, "Rev": 0.2, "Inw": 0.5, "Arm": 0.4 },
        "A": { "Fwd": 0.5, "Back": 0.7, "Rev": 0.6, "Inw": null, "Arm": null },
        "D": { "Fwd": 0, "Back": -0.2, "Rev": -0.2, "Inw": 0.4, "Arm": 0.2 },
        "E": { "Fwd": 0.3, "Back": 0.3, "Rev": 0.3, "Inw": 0.7, "Arm": null }
    },
    "3-3.5": {
        "C": { "Fwd": 0, "Back": 0, "Rev": 0, "Inw": 0.3, "Arm": 0.2 },
        "B": { "Fwd": 0.3, "Back": 0.3, "Rev": 0.3, "Inw": 0.6, "Arm": 0.4 },
        "A": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "D": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "E": { "Fwd": 0.4, "Back": null, "Rev": null, "Inw": null, "Arm": null }
    },
    "4-4.5": {
        "C": { "Fwd": 0, "Back": 0.1, "Rev": 0.2, "Inw": 0.4, "Arm": 0.3 },
        "B": { "Fwd": 0.4, "Back": 0.4, "Rev": 0.5, "Inw": 0.7, "Arm": 0.5 },
        "A": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "D": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "E": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null }
    },
    "5.5": {
        "C": { "Fwd": 0, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "B": { "Fwd": 0.5, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "A": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "D": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null },
        "E": { "Fwd": null, "Back": null, "Rev": null, "Inw": null, "Arm": null }
    }
};

// Function to get the somersault range from the dive number
function getSomersaultRange(diveNumber) {
    const thirdDigit = parseInt(diveNumber.toString()[2]);
    const somersaults = thirdDigit / 2;

    if (somersaults <= 1) return "0-1";
    if (somersaults <= 2) return "1.5-2";
    if (somersaults === 2.5) return "2.5";
    if (somersaults <= 3.5) return "3-3.5";
    if (somersaults <= 4.5) return "4-4.5";
    if (somersaults === 5.5) return "5.5";

    return null; // If somersaults are not in a valid range
}

// Function to get the dive type from the dive number
function getDiveType(diveNumber) {
    const firstDigit = parseInt(diveNumber.toString()[0]);
    switch (firstDigit) {
        case 1: return "Fwd";
        case 2: return "Back";
        case 3: return "Rev";
        case 4: return "Inw";
        case 6: return "Arm"; // For high boards
        default: return null;
    }
}

// Function to get Component B from the flight position table
function getComponentB(diveNumber, position, height) {
    const somersaultRange = getSomersaultRange(diveNumber);
    const diveType = getDiveType(diveNumber);

    if (!somersaultRange || !diveType) return 'Invalid dive number';

    const flightTable = ["1m", "3m"].includes(height) ? flightPositionTable1m3m : flightPositionTableHighBoard;
    const componentB = flightTable[somersaultRange] && flightTable[somersaultRange][position] ? flightTable[somersaultRange][position][diveType] : null;

    return componentB !== null ? componentB : 'Invalid position or height';
}

// Route to handle dive number, position, and height input
app.get('/:diveNumber/:position/:height', (req, res) => {
    const diveNumber = req.params.diveNumber;
    const position = req.params.position.toUpperCase();
    const height = req.params.height;

    const componentB = getComponentB(diveNumber, position, height);
    res.send(`Component B for dive ${diveNumber} at ${height} in ${position} position is: ${componentB}`);
});

// Export the function for use in other files
module.exports = getComponentB;

// Start the server
/*
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/