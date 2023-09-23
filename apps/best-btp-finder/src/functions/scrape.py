from bs4 import BeautifulSoup
import pandas as pd
import requests
import json

def handler(event, context):
    """
    Handler function for Netlify Function.
    """
    dataframe = parse_html_table_to_dataframe()
    dataframe = apply_data_transformations(dataframe)
    best_btps = found_best_btps(
        dataframe,
        min_cedola=3,
        max_durata=10,
        min_durata=1,
        min_rendimento=3.5,
        max_prezzo=99
        )

    return {
        'statusCode': 200,
        'body': json.dumps(best_btps.to_dict(orient='records')),
        'headers': {
            'Content-Type': 'application/json'
        },
    }


def parse_html_table_to_dataframe():
    """
    Scrapes BTPs information from website and returns as DataFrame.
    """

    # Make a request to the website and get the HTML content
    url = 'https://www.rendimentibtp.it/' # replace with the actual URL of the website you are scraping
    response = requests.get(url, timeout=60)
    html_content = response.content

    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find all the table rows (tr) in the HTML content
    table_rows = soup.find_all('tr')

    # Create empty lists to store the data for each column
    isins = []
    titoli = []
    durate = []
    scadenze = []
    tassi = []
    prezzi = []
    cedole_netto = []

    # Loop through each table row (skipping the first one, which contains the table headers)
    for row in table_rows[1:]:
        # Find all the table cells (td) in the row
        cells = row.find_all('td')

        # Extract the data from each cell and append it to the corresponding list
        isin = cells[0].a.text
        isins.append(isin)

        titolo = cells[1].text
        titoli.append(titolo)

        durata = cells[2].text
        durate.append(durata)

        scadenza = cells[3].text
        scadenze.append(scadenza)

        tasso = cells[4].text
        tassi.append(tasso)

        prezzo = cells[5].text
        prezzi.append(prezzo)

        cedola_netto = cells[6].text
        cedole_netto.append(cedola_netto)

    data = {
        'isin': isins,
        'titolo': titoli,
        'durata': durate,
        'scadenza': scadenze,
        'tasso': tassi,
        'prezzo': prezzi,
        'cedola netta': cedole_netto
    }
    dataframe = pd.DataFrame(data)
    return dataframe


def apply_data_transformations(dataframe):
    """
    Applies data transformations to the DataFrame
    """
    dataframe['prezzo'] = dataframe['prezzo'].str.replace(',', '.').astype(float)
    dataframe['durata'] = dataframe['durata'].str.replace(',', '.').astype(float)
    dataframe['cedola netta'] = dataframe['cedola netta'].str.replace(',', '.').str.replace('%', '').astype(float)
    dataframe['tasso'] = dataframe['tasso'].str.replace(',', '.').str.replace('%', '').astype(float)
    dataframe['cedola netta'] = 100/dataframe['prezzo'] * dataframe['tasso'] * 0.875
    dataframe['rendimento netto'] = round((((100/dataframe['prezzo'])-1)*100/dataframe['durata'])*0.875 + dataframe['cedola netta'],2)
    dataframe['cedola netta'] = round(dataframe['cedola netta'],2)
    return dataframe


def found_best_btps(dataframe, min_cedola, min_rendimento, min_durata, max_durata, max_prezzo):
    """
    Finds the best BTPs based on criteria and returns filtered DataFrame.
    """
    # filter by cedola netta > min_cedola, durata > min_durata, and durata < max_durata
    filtered_dataframe = dataframe[(dataframe['cedola netta'] > min_cedola) &
                     (dataframe['durata'] > min_durata) &
                     (dataframe['durata'] < max_durata) &
                     (dataframe['prezzo'] < max_prezzo) &
                     (dataframe['rendimento netto'] > min_rendimento)]
    # sort by rendimento netto
    sorted_dataframe = filtered_dataframe.sort_values(by='rendimento netto', ascending=False)

    print(f"💸 Trovati {len(sorted_dataframe)} BTP che soddisfano i tuoi criteri:")
    print(f"    > Rendimento netto >= {min_rendimento}%")
    print(f"    > Cedola netta >= {min_cedola}%")
    print(f"    > Maturity {min_durata}-{max_durata} anni")
    print(f"    > Prezzo <= {max_prezzo}")
    return sorted_dataframe
