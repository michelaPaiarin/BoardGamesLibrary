import { openPopUp, TYPE } from "../components/popup.js";

const MESSAGES = {
    GET_GAME_ERROR:        {   type: TYPE.ERROR,       title: 'ERRORE',
        message: 'Il gioco richiesto non è momentaneamente disponibile.'
    }, LOAD_DETAIL_ERROR: {     type: TYPE.ERROR,      title: 'ERRORE CARICAMENTO', 
        message: "Impossibile caricare i dettagli di questo gioco. Potrebbe essere stato rimosso o c'è un problema di rete." 
    }, NETWORK_ERROR:      {   type: TYPE.ERROR,       title: 'ERRORE DI RETE',
        message: 'Impossibile connettersi al server. Riprova più tardi.'
    }, CREATE_ERROR:       {   type: TYPE.ERROR,       title: 'ERRORE SALVATAGGIO',
        message: "Impossibile creare il gioco."
    }, MODIFY_ERROR:       {   type: TYPE.ERROR,       title: 'ERRORE SALVATAGGIO',
        message: "Impossibile aggiornare il gioco."
    }, DELETE_ERROR:       {   type: TYPE.ERROR,       title: 'ERRORE CANCELLAZIONE',
        message: "Impossibile eliminare il gioco."
    }, DATA_ERROR:         {   type: TYPE.ERROR,       title: 'ERRORE',
        message: "Ci sono degli errori nei dati inseriti. Correggili e riprova."
    }, NOT_FOUND_ERROR:    {   type: TYPE.ERROR,       title: 'ERRORE 404',
        message: "Gioco non trovato. Ti consigliamo di ricaricare la pagina per vedere i dati aggiornati.",
    }, CONFLICT_NAME_ERROR: {    type: TYPE.ERROR,       title: 'CONFLITTO',
        message: "Esiste già un gioco con questo nome. Cambialo e riprova."
    },  CREATE_SUCCESS:     {   type: TYPE.SUCCESS,     title: 'OPERAZIONE COMPLETATA',
        message: "Gioco creato con successo!"
    }, MODIFY_SUCCESS:      {   type: TYPE.SUCCESS,     title: 'OPERAZIONE COMPLETATA',
        message: "Gioco aggiornato con successo!"
    }, DELETE_SUCCESS:      {  type: TYPE.SUCCESS,     title: 'ELIMINATO',
        message: 'Il gioco è stato rimosso con successo.'
    }, LEAVE_FORM_CONFIRM:  {   type: TYPE.CONFIRM,     title: 'MODIFICHE NON SALVATE',
        message: 'Se torni indietro perderai i dati inseriti. Vuoi uscire?'
    }, DELETE_GAME_CONFIRM: {  type: TYPE.CONFIRM,     title: 'ELIMINA GIOCO',
        message: 'Sei sicuro di voler eliminare definitivamente'
    }, UPCOMING_FEATURES:   {  type: TYPE.INFO,        title: 'INFO',
        message: 'Funzionalità in arrivo'
    },
    CUSTOM_ERROR:     {   type: TYPE.ERROR,       title: 'ERRORE'                 },
    CUSTOM_SUCCESS:   {   type: TYPE.SUCCESS,     title: 'OPERAZIONE COMPLETATA'  },
    CUSTOM_CONFIRM:   {   type: TYPE.CONFIRM,     title: 'SEI SICURO?'            },
};

function notifyMessage(messageConfig, callbacks = {}) {
    openPopUp(messageConfig.type, { title: messageConfig.title, message: messageConfig.message, ...callbacks });
}

//------------------------------------ ERROR (TYPE.ERROR) ------------------------------------

export function showErrorGetGame(onOk)      { notifyMessage(MESSAGES.GET_GAME_ERROR,        { onOk }); }
export function showLoadDetailError(onOk)   { notifyMessage(MESSAGES.LOAD_DETAIL_ERROR,     { onOk }); }
export function showNetworkError(onOk)      { notifyMessage(MESSAGES.NETWORK_ERROR,         { onOk }); }
export function showCreateError(onOk)       { notifyMessage(MESSAGES.CREATE_ERROR,          { onOk }); } 
export function showModifyError(onOk)       { notifyMessage(MESSAGES.MODIFY_ERROR,          { onOk }); }
export function showDeleteError(onOk)       { notifyMessage(MESSAGES.DELETE_ERROR,          { onOk }); }
export function showDataError(onOk)         { notifyMessage(MESSAGES.DATA_ERROR,            { onOk }); }
export function showNotFoundError(onOk)     { notifyMessage(MESSAGES.NOT_FOUND_ERROR,       { onOk }); }
export function showConflictNameError(onOk) { notifyMessage(MESSAGES.CONFLICT_NAME_ERROR,   { onOk }); }

export function showSpecificApiError(error, defaultErrorHandler, onOk) {
    if (!error.status)        { showNetworkError();         return; }
    if (error.status === 404) { showNotFoundError();        return; }
    if (error.status === 409) { showConflictNameError();    return; }
    if (defaultErrorHandler)  { defaultErrorHandler(onOk);  return; }

    showCustomError(error.message || "Si è verificato un errore imprevisto.", onOk);
}

//---------------------------------  SUCCESS (TYPE.SUCCESS) --------------------------------- 

export function showCreateSuccess(onOk) { notifyMessage(MESSAGES.CREATE_SUCCESS, { onOk }); }
export function showModifySuccess(onOk) { notifyMessage(MESSAGES.MODIFY_SUCCESS, { onOk }); }
export function showDeleteSuccess(onOk) { notifyMessage(MESSAGES.DELETE_SUCCESS, { onOk }); }

//--------------------------------- CONFIRM (TYPE.CONFIRM) ---------------------------------

export function askLeaveFormConfirmation(onConfirm, onCancel) {
    notifyMessage(MESSAGES.LEAVE_FORM_CONFIRM, { onConfirm, onCancel });
}

export function askDeleteConfirmation(gameName, onConfirm, onCancel) {
    const messageConfig = {
        ...MESSAGES.DELETE_GAME_CONFIRM,
        message: `${MESSAGES.DELETE_GAME_CONFIRM.message} "${gameName}"?`
    };
    notifyMessage(messageConfig, { onConfirm, onCancel });
}


//----------------------------------- INFO (TYPE.INFO) -----------------------------------

export function showUpcomingFeatures(onOk) { notifyMessage(MESSAGES.UPCOMING_FEATURES, { onOk }); }

//---------------------------------------- CUSTOM ----------------------------------------

export function showCustomMessage (type, title, message, callbacks = {}){ notifyMessage({type, title, message}, callbacks);   }

export function showCustomError(message, onOK)                  { notifyMessage({ ...MESSAGES.CUSTOM_ERROR,   message }, { onOk                });}
export function showCustomSuccess(message, onOk)                { notifyMessage({ ...MESSAGES.CUSTOM_SUCCESS, message }, { onOk                });}
export function showCustomConfirm(message, onConfirm, onCancel) { notifyMessage({ ...MESSAGES.CUSTOM_CONFIRM, message }, { onConfirm, onCancel });}