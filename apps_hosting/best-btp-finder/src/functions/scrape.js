const cheerio = require('cheerio');
const DataFrame = require('pandas-js').DataFrame;

exports.handler = async function(event, context) {

  const fetchModule = await import('node-fetch');
  const fetch = fetchModule.default;

  try {
    const dataframe = await parseHtmlTableToDataFrame();
    const transformedDataframe = applyDataTransformations(dataframe);
    const bestBtps = findBestBtps(transformedDataframe, 3, 3.5, 1, 10, 99);
    return {
      statusCode: 200,
      body: JSON.stringify(bestBtps),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
}

async function parseHtmlTableToDataFrame() {
  console.log('[scrape.js] parseHtmlTableToDataFrame() function starts')
  const url = 'https://www.rendimentibtp.it/';
  const response = await fetch(url);
  const htmlContent = await response.text();
  const $ = cheerio.load(htmlContent);

  const data = {
    isin: [],
    titolo: [],
    durata: [],
    scadenza: [],
    tasso: [],
    prezzo: [],
    cedolaNetta: []
  };

  $('tr').each((i, row) => {
    if (i === 0) return; // skip header row
    const cells = $(row).find('td');
    data.isin.push($(cells[0]).text().trim());
    data.titolo.push($(cells[1]).text().trim());
    data.durata.push($(cells[2]).text().trim());
    data.scadenza.push($(cells[3]).text().trim());
    data.tasso.push($(cells[4]).text().trim());
    data.prezzo.push($(cells[5]).text().trim());
    data.cedolaNetta.push($(cells[6]).text().trim());
  });

  console.log('[scrape.js] parseHtmlTableToDataFrame() function ends')
  return new DataFrame(data);
}

function applyDataTransformations(df) {
  
  console.log('Input df:')
  console.log(df)

  console.log('[scrape.js] applyDataTransformations() function starts')
  
  df._data['prezzo'] = df._data['prezzo'].map(val => parseFloat(val.replace(',', '.')));
  console.log("[scrape.js] - 'prezzo' mapped correctly")
  
  df._data['durata'] = df._data['durata'].map(val => parseFloat(val.replace(',', '.')));
  console.log("[scrape.js] - 'durata' mapped correctly")
  
  df._data['tasso'] = df._data['tasso'].map(val => parseFloat(val.replace(',', '.').replace('%', '')));
  console.log("[scrape.js] - 'tasso' mapped correctly")
  
  df._data['cedolaNetta'] = df._data['tasso'].map((val, i) => (100 / df._data['prezzo'][i]) * val * 0.875);
  console.log("[scrape.js] - 'cedolaNetta' mapped correctly")
  
  df._data['rendimentoNetto'] = df._data['tasso'].map((val, i) => (((100 / df._data['prezzo'][i]) - 1) * 100 / df._data['durata'][i]) * 0.875 + df._data['cedolaNetta'][i]);
  console.log("[scrape.js] - 'rendimentoNetto' mapped correctly")

  console.log('[scrape.js] applyDataTransformations() function ends')

  console.log('Updated df:')
  console.log(df)

  return df;
}

function findBestBtps(df, minCedola, minRendimento, minDurata, maxDurata, maxPrezzo) {
  
  console.log('[scrape.js] findBestBtps() function starts');

  const numRows = df._data['cedolaNetta'].length; // Assuming all columns have the same number of rows
  
  // Filtering data
  const filteredRows = [];
  for(let i = 0; i < numRows; i++) {
    if(
      df._data['cedolaNetta'][i] > minCedola &&
      df._data['durata'][i] > minDurata &&
      df._data['durata'][i] < maxDurata &&
      df._data['prezzo'][i] < maxPrezzo &&
      df._data['rendimentoNetto'][i] > minRendimento
    ) {
      const row = {};
      Object.keys(df._data).forEach(key => {
        row[key] = df._data[key][i];
      });
      filteredRows.push(row);
    }
  }

  // Sorting by 'rendimentoNetto' in descending order
  const sortedRows = filteredRows.sort((a, b) => b['rendimentoNetto'] - a['rendimentoNetto']);

  console.log('[scrape.js] findBestBtps() function ends');
  
  return sortedRows;
}


// You may want to wrap the `handler` function call in a way that works with your specific environment.
