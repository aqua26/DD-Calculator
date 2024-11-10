const express = require('express');
const app = express();
const PORT = 3000;

// Function to get the dive name based on the input dive number
function getDiveName(diveNumber) {
    const diveString = diveNumber.toString();
    const firstDigit = parseInt(diveString[0]);
    let groupName;

    switch (firstDigit) {
        case 1:
            groupName = 'Forward';
            break;
        case 2:
            groupName = 'Back';
            break;
        case 3:
            groupName = 'Reverse';
            break;
        case 4:
            groupName = 'Inward';
            break;
        case 5:
            // For twisting dives, determine the take-off direction
            const takeOffDirection = parseInt(diveString[1]);
            switch (takeOffDirection) {
                case 1:
                    groupName = 'Forward';
                    break;
                case 2:
                    groupName = 'Back';
                    break;
                case 3:
                    groupName = 'Reverse';
                    break;
                case 4:
                    groupName = 'Inward';
                    break;
                default:
                    return 'Invalid Dive Number';
            }
            break;
        case 6:
            // For Armstand, determine the direction
            const armstandDirection = parseInt(diveString[1]);
            switch (armstandDirection) {
                case 1:
                    groupName = 'Armstand Forward';
                    break;
                case 2:
                    groupName = 'Armstand Back';
                    break;
                case 3:
                    groupName = 'Armstand Reverse';
                    break;
                case 4:
                    groupName = 'Armstand Inward';
                    break;
                default:
                    return 'Invalid Dive Number';
            }
            break;
        default:
            return 'Invalid Dive Number';
    }

    // Additional parsing for somersaults and twists
    const thirdDigit = parseInt(diveString[2]);
    let somersaults = '';
    if (firstDigit === 6) {
        // Armstand special cases
        if (thirdDigit === 0) {
            somersaults = ' Dive';
        } else if (thirdDigit === 1) {
            somersaults = ' 1/2 Somersault';
        } else if (thirdDigit > 1) {
            const wholeNumber = Math.floor(thirdDigit / 2);
            const isHalf = thirdDigit % 2 !== 0;
            somersaults = ` ${wholeNumber}${isHalf ? ' 1/2' : ''} Somersault`;
        }
    } else {
        if (thirdDigit === 1) {
            somersaults = ' Dive';
        } else if (thirdDigit > 1) {
            const wholeNumber = Math.floor(thirdDigit / 2);
            const isHalf = thirdDigit % 2 !== 0;
            somersaults = ` ${wholeNumber}${isHalf ? ' 1/2' : ''} Somersault`;
        }
    }

    if (firstDigit === 5 || firstDigit === 6) {
        const halfTwists = diveString.length === 4 ? parseInt(diveString[3]) : 0;
        let twistInfo = '';

        if (halfTwists > 0) {
            twistInfo = halfTwists === 1 ? ' 1/2 Twist' : ` ${halfTwists / 2} Twist${halfTwists / 2 > 1 ? 's' : ''}`;
        }

        return `${groupName}${somersaults}${twistInfo}`.trim();
    }

    return `${groupName}${somersaults}`.trim();
}

// Route to handle dive number input
app.get('/:diveNumber', (req, res) => {
    const diveNumber = req.params.diveNumber;
    const diveName = getDiveName(diveNumber);
    res.send(diveName);
});

// Export the function for use in other files
module.exports = getDiveName;

// Start the server
/*
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/