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
  console.log('[scrape.js] applyDataTransformations() function starts')
  df['prezzo'] = df['prezzo'].map(val => parseFloat(val.replace(',', '.')));
  df['durata'] = df['durata'].map(val => parseFloat(val.replace(',', '.')));
  df['tasso'] = df['tasso'].map(val => parseFloat(val.replace(',', '.').replace('%', '')));
  df['cedolaNetta'] = df['tasso'].map((val, i) => (100 / df['prezzo'][i]) * val * 0.875);
  df['rendimentoNetto'] = df['tasso'].map((val, i) => (((100 / df['prezzo'][i]) - 1) * 100 / df['durata'][i]) * 0.875 + df['cedolaNetta'][i]);
  console.log('[scrape.js] applyDataTransformations() function ends')
  return df;
}

function findBestBtps(df, minCedola, minRendimento, minDurata, maxDurata, maxPrezzo) {

  console.log('[scrape.js] findBestBtps() function starts')
  const filteredDf = df.filter(
    row => row['cedolaNetta'] > minCedola &&
      row['durata'] > minDurata &&
      row['durata'] < maxDurata &&
      row['prezzo'] < maxPrezzo &&
      row['rendimentoNetto'] > minRendimento
  );
  const sortedDf = filteredDf.sortBy('rendimentoNetto', false);
  console.log('[scrape.js] findBestBtps() function ends')
  return sortedDf;
}

// You may want to wrap the `handler` function call in a way that works with your specific environment.
