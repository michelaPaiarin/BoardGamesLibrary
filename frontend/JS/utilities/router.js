export const ROUTES = {
    HOME: '',               ADD: 'add',
    MODIFIED: 'modified',   DETAIL: 'detail'
};

let renderView = null;

export function setCallBack(newCallBack) { renderView = newCallBack; }

export function initRouter(mainRenderView) {
    renderView = mainRenderView;

    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && renderView) { renderView(state.viewsName, state.id); }
    });
}

export function navigateTo(viewsName, id = null, pushToHistory = true) {
    if (pushToHistory) {
        const url = id ? `/${viewsName}/${id}` : `/${viewsName}`;
        history.pushState({ viewsName: viewsName, id }, '', url);
    }
    if (renderView) { renderView(viewsName, id); }
}

export function goBack() {
    if (history.length > 1) { history.back(); }
    else                    { navigateTo(ROUTES.HOME); }
}