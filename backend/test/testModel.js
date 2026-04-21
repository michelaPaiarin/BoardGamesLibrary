/**
 * Database Test & Seeding Utility for the Games Model (V3).
 * * Usage:
 * node test/testModel.js seed    - Populates the database with 20 sample games (MinAge included).
 * node test/testModel.js update  - Tests mass update logic on existing games.
 * node test/testModel.js delete  - Clears all games from the database.
 * node test/testModel.js search  - Searches for games by name.
 * * Note: This utility script and its sample data were generated with AI assistance 
 * to validate the Data Access Layer (CRUD operations) and ensure database integrity. 
 * It is designed for local development and QA processes, providing a quick way 
 * to restore a consistent state in the test database.
 */

import { addGame, updateGame, deleteGame, getAllGames, getGameByName } from '../models/games.js';
import { connectDB, MODE } from '../DB/database.js';

connectDB(MODE.TEST)
    .then(() => {
        console.log('Database connection established. Starting test operations...');
        runTest();
    }).catch(error => {
        console.error('Failed to connect to the database:', error);
    });

const action = process.argv[2]; 

const testGames = [
    { Name: "Catan", MinPlayer: "3", MaxPlayer: "4", MinAge: "10", Time: "120", Location: "A.1.1", Year: "1995", Description: "Costruisci strade e città.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Carcassonne", MinPlayer: "2", MaxPlayer: "5", MinAge: "7", Time: "45", Location: "A.1.2", Year: "2000", Description: "Piazza tessere per creare paesaggi.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Ticket to Ride", MinPlayer: "2", MaxPlayer: "5", MinAge: "8", Time: "60", Location: "A.2.1", Year: "2004", Description: "Costruisci tratte ferroviarie.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Pandemic", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "45", Location: "A.2.2", Year: "2008", Description: "Salva il mondo dalle malattie.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "7 Wonders", MinPlayer: "2", MaxPlayer: "7", MinAge: "10", Time: "30", Location: "B.1.1", Year: "2010", Description: "Sviluppa la tua civiltà antica.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Dominion", MinPlayer: "2", MaxPlayer: "4", MinAge: "13", Time: "30", Location: "B.1.2", Year: "2008", Description: "Il padre dei deck-builder.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Scythe", MinPlayer: "1", MaxPlayer: "5", MinAge: "14", Time: "115", Location: "B.2.1", Year: "2016", Description: "Mech e contadini in un'Europa alternativa.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Terraforming Mars", MinPlayer: "1", MaxPlayer: "5", MinAge: "12", Time: "120", Location: "B.2.2", Year: "2016", Description: "Rendi Marte abitabile.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Wingspan", MinPlayer: "1", MaxPlayer: "5", MinAge: "10", Time: "70", Location: "C.1.1", Year: "2019", Description: "Colleziona volatili nella tua riserva.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Codenames", MinPlayer: "2", MaxPlayer: "8", MinAge: "14", Time: "15", Location: "C.1.2", Year: "2015", Description: "Trova le spie tramite indizi di una parola.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Azul", MinPlayer: "2", MaxPlayer: "4", MinAge: "8", Time: "45", Location: "C.2.1", Year: "2017", Description: "Decora il palazzo reale portoghese.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Splendor", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "30", Location: "C.2.2", Year: "2014", Description: "Diventa il più ricco mercante di gemme.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Gloomhaven", MinPlayer: "1", MaxPlayer: "4", MinAge: "14", Time: "120", Location: "D.1.1", Year: "2017", Description: "Avventura epica dungeon crawler.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Brass: Birmingham", MinPlayer: "2", MaxPlayer: "4", MinAge: "14", Time: "120", Location: "D.1.2", Year: "2018", Description: "Rivoluzione industriale pura.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Root", MinPlayer: "2", MaxPlayer: "4", MinAge: "10", Time: "90", Location: "D.2.1", Year: "2018", Description: "Guerra asimmetrica tra animali del bosco.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Blood Rage", MinPlayer: "2", MaxPlayer: "4", MinAge: "14", Time: "90", Location: "D.2.2", Year: "2015", Description: "Vichinghi che combattono durante il Ragnarok.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Dixit", MinPlayer: "3", MaxPlayer: "6", MinAge: "8", Time: "30", Location: "E.1.1", Year: "2008", Description: "Immaginazione e carte surrealiste.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Ark Nova", MinPlayer: "1", MaxPlayer: "4", MinAge: "14", Time: "150", Location: "E.1.2", Year: "2021", Description: "Costruisci lo zoo moderno perfetto.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Cascadia", MinPlayer: "1", MaxPlayer: "4", MinAge: "10", Time: "45", Location: "E.2.1", Year: "2021", Description: "Crea l'ecosistema perfetto nel nord-ovest.", UrlBigImage: "", UrlSmallImage: "" },
    { Name: "Dune: Imperium", MinPlayer: "1", MaxPlayer: "4", MinAge: "14", Time: "120", Location: "E.2.2", Year: "2020", Description: "Conquista Arrakis tramite intrighi e guerra.", UrlBigImage: "", UrlSmallImage: "" }
];

async function runTest() {
    try {
        if (action === 'seed') {
            console.log('🌱 Inserimento di 20 giochi in corso...');
            for (const game of testGames) {
                const response = await addGame(game);
                console.log(response);
            }
            console.log('✅ 20 giochi inseriti con successo!');

        } else if (action === 'update') {
            console.log('✏️ Modifica di tutti i giochi in corso...');
            const allGames = await getAllGames();
            if (allGames.length === 0) return console.log('❌ DB vuoto. Lancia prima il comando "seed".');
            
            for (const game of allGames) {
                const response = await updateGame(game.ID, { 
                    Time: 0, 
                    Description: game.Description + " [AGGIORNATO DAL TEST]" 
                });
                console.log(response);
            }
            console.log('✅ Tutti i giochi sono stati aggiornati!');
        } else if (action === 'delete') {
            console.log('🔥 Cancellazione di massa in corso...');
            const allGames = await getAllGames();
            for (const game of allGames) {
                const response = await deleteGame(game.ID);
                console.log(response);
            }
            console.log('✅ DB pulito!');
        } else if (action === 'search') {
            const { getGameByName } = await import('../models/games.js');
            
            console.log('🔍 Test Ricerca per Nome in corso...');
            const allGames = await getAllGames();
            if (allGames.length === 0) return console.log('❌ DB vuoto. Lancia prima il comando "seed".');

            const searchTests = [
                { term: "Ticket to Ride", exact: true, desc: "Match Esatto Esistente" },
                { term: "Ticket", exact: true, desc: "Match Esatto su nome parziale (Deve fallire)" },
                { term: "Ticket", exact: false, desc: "Match Parziale Esistente (Deve trovare i due Ticket)" },
                { term: "Monopoly", exact: false, desc: "Match Parziale Non Esistente (Deve fallire)" },
                { term: "L'Isola di Fuoco", exact: true, desc: "Test Sicurezza Apostrofo (Non deve crashare)" }
            ];

            for (const test of searchTests) {
                console.log(`\n▶️ TEST: ${test.desc}`);
                const result = await getGameByName(test.term, test.exact);
                
                console.log(result);
    
                if (result && result.length > 0) {
                    if (test.exact) {
                        console.log(`   ✅ Risultato: Trovato ID ${result[0].ID} -> ${result[0].Name}`);
                    } else {
                        console.log(`   ✅ Risultato: Trovati ${result.length} giochi!`);
                        result.forEach(g => console.log(`      - ID ${g.ID} -> ${g.Name}`));
                    }
                } else {
                    console.log(`   ❌ Risultato: Nessun gioco trovato.`);
                }
            }
            console.log('\n✅ Test di ricerca conclusi!');
        }else {
           console.log(`🛠️  Strumento di Test Database Giochi 🛠️

Comandi disponibili:
-   node testDB.js seed    -> Crea 20 giochi nel DB
-   node testDB.js update  -> Modifica tutti i giochi (aggiunge tempo e cambia descrizione)
-   node testDB.js delete  -> Svuota completamente il DB
-   node testDB.js search  -> Cerca giochi per nome
            `);
        }
    } catch (error) { console.error('❌ Errore durante il test:', error); }
}