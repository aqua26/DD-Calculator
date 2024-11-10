const express = require('express');
const app = express();
const port = 3000;

// Function to calculate the approach value based on the dive number and height
function calculateApproach(diveNumber, height) {
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

  // Approach score logic based on the group and height
  let approachValue = 0;
  if (groupName === 'Forward') {
    if (height === '1m') {
      approachValue = somersaults >= 4 ? 0.5 : 0.0;
    } else if (height === '3m') {
      approachValue = somersaults >= 4 ? 0.3 : 0.0;
    } else if (['5m', '7.5m'].includes(height)) {
      approachValue = somersaults >= 4 ? 0.3 : 0.0;
    } else if (height === '10m') {
      approachValue = somersaults >= 4 ? 0.2 : 0.0;
    }
  } else if (groupName === 'Back') {
    if (height === '1m') {
      approachValue = somersaults >= 3.5 ? 0.6 : 0.2;
    } else if (height === '3m') {
      approachValue = somersaults >= 3.5 ? 0.4 : 0.2;
    } else if (['5m', '7.5m'].includes(height)) {
      approachValue = somersaults >= 3.5 ? 0.3 : 0.2;
    } else if (height === '10m') {
      approachValue = somersaults >= 3.5 ? 0.2 : 0.2;
    }
  } else if (groupName === 'Reverse') {
    if (height === '1m') {
      approachValue = somersaults >= 3.5 ? 0.5 : 0.3;
    } else if (height === '3m') {
      approachValue = somersaults >= 3.5 ? 0.3 : 0.3;
    } else if (height === '5m') {
      if (somersaults >= 3.5) {
        approachValue = 0.6;
      } else if (somersaults >= 2.5) {
        approachValue = 0.4;
      } else {
        approachValue = 0.3;
      }
    } else if (['7.5m', '10m'].includes(height)) {
      if (somersaults >= 3.5) {
        approachValue = 0.4;
      } else if (somersaults >= 2.5) {
        approachValue = 0.4;
      } else {
        approachValue = 0.3;
      }
    }
  } else if (groupName === 'Inward') {
    if (height === '1m') {
      approachValue = somersaults >= 1.5 ? 0.5 : 0.6;
    } else if (['3m', '7.5m', '10m'].includes(height)) {
      approachValue = somersaults >= 1.5 ? 0.3 : 0.3;
    } else if (height === '5m') {
      approachValue = somersaults >= 1.5 ? 0.5 : 0.6;
    }
  } else if (groupName === 'Armstand' && ['5m', '7.5m', '10m'].includes(height)) {
    if (diveNumber.charAt(1) === '1') {
      // Armstand Forward
      approachValue = somersaults > 2 ? 0.4 : 0.2;
    } else if (diveNumber.charAt(1) === '2') {
      // Armstand Back
      approachValue = somersaults > 0.5 ? 0.4 : 0.2;
    } else if (diveNumber.charAt(1) === '3') {
      // Armstand Reverse
      approachValue = somersaults > 0.5 ? 0.5 : 0.3;
    } else if (diveNumber.charAt(1) === '4') {
      // Armstand Inward
      approachValue = somersaults > 2 ? 0.5 : 0.3;
    }
  }

  return approachValue;
}

// API endpoint to calculate Component D using route parameters
app.get('/:diveNumber/:height', (req, res) => {
  const { diveNumber, height } = req.params;

  const validHeights = ['1m', '3m', '5m', '7.5m', '10m'];
  if (!validHeights.includes(height)) {
    return res.status(400).send('Invalid height.');
  }

  const approachScore = calculateApproach(diveNumber, height);
  if (approachScore === 'Invalid dive group') {
    return res.status(400).send('Invalid dive number.');
  }

  // Send only the numeric approach score as the response
  res.send(approachScore.toString());
});


// ... existing code ...

// Export the function for use in other files
module.exports = calculateApproach; // or `module.exports = getComponentD;` if you prefer


// Export the function for use in other files
//module.exports = getComponentD;

/*app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
*/