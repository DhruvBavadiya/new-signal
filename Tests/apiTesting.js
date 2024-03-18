const axios = require('axios');

async function testApiPerformance() {
  const startTime = Date.now();

  try {
    // Make an HTTP request to the API endpoint
    const response = await axios.get('https://greenroad-gr.onrender.com/app/p1/get-signal');

    // Calculate the response time
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    console.log(`Response time: ${elapsedTime} ms`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApiPerformance();
