const express = require('express');
const getDiveName = require('./GetDiveName');
const getDDComponentA = require('./GetComponentA');
const getComponentB = require('./GetComponentB');
const getComponentC = require('./GetComponentC');
const getComponentD = require('./GetComponentD');
const getComponentE = require('./GetComponentE');

const app = express();
const PORT = 3001; // Change this to any available port if needed

// Function to check if a dive is a twisting dive
function isTwistingDive(diveNumber) {
    const firstDigit = parseInt(diveNumber.toString()[0]);
    return firstDigit === 5; // Check if the first digit indicates a twisting dive
}

// Route to handle input for Degree of Difficulty calculation
app.get('/:diveNumber/:position/:height', (req, res) => {
    try {
        const { diveNumber, position, height } = req.params;
        const upperPosition = position.toUpperCase();

        // Get dive name
        const diveName = getDiveName(diveNumber);

        // Calculate each component
        const componentA = getDDComponentA(diveNumber, height);
        const componentB = getComponentB(diveNumber, upperPosition, height);
        let componentC = 0; // Default to 0 for non-twisting dives
        if (isTwistingDive(diveNumber)) {
            componentC = getComponentC(diveNumber, height);
        }
        const componentD = getComponentD(diveNumber, height);
        const componentE = getComponentE(diveNumber, height);

        // Validate components
        const components = [componentA, componentB, componentD, componentE];
        if (isTwistingDive(diveNumber)) {
            components.push(componentC);
        }

        if (components.some(component => component === 'Invalid input or data not available' || component === 'Invalid dive number')) {
            return res.status(400).json({ error: 'Invalid input or data not available.' });
        }

        // Calculate total Degree of Difficulty
        const totalDD = components.reduce((sum, value) => sum + value, 0);

        // Send response
        res.json({
            diveName,
            divePosition: upperPosition,
            height,
            componentA,
            componentB,
            componentC: isTwistingDive(diveNumber) ? componentC : 'N/A',
            componentD,
            componentE,
            totalDegreeOfDifficulty: totalDD
        });
    } catch (error) {
        // Handle unexpected errors
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
