export function showErrorGetGame(onOkCallback) {
    alert("Il gioco richiesto non è momentaneamente disponibile");
    if(onOkCallback) { onOkCallback(); }
}