export const TYPE = {
    ERROR:   'Error',   WARN:    'Warn',    INFO:    'Info',
    SUCCESS: 'Success', CONFIRM: 'Confirm'
};

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

const FOOTER_BUTTONS = [
    { id: ID.BtnOk,         keyAction: 'onOk'       },
    { id: ID.BtnConfirm,    keyAction: 'onConfirm'  },
    { id: ID.BtnCancel,     keyAction: 'onCancel'   }
];

const footerPrefix = '.popup-footer-';

let previousFocus = null;
let popUp = null;           //The DOM element

export function init(){
    popUp = document.getElementById('popup');
    popUp.querySelector('.popup-close-btn').addEventListener('click', () => popUp.close());
    popUp.addEventListener('close', () => previousFocus?.focus());
    popUp.addEventListener('click', (e) => { if (e.target === popUp) popUp.close(); });
}

function clearPopUp(){
    CLEARABLE_ID.forEach(id => popUp.querySelector(id).textContent = '');
    popUp.querySelectorAll('.popup-footer').forEach(f => f.classList.add('hidden'));
    Object.values(POPUP_CONFIG).forEach(config => popUp.classList.remove(config.class));
}

/**
 * Apre un pop-up
 * @param {Object} popUpData
 *      @param {String} popUpData.title         @param {String} popUpData.message
 *      @param {Function} [popUpData.onOK]      @param {Function} [popUpData.onConfirm]     @param {Function} [popUpData.onCancel]
*/
export function openPopUp(Type, popUpData){
    if(!popUp){return;}
    clearPopUp();
    const config = POPUP_CONFIG[Type];
    popUp.querySelector(ID.Title).textContent = popUpData.title;
    popUp.querySelector(ID.Text).textContent  = popUpData.message;

    popUp.classList.add(config.class);

    popUp.querySelector(footerPrefix + config.footer).classList.remove('hidden');

    FOOTER_BUTTONS.forEach(({ id, keyAction }) => {
        popUp.querySelector(id).onclick = () => { popUpData[keyAction]?.();    popUp.close(); };
    });
    
    previousFocus = document.activeElement
    popUp.showModal()
}