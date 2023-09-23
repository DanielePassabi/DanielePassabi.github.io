document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchData');
    const resultDiv = document.getElementById('result');

    fetchDataButton.addEventListener('click', async () => {
      try {

        // Read the values from the input fields
        const minCedola = document.getElementById('minCedola').value;
        const minRendimento = document.getElementById('minRendimento').value;
        const minDurata = document.getElementById('minDurata').value;
        const maxDurata = document.getElementById('maxDurata').value;
        const maxPrezzo = document.getElementById('maxPrezzo').value;

        console.log('[script.js] minCedola:', minCedola)
        console.log('[script.js] minRendimento:', minRendimento)
        console.log('[script.js] minDurata:', minDurata)
        console.log('[script.js] maxDurata:', maxDurata)
        console.log('[script.js] maxPrezzo:', maxPrezzo)

        parameters = '?minCedola=' + minCedola + '&minRendimento=' + minRendimento + '&minDurata=' + minDurata + '&maxDurata=' + maxDurata + '&maxPrezzo=' + maxPrezzo
        complete_url = '/.netlify/functions/scrape' + parameters
        console.log('[script.js] complete url:', complete_url)
        const response = await fetch(complete_url);
  
        if (response.ok) {
          const data = await response.json();
          createTable(data);
        } else {
          resultDiv.innerHTML = `Error: Received status code ${response.status}`;
        }
      } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message || 'An error occurred'}`;
      }
    });
  
    /**
     * Creates and displays a table based on the given data.
     *
     * @param {Array} data - An array of objects containing BTP information.
     */
    function createTable(data) {
        // Create table
        const table = document.createElement('table');
        table.classList.add('table'); // Add Bootstrap class
      
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach((key) => {
          const th = document.createElement('th');
          th.textContent = key;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
      
        // Create table body
        const tbody = document.createElement('tbody');
        data.forEach((row) => {
          const tr = document.createElement('tr');
          Object.values(row).forEach((value) => {
            const td = document.createElement('td');
            // Check if the value is a number and, if so, limit it to 2 decimal places
            td.textContent = typeof value === 'number' ? value.toFixed(2) : value;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
      
        // Append table to resultDiv
        resultDiv.innerHTML = ''; // Clear previous data
        resultDiv.appendChild(table);
      }
  });
  