const express = require('express');
const app = express();
const PORT = 3000;

// Function to parse the dive number and extract twists, somersaults, and group type
function parseDiveDetails(diveNumber) {
    if (!diveNumber || typeof diveNumber !== 'string' || diveNumber.length < 3) {
        console.error('Invalid dive number format');
        return null;
    }

    const diveString = diveNumber.toString();
    const firstDigit = parseInt(diveString[0]);
    const groupDigit = parseInt(diveString[1]);
    const somersaultDigit = parseInt(diveString[2]);
    const twistDigit = diveString.length === 4 ? parseInt(diveString[3]) : 0;

    if (isNaN(firstDigit) || isNaN(groupDigit) || isNaN(somersaultDigit) || isNaN(twistDigit)) {
        console.error('Dive number contains non-numeric values');
        return null;
    }

    const twists = twistDigit / 2; // Number of twists (fourth digit)
    const somersaults = somersaultDigit / 2; // Number of half somersaults (third digit)

    let groupType = '';
    if (firstDigit === 5) { // Indicates a twisting dive
        switch (groupDigit) {
            case 1: groupType = 'Forward'; break;
            case 2: groupType = 'Back'; break;
            case 3: groupType = 'Reverse'; break;
            case 4: groupType = 'Inward'; break;
            default:
                console.error('Invalid group type in twisting dive number');
                return null;
        }
    } else if (firstDigit === 6) { // Indicates an armstand dive
        switch (groupDigit) {
            case 1: groupType = 'Arm. Forward'; break;
            case 2: groupType = 'Arm. Back'; break;
            case 3: groupType = 'Arm. Reverse'; break;
            case 4: groupType = 'Arm. Inward'; break;
            default:
                console.error('Invalid group type in armstand dive number');
                return null;
        }
    } else {
        console.error('Invalid dive number for twisting or armstand group');
        return null;
    }

    //console.log(`Parsed details: twists=${twists}, somersaults=${somersaults}, groupType=${groupType}`);
    return { twists, somersaults, groupType };
}

// Function to format the twists value as a string to match the componentCTable keys
function formatTwistsString(twists) {
    if (twists === 0.5) return '1/2 Twist';
    if (twists === 1) return '1 Twist';
    return `${twists} Twists`; // e.g., "1.5 Twists", "2 Twists", etc.
}

// Function to get Component C values for 1m, 3m, and platform dives
function getComponentC(twists, somersaults, groupType, height) {
    const somersaultsKey = Math.round(somersaults * 2) / 2; // Round to nearest 0.5

    // Component C table with values for 1m, 3m, and platforms
    const componentCTable = {
        "1/2 Twist": {
            "1/2-1 Som.": { "Forward": 0.4, "Back": 0.2, "Reverse": 0.2, "Inward": 0.2, "Arm. Forward": 0.4, "Arm. Back": 0.4, "Arm. Reverse": 0.4 },
            "1½-2 Som.": { "Forward": 0.4, "Back": 0.4, "Reverse": 0.4, "Inward": 0.4, "Arm. Forward": 0.5, "Arm. Back": 0.5, "Arm. Reverse": 0.5 },
            "2½ Som.": { "Forward": 0.4, "Back": 0.0, "Reverse": 0.0, "Inward": 0.2, "Arm. Forward": 0.5, "Arm. Back": 0.5, "Arm. Reverse": 0.5 },
            "3-3½ Som.": { "Forward": 0.4, "Back": 0.0, "Reverse": 0.0, "Inward": 0.4, "Arm. Forward": 0.4, "Arm. Back": 0.5, "Arm. Reverse": 0.5 }
        },
        "1 Twist": {
            "Any": { "Forward": 0.6, "Back": 0.4, "Reverse": 0.4, "Inward": 0.4, "Arm. Forward": 1.2, "Arm. Back": 1.2, "Arm. Reverse": 1.2 }
        },
        "1½ Twists": {
            "1/2-2 Som.": { "Forward": 0.8, "Back": 0.8, "Reverse": 0.8, "Inward": 0.8, "Arm. Forward": 1.3, "Arm. Back": 1.3, "Arm. Reverse": 1.3 },
            "2½-3½ Som.": { "Forward": 0.8, "Back": 0.7, "Reverse": 0.6, "Inward": 0.8, "Arm. Forward": 1.3, "Arm. Back": 1.3, "Arm. Reverse": 1.3 }
        },
        "2 Twists": {
            "Any": { "Forward": 1.0, "Back": 0.8, "Reverse": 0.8, "Inward": 0.8, "Arm. Forward": 1.5, "Arm. Back": 1.3, "Arm. Reverse": 1.3 }
        },
        "2½ Twists": {
            "1/2-2 Som.": { "Forward": 1.2, "Back": 1.2, "Reverse": 1.2, "Inward": 1.2, "Arm. Forward": 1.7, "Arm. Back": 1.7, "Arm. Reverse": 1.7 },
            "2½-3½ Som.": { "Forward": 1.2, "Back": 1.1, "Reverse": 1.0, "Inward": 1.2, "Arm. Forward": 1.7, "Arm. Back": 1.7, "Arm. Reverse": 1.7 }
        },
        "3 Twists": {
            "Any": { "Forward": 1.5, "Back": 1.4, "Reverse": 1.4, "Inward": 1.5, "Arm. Forward": 1.9, "Arm. Back": 1.9, "Arm. Reverse": 1.9 }
        },
        "3½ Twists": {
            "Any": { "Forward": 1.6, "Back": 1.7, "Reverse": 1.8, "Inward": 1.6, "Arm. Forward": 2.1, "Arm. Back": 2.1, "Arm. Reverse": 2.1 }
        },
        "4 Twists": {
            "Any": { "Forward": 1.9, "Back": 1.8, "Reverse": 1.8, "Inward": 1.9, "Arm. Forward": 2.3, "Arm. Back": 2.3, "Arm. Reverse": 2.3 }
        },
        "4½ Twists": {
            "1/2-2 Som.": { "Forward": 2.0, "Back": 2.1, "Reverse": 2.1, "Inward": 2.0, "Arm. Forward": 2.5, "Arm. Back": 2.5, "Arm. Reverse": 2.5 },
            "2½-3½ Som.": { "Forward": 2.0, "Back": 1.9, "Reverse": 1.9, "Inward": 2.0, "Arm. Forward": 2.5, "Arm. Back": 2.5, "Arm. Reverse": 2.5 }
        }
    };

    let somersaultRange;
    if (somersaultsKey <= 1) {
        somersaultRange = "1/2-1 Som.";
    } else if (somersaultsKey <= 2) {
        somersaultRange = "1½-2 Som.";
    } else if (somersaultsKey === 2.5) {
        somersaultRange = "2½ Som.";
    } else if (somersaultsKey <= 3.5) {
        somersaultRange = "3-3½ Som.";
    } else {
        somersaultRange = "Any";
    }

    const twistKey = formatTwistsString(twists);
    //console.log(`Generated somersaultRange: ${somersaultRange}`);
    //console.log(`Twists key: ${twistKey}`);

    if (componentCTable[twistKey]) {
        const twistData = componentCTable[twistKey];
        if (twistData[somersaultRange]) {
            //console.log(`Found data for somersaultRange: ${somersaultRange}`);
            return twistData[somersaultRange][groupType] || 'Invalid group type';
        } else if (twistData["Any"]) {
            //console.log(`Found data for Any somersaults`);
            return twistData["Any"][groupType] || 'Invalid group type';
        }

    } else {
        console.error(`No entry found for twistKey: ${twistKey} in componentCTable`);

    }

    console.error('No matching entry found in componentCTable');
    return 'Invalid input or data not available';
}

// Route to handle dive number and height input for Component C
app.get('/:diveNumber/:height', (req, res) => {
    const diveNumber = req.params.diveNumber;
    const height = req.params.height;

    const details = parseDiveDetails(diveNumber);
    if (!details) {
        return res.send('Invalid dive number');
    }

    const { twists, somersaults, groupType } = details;

    const componentC = getComponentC(twists, somersaults, groupType, height);
    res.send(`Component C for dive ${diveNumber} at ${height} is: ${componentC}`);

    console.log(`Twists: ${twists}, Somersaults: ${somersaults}, Group Type: ${groupType}`);
console.log(`Formatted twists string: ${twistKey}`);

});


// Export the function for use in other files
module.exports = getComponentC;

// Start the server
/*
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/