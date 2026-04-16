fetch('/welcome')
    .then(response => response.text())
    .then(message => {
        document.querySelector('#outputWelcome').textContent = message
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#outputWelcome").textContent = "Error loading message"
    })
