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

Per eseguire il progetto dopo averlo installato:
1. Aprire il terminale nella cartella principale
2. Eseguire il seguente comando per avviare il server e il compilatore CSS
```console
npm start
```

## Struttura del progetto
Il progetto si divide in 3 macro cartelle:
```
BoardGamesLibrary/
├── backend/
│   ├── config/         # Vincoli e costanti di validazione 
│   ├── controllers/    # Logica di gestione delle richieste
│   ├── DB/             # Database SQLite, script DDL e dati di esempio
│   ├── models/         # Interfaccia con il database (query CRUD)
│   ├── routes/         # Definizione delle rotte Express
│   ├── validators/     # Validazione dei dati in ingresso
│   ├── test/           # Test degli endpoint
│   └── server.js       # Entry point del server
├── frontend/
│   ├── components/     # Componenti HTML riutilizzabili (es. navbar)
│   ├── css/            # Fogli di stile (base, input, Tailwind)
│   ├── JS/             # Logica client-side (api.js, pagine)
│   ├── img/            # Risorse grafiche
│   └── index.html      # Pagina principale
└── docs/               # Relazione PDF e materiali aggiuntivi
```

## API Routes
Le rotte impementate dal server sono le seguenti:

| Metodo | Percorso           | Descrizione                  |
|--------|--------------------|------------------------------|
| GET    | /games             | Lista tutti i giochi         |
| GET    | /games/:id         | Dettaglio singolo gioco      |
| POST   | /games             | Crea nuovo gioco             |
| PUT    | /games/:id         | Aggiorna gioco               |
| DELETE | /games/:id         | Elimina gioco                |


## Esempi di richieste e risposte
Vediamo di seguito degli esempi di richieste e risposte: 

### GET /games

```
GET /games?q=catan&limit=10&offset=0
```

Risposta:
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
{ "status": "error", "message": "Game not found" }
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
X-Auth-Token: <token>
```
 
Risposta `200 OK`:
```json
{ "status": "success", "message": "Game deleted successfully", "changes": 1 }
```

## Tecnologie utilizzate
 
- **Runtime:** Node.js
- **Framework server:** Express.js
- **Database:** SQLite (tramite pacchetto `sqlite` / `sqlite3`)
- **CSS:** Tailwind CSS v4
- **Architettura:** REST