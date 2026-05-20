import { openPopUp, TYPE } from "../components/popup.js";

const MESSAGES = {
    GET_GAME_ERROR: {       type: TYPE.ERROR,       title: 'ERRORE',
        message: 'Il gioco richiesto non è momentaneamente disponibile.'
    },
    NETWORK_ERROR: {        type: TYPE.ERROR,       title: 'ERRORE DI RETE',
        message: 'Impossibile connettersi al server. Riprova più tardi.'
    },
    CREATE_ERROR: {         type: TYPE.ERROR,       title: 'ERRORE SALVATAGGIO',
        message: "Impossibile creare il gioco."
    },
    MODIFY_ERROR: {         type: TYPE.ERROR,       title: 'ERRORE SALVATAGGIO',
        message: "Impossibile aggiornare il gioco."
    },
    CREATE_SUCCESS: {       type: TYPE.SUCCESS,     title: 'OPERAZIONE COMPLETATA',
        message: "Gioco creato con successo!"
    },
    MODIFY_SUCCESS: {       type: TYPE.SUCCESS,     title: 'OPERAZIONE COMPLETATA',
        message: "Gioco aggiornato con successo!"
    },
    DELETE_SUCCESS: {       type: TYPE.SUCCESS,     title: 'ELIMINATO',
        message: 'Il gioco è stato rimosso con successo.'
    },
    LEAVE_FORM_CONFIRM: {   type: TYPE.CONFIRM,     title: 'MODIFICHE NON SALVATE',
        message: 'Se torni indietro perderai i dati inseriti. Vuoi uscire?'
    },
    DELETE_GAME_CONFIRM: {  type: TYPE.CONFIRM,     title: 'ELIMINA GIOCO',
        message: 'Sei sicuro di voler eliminare definitivamente'
    }
};

function notifyMessage(messageConfig, callbacks = {}) {
    openPopUp(messageConfig.type, { title: messageConfig.title, message: messageConfig.message, ...callbacks });
}

//------------------------------------ ERROR (TYPE.ERROR) ------------------------------------

export function showErrorGetGame(onOk)  { notifyMessage(MESSAGES.GET_GAME_ERROR, { onOk });  }
export function showNetworkError(onOk)  { notifyMessage(MESSAGES.NETWORK_ERROR,  { onOk });  }
export function showCreateError(onOk)   { notifyMessage(MESSAGES.CREATE_ERROR,   { onOk });  } 
export function showModifyError(onOk)   { notifyMessage(MESSAGES.MODIFY_ERROR,   { onOk });  }

//---------------------------------  SUCCESS (TYPE.SUCCESS) --------------------------------- 

export function showCreateSuccess(onOk) { notifyMessage(MESSAGES.CREATE_SUCCESS, { onOk }); }
export function showModifySuccess(onOk) { notifyMessage(MESSAGES.MODIFY_SUCCESS, { onOk }); }
export function showDeleteSuccess(onOk) { notifyMessage(MESSAGES.DELETE_SUCCESS, { onOk }); }

//--------------------------------- CONFIRM (TYPE.CONFIRM) ---------------------------------

export function askLeaveFormConfirmation(onConfirm, onCancel) {
    notifyMessage(MESSAGES.LEAVE_FORM_CONFIRM, { onConfirm, onCancel });
}

export function askDeleteConfirmation(gameName, onConfirm, onCancel) {
    // Creiamo una copia "al volo" unendo il messaggio base al nome del gioco
    const messageConfig = {
        ...MESSAGES.DELETE_GAME_CONFIRM,
        message: `${MESSAGES.DELETE_GAME_CONFIRM.message} "${gameName}"?`
    };
    notifyMessage(messageConfig, { onConfirm, onCancel });
}