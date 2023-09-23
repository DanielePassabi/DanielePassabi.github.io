document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchData');
    const resultDiv = document.getElementById('result');

    fetchDataButton.addEventListener('click', async () => {
        const response = await fetch('/.netlify/functions/scrape');
        const data = await response.json();
        resultDiv.innerHTML = JSON.stringify(data);
    });
});
