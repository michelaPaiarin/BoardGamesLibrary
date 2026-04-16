fetch('/welcome')
    .then(response => response.text())
    .then(message => {
        document.querySelector('#outputWelcome').textContent = message
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#outputWelcome").textContent = "Error loading message"
    })

fetch('/games')
    .then(response => response.json())
    .then(message => {
        document.querySelector('#outputGame').textContent = JSON.stringify(message, null, 4);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#outputGame").textContent = "Error loading message"
    })

fetch('/games/1')
    .then(response => response.json())
    .then(message => {
        document.querySelector('#outputGameById').textContent = JSON.stringify(message, null, 4);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#outputGameById").textContent = "Error loading message"
    })