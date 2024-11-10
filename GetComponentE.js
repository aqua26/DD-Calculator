const express = require('express');
const app = express();
const port = 3000;

// Function to calculate the unnatural entry value based on the dive number and height
function calculateUnnaturalEntry(diveNumber, height) {
  const groupDigit = parseInt(diveNumber.charAt(0), 10);
  const somersaults = parseInt(diveNumber.slice(2), 10) / 2; // Third digit (or third and fourth digits) indicates number of half somersaults

  let groupName;
  switch (groupDigit) {
    case 1: groupName = 'Forward'; break;
    case 2: groupName = 'Back'; break;
    case 3: groupName = 'Reverse'; break;
    case 4: groupName = 'Inward'; break;
    case 5: groupName = 'Twisting'; break;
    case 6: groupName = 'Armstand'; break;
    default: return 'Invalid dive group';
  }

  // Unnatural entry value logic
  let unnaturalEntryValue = 0;

  if (groupName === 'Forward' || groupName === 'Inward') {
    if (somersaults === 1) {
      unnaturalEntryValue = 0.1;
    } else if (somersaults === 2) {
      unnaturalEntryValue = 0.2;
    } else if (somersaults === 3) {
      unnaturalEntryValue = 0.3;
    } else if (somersaults === 4) {
      unnaturalEntryValue = (height === '1m' || height === '3m') ? 0.2 : 0.0;
    } else {
      unnaturalEntryValue = 0.0;
    }
  } else if (groupName === 'Back' || groupName === 'Reverse') {
    if (somersaults === 0.5) {
      unnaturalEntryValue = 0.1;
    } else if (somersaults === 1.5) {
      unnaturalEntryValue = 0.2;
    } else if (somersaults === 2.5) {
      unnaturalEntryValue = 0.3;
    } else if (somersaults === 3.5 || somersaults === 4.5) {
      unnaturalEntryValue = 0.4;
    } else if (somersaults === 5.5) {
      unnaturalEntryValue = 0.0;
    } else {
      unnaturalEntryValue = 0.0;
    }
  } else if (groupName === 'Armstand' && ['5m', '7.5m', '10m'].includes(height)) {
    const approachDigit = parseInt(diveNumber.charAt(1), 10);
    if (approachDigit === 1 || approachDigit === 4) { // Forward or Inward approach
      if (somersaults === 0.5) {
        unnaturalEntryValue = 0.1;
      } else if (somersaults === 1.5) {
        unnaturalEntryValue = 0.2;
      } else if (somersaults === 2.5) {
        unnaturalEntryValue = 0.3;
      } else if (somersaults === 3.5 || somersaults === 4.5) {
        unnaturalEntryValue = 0.4;
      } else if (somersaults >= 5.5) {
        unnaturalEntryValue = 0.0;
      }
    } else if (approachDigit === 2 || approachDigit === 3) { // Back or Reverse approach
      if (somersaults === 1) {
        unnaturalEntryValue = 0.1;
      } else if (somersaults === 2) {
        unnaturalEntryValue = 0.2;
      } else if (somersaults === 3) {
        unnaturalEntryValue = 0.2;
      } else if (somersaults === 4) {
        unnaturalEntryValue = 0.3;
      }
    }
  }

  return unnaturalEntryValue;
}

// API endpoint to calculate Component E using route parameters
app.get('/:diveNumber/:height', (req, res) => {
  const { diveNumber, height } = req.params;

  const validHeights = ['1m', '3m', '5m', '7.5m', '10m'];
  if (!validHeights.includes(height)) {
    return res.status(400).send('Invalid height.');
  }

  const unnaturalEntryScore = calculateUnnaturalEntry(diveNumber, height);
  if (unnaturalEntryScore === 'Invalid dive group') {
    return res.status(400).send('Invalid dive number.');
  }

  // Send only the numeric unnatural entry score as the response
  res.send(unnaturalEntryScore.toString());
});


// ... existing code ...

// Export the function for use in other files
module.exports = calculateUnnaturalEntry; // Ensure the exported name matches the defined function


// Export the function for use in other files
//module.exports = getComponentE;

/*app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
*/