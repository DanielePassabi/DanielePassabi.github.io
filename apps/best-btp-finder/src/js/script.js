document.addEventListener('DOMContentLoaded', () => {

    console.log('[script.js] Fetching Data Button')
    const fetchDataButton = document.getElementById('fetchData');

    console.log('[script.js] Obtaining Result Div')
    const resultDiv = document.getElementById('result');

    console.log("[script.js] Ready to launch dummy 'scrape' function")

    fetchDataButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/.netlify/functions/scrape');

            // Check if the fetch was successful
            console.log("[script.js] Checking function response")
            if (response.ok) {
                console.log("[script.js] - Response OK")
                const data = await response.json();
                resultDiv.innerHTML = JSON.stringify(data);
            } else {
                console.log("[script.js] - Response NOT OK. Status:", response.status)
                console.log(response)
                resultDiv.innerHTML = `Error: Received status code ${response.status}`;
            }
        } catch (error) {
            // Handle errors, if any
            console.error('There was an error with the fetch operation:', error);
            resultDiv.innerHTML = `Error: ${error.message || 'An error occurred'}`;
        }
    });
});
