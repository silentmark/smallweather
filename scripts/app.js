export class weatherApp extends FormApplication {
    static _isOpen = true;

    async _render(force = false, options = {}) {
        await super._render(force, options);
        weatherApp._isOpen = true;
        delete ui.windows[this.appId];
    }

    static get defaultOptions() {
        this.initialPosition = game.settings.get('smalltime', 'position');
        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            submitOnChange: true,
            closeOnSubmit: false,
            minimizable: false,
            template: 'modules/smallweather/templates/smallweather.html',
            id: 'smallweather-app',
            title: 'Weather FX',
            top: this.initialPosition.top,
            left: this.initialPosition.left,
        });
    }

    static async toggleAppVis(mode) {
        if (!game.modules.get('smalltime').viewAuth) return;
        if (mode === 'toggle') {
            if (game.settings.get('smalltime', 'visible') === true) {
            } else {
                if (weatherApp._isOpen) {
                    game.modules.get('smalltime').myApp.close({ smallTime: true });
                }
            }
        } else if (game.settings.get('smalltime', 'visible') === true) {
            game.modules.get('smallweather').myApp = await new weatherApp().render(true);
        }
    }
}