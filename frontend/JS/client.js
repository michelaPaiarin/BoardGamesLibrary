fetch('/welcome')
    .then(response => response.text())
    .then(message => {
        document.querySelector('#output').textContent = message
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#output").textContent = "Error loading message"
    })
