async function runRoute(route, id, options) {
    const outpudDiv = document.querySelector(id);
    fetch(route, options)
        .then(response => response.json())
        .then(message => {
            outpudDiv.textContent = JSON.stringify(message, null, 4);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            outpudDiv.textContent = "Error loading message";
        });
}

fetch('/welcome')
    .then(response => response.text())
    .then(message => {
        document.querySelector('#outputWelcome').textContent = message
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#outputWelcome").textContent = "Error loading message"
    })

runRoute('/games', '#outputGame');
runRoute('/games/1', '#outputGameById');
runRoute('/games', '#outputPostGame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Pasticcino', players: 2 })
    })

runRoute('/games/21', '#outputPutGame', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Pasticcino', players: 3 })
    })

runRoute('/games/21', '#outputDeleteGame', {
        method: 'DELETE'
    })

function newGameFormSubmitted(event) {
    console.log("new GAME!!!!");
    event.preventDefault();
    const formData = new FormData(event.target);
    const gameData = Object.fromEntries(formData);
    runRoute('/games', '#outputPostGame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
    });
}