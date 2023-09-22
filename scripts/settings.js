import { MODULE } from "./const.js"
import { weatherUpdate } from "./smallweather.js";

export let defaultWeather = {
    feelslikeC: 20,
    feelslikemaxC: 25,
    feelslikeminC: 17,
    winddirFriendly: 'North',
    windspeedFriendly: 'Gentle Breeze',
    conditions: 'clear',
    unit: 'F',
    icon: 'clear-day',
    timestamp: 0
};

export let localCacheSettings = {}; 
localCacheSettings.mode = 'hourly';
localCacheSettings.system = 'us';
localCacheSettings.location = 'Berlin';
localCacheSettings.startingYear = '2020';
localCacheSettings.currentWeather = defaultWeather;
localCacheSettings.weatherAPIKey = '';
localCacheSettings.debug = false;
localCacheSettings.allowPlayers = true;
localCacheSettings.show = false;

export function registerSettings() {
    game.settings.register(MODULE, 'weatherAPIKey', {
        name: 'Weather API Key',
        hint: `In order to generate your API key go to: https://www.visualcrossing.com/sign-up, save it and paste up here. `,
        scope: 'world',
        config: true,
        type: String,
        default: '',
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'unitSystem', {
        name: 'Unit System',
        hint: `Choose the unit system.`,
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "us": "Imperial/US",
            "metric": "Metric"
        },
        default: "us",
        restricted: true,
        onChange: async () => {
            cacheSettings();
            await weatherUpdate(0, false, false);
        },
    });

    game.settings.register(MODULE, 'allowPlayers', {
        name: 'Allow Players To See Weather App ',
        hint: `Allow players to have the weather app and see the current weather information.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
    
    game.settings.register(MODULE, 'queryMode', {
        name: 'Query Mode',
        hint: `Choose the update frequency hourly or daily.`,
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "hourly": "Hourly",
            "daily": "Daily"
        },
        default: "hourly",
        restricted: true,
        onChange: async () => {
            cacheSettings();
            await weatherUpdate();
        },
    });

    game.settings.register(MODULE, 'location', {
        name: 'Source Location',
        hint: `Location that will be used for querying the weather history. Choose a location that will fit your climate.`,
        scope: 'world',
        config: true,
        type: String,
        default: 'Berlin',
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'startingYear', {
        name: 'Starting Year',
        hint: `Year that will be used for querying the weather history. Month, day and hour will be calculated based on SimpleCalendar configuration.`,
        scope: 'world',
        config: true,
        type: String,
        default: '2020',
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'currentWeather', {
        name: 'currentWeather',
        hint: '',
        scope: 'world',
        config: false,
        type: Object,
        default: defaultWeather,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'show', {
        name: 'show',
        hint: '',
        scope: 'client',
        config: false,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
    
    /**********************
    DEBUG
    **********************/
    game.settings.register(MODULE, 'debug', {
        name: 'Debug',
        hint: `Activate debug to show console logs`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: debug,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
}

// function that get the settings options and assign to the variables
export async function cacheSettings() {
    localCacheSettings = {};
    localCacheSettings.mode = game.settings.get(MODULE, 'mode');
    localCacheSettings.system = game.settings.get(MODULE, 'unitSystem');
    localCacheSettings.location = game.settings.get(MODULE, 'location');
    localCacheSettings.startingYear = game.settings.get(MODULE, 'startingYear');
    localCacheSettings.currentWeather = game.settings.get(MODULE, 'currentWeather');
    localCacheSettings.weatherAPIKey = game.settings.get(MODULE, 'weatherAPIKey');
    localCacheSettings.debug = game.settings.get(MODULE, 'debug');
    localCacheSettings.allowPlayers = game.settings.get(MODULE, 'allowPlayers');
    localCacheSettings.show = game.settings.get(MODULE, 'show');
}
