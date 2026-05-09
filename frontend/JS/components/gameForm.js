export function gameSaveForm(event) {
    event.preventDefault(); 

    const form = event.target; 
    const method = event.target.dataset.apiMethod;
    const gameData = Object.fromEntries(new FormData(form));

    console.log("Operazione:", method);
    console.log("Dati estratti dal form:", gameData);
}