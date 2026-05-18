const POPUP_CONFIG = {
    Error:   { class: 'popup-error',       footer: 'single' },
    Warn:    { class: 'popup-warn',        footer: 'single' },
    Info:    { class: 'popup-info',        footer: 'single' },
    Success: { class: 'popup-success',     footer: 'single' },
    Confirm: { class: 'popup-confirm',     footer: 'double' }
};

const BUTTON_ID = {
    Ok: 'popup-ok-btn',
    Cancel: 'popup-cancel-btn',
    Confirm: 'popup-confirm-btn'
};

export const TYPE = {
    ERROR:   'Error',   WARN:    'Warn',    INFO:    'Info',
    SUCCESS: 'Success', CONFIRM: 'Confirm'
};

const footerPrefix = 'popup-footer-';

let previousFocus = null;

export function init(){
    document.querySelectorAll('dialog.popup').forEach(dialog => {
        dialog.addEventListener('close', () => {
            previousFocus?.focus()
        });
    });
}

function clearPopUp(){

}

export function openPopUp(Type, popUpData){
    const dialog = document.getElementById('popup');
    const config = POPUP_CONFIG[Type];
    dialog.querySelector('.popup-title').textContent = data.title;
    dialog.querySelector('.popup-text').textContent  = data.message;

    dialog.classList.add(config.class);

    dialog.querySelector(footerPrefix + config.footer).remove('hidden');

    if(config.footer == 'single'){
        dialog.querySelector(BUTTON_ID.Ok).addEventListener('click', data.onOk);
    }else{
        dialog.querySelector(BUTTON_ID.Confirm).addEventListener('click', data.onConfirm);
        dialog.querySelector(BUTTON_ID.Cancel).addEventListener('click', data.onCancel);
    }
    
    previousFocus = document.activeElement
    dialog.showModal()
}

function closePopUp(){

}