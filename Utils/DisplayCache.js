// Function to display all cached variables and their data
const NodeCache = require("node-cache");
const cache = new NodeCache();
function displayCachedData(cache) {
    console.log("Cached Variables:");
    const cachedKeys = cache.keys();
    cachedKeys.forEach(key => {
      const cachedData = cache.get(key);
      console.log(`${key}:`, cachedData);
    });
}

// Export the function for external use
module.exports.displayCachedData = displayCachedData;

// Call the function to display cached data, passing the cache variable as an argument
displayCachedData(cache);
