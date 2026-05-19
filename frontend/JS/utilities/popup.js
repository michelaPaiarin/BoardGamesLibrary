const POPUP_CONFIG = {
    Error:   { class: 'popup-error',       footer: 'single' },
    Warn:    { class: 'popup-warn',        footer: 'single' },
    Info:    { class: 'popup-info',        footer: 'single' },
    Success: { class: 'popup-success',     footer: 'single' },
    Confirm: { class: 'popup-confirm',     footer: 'double' }
};

const ID = {
    Title:   '.popup-title',        Text:    '.popup-text',            
    BtnOk:      '.popup-ok-btn',    BtnCancel:  '.popup-cancel-btn',    BtnConfirm: '.popup-confirm-btn',
}

const CLEARABLE_ID = [ID.Title, ID.Text];
const FOOTER_ID = ['.popup-footer-single', '.popup-footer-double'];

export const TYPE = {
    ERROR:   'Error',   WARN:    'Warn',    INFO:    'Info',
    SUCCESS: 'Success', CONFIRM: 'Confirm'
};

const footerPrefix = '.popup-footer-';

let previousFocus = null;
let popUp = null;           //The DOM element

export function init(){
    document.querySelectorAll('dialog.popup').forEach(dialog => {
        dialog.addEventListener('close', () => {
            previousFocus?.focus()
        });
    });
    popUp = document.getElementById('popup');
}

function clearPopUp(){
    CLEARABLE_ID.forEach(id => popup.querySelector(id).textContent = '');
    FOOTER_ID.forEach(id => popup.querySelector(id).classList.add('hidden'));
    Object.values(POPUP_CONFIG).forEach(config => dialog.classList.remove(config.class));
}

/**
 * Apre un pop-up
 * @param {Object} popUpData
 *      @param {String} popUpData.title         @param {String} popUpData.message
 *      @param {Function} [popUpData.onOK]      @param {Function} [popUpData.onConfirm]     @param {Function} [popUpData.onCancel]
*/
export function openPopUp(Type, popUpData){
    if(!popUp){console.log("Pop-up non inizializzato"); return;}
    clearPopUp();
    const config = POPUP_CONFIG[Type];
    popUp.querySelector(ID.Title).textContent = popUpData.title;
    popUp.querySelector(ID.Text).textContent  = popUpData.message;

    popUp.classList.add(config.class);

    console.log(footerPrefix + config.footer);
    console.log(dialog.querySelector(footerPrefix + config.footer));

    popUp.querySelector(footerPrefix + config.footer).classList.remove('hidden');

    if(config.footer == 'single'){
        popUp.querySelector(ID.BtnOk).addEventListener('click', popUpData.onOk, {once: true});
    }else{
        popUp.querySelector(ID.BtnConfirm).addEventListener('click', popUpData.onConfirm, {once: true});
        popUp.querySelector(ID.BtnCancel).addEventListener('click', popUpData.onCancel, {once: true});
    }   
    
    previousFocus = document.activeElement
    dialog.showModal()
}

export function closePopUp(){
    console.log('ho chiuso il popup');
}