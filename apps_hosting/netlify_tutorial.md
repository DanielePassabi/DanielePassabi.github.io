# Tutorial su Netlify

## Introduzione

Questo tutorial vi guiderà attraverso l'utilizzo di Netlify, un servizio che offre un ambiente di deploy e hosting veloce e semplice da configurare. Per piccoli progetti, Netlify offre un piano gratuito che include:

- 100GB di bandwidth al mese
- 300 minuti di build al mese
- 1 build contemporanea

Potete accedere alla dashboard di Netlify attraverso questo link: [Dashboard Netlify](https://app.netlify.com/teams/danielepassabi/overview).

## Requisiti Preliminari

### 1. Installazione di Node.js

Prima di tutto, è necessario installare [Node.js](https://nodejs.org/en). Dopo l'installazione, verificate che sia stato installato correttamente apertura del Command Prompt (CMD) e digitando:

```cmd
node -v
npm -v
```

### 2. Installazione della CLI di Netlify

Una volta installato Node.js, potete installare la CLI (Command Line Interface) di Netlify con il seguente comando:

```cmd
npm install netlify-cli -g
```

*Nota: l'opzione `-g` indica che il pacchetto sarà installato globalmente sul vostro sistema.*

Dopo l'installazione, potete effettuare il login su Netlify con:

```cmd
netlify login
```

### 3. Creare un Progetto

La struttura del vostro progetto dovrebbe essere simile a questa:

```
📁 my_webapp
 │
 ├──📁 src
 │   ├──📁 css
 │   ├──📁 functions   
 │   │   └── my_function.js
 │   ├──📁 js   
 │   └── index.html
 │
 ├──📁 tests
 │   └── ...
 │
 └── netlify.toml
```

Per inizializzare un nuovo progetto Netlify, navigate nella directory del progetto nel terminal e digitate:

```cmd
PS C:\Users\danyp\projects\my_webapp> netlify init
```

Durante l'inizializzazione, vi verranno fatte alcune domande per configurare il progetto, come il nome da assegnare e altre impostazioni.

#### **Funzioni**

Netlify supporta nativamente funzioni serverless in JavaScript. Per configurare le funzioni nel vostro progetto, aggiungete le seguenti linee al file `netlify.toml`:

```toml
[build]
  functions = "src/functions"
  publish = "src"
```

#### **Build Automatiche**

Ogni volta che effettuate un push del vostro codice su un repository Git collegato, Netlify avvierà automaticamente la build del progetto.

### 4. Debug

Per effettuare il debugging del progetto o delle funzioni, utilizzate il seguente comando:

```cmd
PS C:\Users\danyp\projects\my_webapp> netlify dev
```

Con questo comando, potrete emulare l'ambiente Netlify localmente per testare le vostre modifiche prima di pubblicarle.
