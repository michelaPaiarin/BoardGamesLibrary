# BoardGamesLibrary
Applicazione Web Full-Stack per la gestione di una collezione di giochi da tavolo. Progetto per il corso di Applicazioni Web (A.A. 2024/25) - Uniud. Sviluppato con Node.js, Express.js e SQLite, seguendo il paradigma REST

## Requisiti
- Node.js v20 o superiore (consigliata v22 LTS)
- npm v10 o superiore

## Installazione ed esecuzione
Per installare il progetto seguire i seguenti passi:
1. Aprire il terminale nella cartella principale
2. Eseguire il seguente comando per scaricare le dipendenze
```console
npm install
```
3. Inizializzare il database (solo al primo avvio):
```console
npm run init-db
```
4. Riempire il database (solo al primo avvio, facoltativo):
```console
npm run seed-db
```
> **Nota:** i comandi ai punti 3 e 4 sono sicuri da eseguire più volte; non sovrascrivono i dati esistenti e prevengono perdite accidentali di informazioni.

Per eseguire il progetto dopo averlo installato:
1. Aprire il terminale nella cartella principale
2. Eseguire il seguente comando per avviare il server e il compilatore CSS
```console
npm start
```

## Struttura del progetto
```
BoardGamesLibrary/
├── backend/
│   ├── controllers/        # Logica di gestione delle richieste HTTP
│   ├── DB/
│   │   ├── createTable.sql # Script DDL per la creazione della tabella
│   │   ├── initDB.js       # Script di inizializzazione del database
│   │   └── games.db        # Database SQLite (generato da init-db)
│   ├── models/
│   │   ├── games.js        # Query CRUD verso il database
│   │   └── queryBuilder.js # Costruzione dinamica delle WHERE clause
│   ├── routes/             # Definizione delle rotte Express
│   ├── test/               # Test di endpoint, modelli, validatori e filtri
│   ├── sharedExports.js    # Re-export centralizzato dei moduli condivisi
│   └── server.js           # Entry point del server
├── frontend/
│   ├── components/         # Componenti HTML riutilizzabili (navbar, popup, card)
│   ├── css/                # Fogli di stile (Tailwind + stili semantici)
│   ├── JS/                 # Logica client-side (api.js, viste, componenti)
│   ├── IMG/                # Risorse grafiche
│   ├── views/              # Template HTML delle schermate
│   └── index.html          # Entry point del frontend
├── shared/
│   ├── config/
│   │   └── gameConstraints.js  # Vincoli e costanti di validazione
│   ├── data/
│   │   ├── location.js         # Dizionario leggenda posizioni
│   │   └── quickFilters.js     # Configurazione filtri rapidi
│   └── validators/
│       ├── common.js       # Validatori generici riutilizzabili
│       ├── gameFilter.js   # Validazione dei filtri di ricerca
│       └── games.js        # Validazione dei dati di gioco
├── postman/                # Collezione Postman per il test delle API
└── docs/                   # Relazione PDF e materiali aggiuntivi
```

## API Routes
Le rotte impementate dal server sono le seguenti:

| Metodo | Percorso      | Descrizione                                    |
|--------|---------------|------------------------------------------------|
| GET    | /games        | Restituisce la lista dei giochi (con filtri)   |
| GET    | /games/:id    | Restituisce un gioco specifico                 |
| POST   | /games        | Crea un nuovo gioco                            |
| PUT    | /games/:id    | Aggiorna un gioco esistente                    |
| DELETE | /games/:id    | Elimina un gioco                               |

### Sistema di Ricerca e Filtri (GET /games)

L'endpoint `GET /games` supporta un sistema di query string che permette di filtrare i risultati tramite suffissi applicati al nome del campo.

#### Campi testuali: `Name`, `Location`, `Description`, `UrlBigImage`, `UrlSmallImage`, `Room`

| Suffisso | Significato             | Esempio        |
|----------|-------------------------|----------------|
| `_e`     | Corrispondenza esatta   | `Name_e=Catan` |
| `_c`     | Corrispondenza parziale | `Name_c=cat`   |
  
#### Campi numerici: `MinPlayer`, `MaxPlayer`, `MinAge`, `Time`, `Year`, `Player`

| Suffisso  | Significato           | Esempio           |
|-----------|-----------------------|-------------------|
| `_eq`     | Uguale a              | `Time_eq=60`      |
| `_gt`     | Maggiore di           | `Time_gt=30`      |
| `_ge`     | Maggiore o uguale a   | `MinPlayer_ge=2`  |
| `_lt`     | Minore di             | `Time_lt=120`     |
| `_le`     | Minore o uguale a     | `MaxPlayer_le=5`  |

**Note:**
- Filtri in conflitto (es. `Time_eq=60&Time_gt=50` oppure `Time_ge=30&Time_gt=30`) restituiscono `400 Bad Request`.
- `Year` è un campo opzionale: i giochi senza anno catalogato non compaiono nei risultati filtrati per anno.
- Più filtri possono essere combinati liberamente tra campi diversi (es. `Name_c=catan&Time_lt=100&Player_ge=2`).

## Esempi di richieste e risposte
Vediamo di seguito degli esempi di richieste e risposte: 

### GET /games

```
GET /games
```

Risposta `200 OK`:
```json
[
    {
        "ID": 1,
        "Name": "Catan",
        "UrlBigImage": "https://cf.geekdo-images.com/...",
        "UrlSmallImage": "https://cf.geekdo-images.com/...",
        "MinPlayer": 3,
        "MaxPlayer": 4,
        "Time": 120,
        "Description": "In CATAN (precedentemente noto come The Settlers of Catan)...",
        "Year": 1995,
        "Location": "B.7.3",
        "MinAge": 10
    },
    {
        "ID": 2,
        "Name": "Catan: Marinai",
        "UrlBigImage": "https://cf.geekdo-images.com/...",
        "UrlSmallImage": "https://cf.geekdo-images.com/...",
        "MinPlayer": 3,
        "MaxPlayer": 4,
        "Time": 90,
        "Description": "Si tratta di un'espansione per CATAN...",
        "Year": 1997,
        "Location": "B.7.3",
        "MinAge": 10
    }
]
```

#### Con filtri:

Esempi:

```
GET /games?Name_c=catan
GET /games?Time_lt=100&Player_ge=3
GET /games?Room_e=A&Year_gt=2000
GET /games?Name_c=catan&Time_lt=100&Player_ge=3
```

Risposta `200 OK`: array di oggetti gioco (vedi struttura in GET /games).

### GET /games/:id

```
GET /games/1
```

Risposta `200 OK`:
```json
{
    "ID": 1,
    "Name": "Catan",
    "UrlBigImage": "https://cf.geekdo-images.com/0XODRpReiZBFUffEcqT5-Q__original/img/oRc0AomWA9ZtFqQDZiZbIyKE1j0=/0x0/filters:format(png)/pic9156909.png",
    "UrlSmallImage": "https://cf.geekdo-images.com/0XODRpReiZBFUffEcqT5-Q__small/img/SNVfF23OQafv3u8xdFolJnMkBoM=/fit-in/200x150/filters:strip_icc()/pic9156909.png",
    "MinPlayer": 3,
    "MaxPlayer": 4,
    "Time": 120,
    "Description": "In CATAN (precedentemente noto come The Settlers of Catan), i giocatori cercano di diventare la forza dominante sull'isola di Catan costruendo insediamenti, città e strade. ...",
    "Year": 1995,
    "Location": "B.7.3",
    "MinAge": 10
}
```

Risposta `404 Not Found`:
```json
{ "message": "No game found with the provided ID", "details": [] }
```

### POST /games 

```
POST /games
Content-Type: application/json

{
    "Name": "Catan",
    "UrlBigImage": "https://...",
    "UrlSmallImage": "https://...",
    "MinPlayer": 3,
    "MaxPlayer": 4,
    "Time": 120,
    "Description": "...",
    "Year": 1995,
    "Location": "B.7.3",
    "MinAge": 10
}
```

Il gioco da inserire va passato come json nel body della richiesta con gli stessi attributi visibili nel GET. Nel caso l'inserimento sia andato a buon fine si ricevera come risposta: 

Risposta `201 Created`:
```json
{ "status": "success", "message": "Game added successfully", "gameId": 521 }
```

### PUT /games/:id
Solo i campi da aggiornare devono essere inclusi nel corpo della richiesta.
 
```
PUT /games/52
Content-Type: application/json
 
{
    "Location": "C.3.1",
    "Time": 90
}
```
 
Risposta `200 OK`:
```json
{ "status": "success", "message": "Game updated successfully", "changes": 1 }
```
 
### DELETE /games/:id
 
```
DELETE /games/52
```
 
Risposta `200 OK`:
```json
{ "status": "success", "message": "Game deleted successfully", "changes": 1 }
```

## Architettura Front-end
 
L'interfaccia è una **Single Page Application (SPA)** in Vanilla JavaScript (ES6 Modules), senza framework reattivi esterni. La navigazione tra le viste avviene senza ricaricare la pagina.
 
### Struttura dei moduli client-side
 
- **`main.js` (Orchestratore):** coordina il routing lato client e il ciclo di vita dell'applicazione.
- **`views/`:** logica DOM per ogni schermata (`gamesList.js`, `gameDetail.js`, `gameForm.js`).
- **`api.js`:** wrapper centralizzato per le chiamate HTTP tramite Fetch API. Controlla `response.ok` e lancia un'eccezione `ApiError` (con `status` e `details`) per forzare l'ingresso nel blocco `catch` anche in caso di errori HTTP applicativi (es. 409 Conflict).
- **`loader.js`:** carica componenti HTML riutilizzabili (navbar, footer, popup) tramite fetch asincrone.
- **`notifier.js` + `popup.js`:** sistema di messaggistica visiva che sostituisce le funzioni native del browser (`alert`, `confirm`) con modali tematiche.
### Gestione degli stati vuoti
 
Quando il database è vuoto o i filtri non producono risultati, vengono caricati dinamicamente componenti HTML dedicati (`emptyLibrary.html`, `emptySearch.html`) con call-to-action contestuali, evitando schermate bianche.
 
### Statistiche lato client
 
Il calcolo di giochi totali, ore totali e medie (giocatori, tempo, età) viene eseguito nel browser tramite `.reduce()` sul sottoinsieme filtrato corrente, senza query aggiuntive al database.
 
### Design System (CSS ibrido)
 
Tailwind CSS v4 con approccio semantico: il markup usa classi semantiche (`primaryButton`, `badge-info`) mentre la logica visiva è centralizzata nei file `.css` tramite la direttiva `@apply`.

## Tecnologie utilizzate
 
- **Runtime:** Node.js
- **Framework server:** Express.js
- **Database:** SQLite (tramite pacchetto `sqlite` / `sqlite3`)
- **CSS:** Tailwind CSS v4
- **Architettura:** REST