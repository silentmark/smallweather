import { MODULE, MODULE_DIR, FXMStyleTypes, joinEffects, availableEffects } from "./const.js";
import { getApiDate, treatWeatherObj } from "./util.js";
import { registerSettings, localCacheSettings, cacheSettings } from "./settings.js";

let lastUpdateInfo = null;
let sceneReady = false;

Hooks.once("init", () => {
    registerSettings();
    cacheSettings();
});

Hooks.on('canvasReady', async function () {
    sceneReady = true;
    if (localCacheSettings.fx && localCacheSettings.currentWeather) {
      await activateFX(localCacheSettings.currentWeather);
    }
});

Hooks.once('ready', async function () {
    console.info(" ======================================== ⛅ SmallWeather ======================================== ")
    if (!localCacheSettings.weatherAPIKey && game.user.isGM) {
        missingAPI();
    }
});

Hooks.on('ready', async function () {
    game.socket.on('module.smallweather', (data) => {
        doSocket(data);
    });
});

Hooks.on('smallweatherUpdate', async function (weather) {
    emitSocket('handleWeatherApp', weather);
})

Hooks.on('renderSmallTimeApp', async function (app, html) {
    if (game.user.isGM)
        await injectIntoSmallTime(localCacheSettings.currentWeather, true)
    else if (localCacheSettings.allowPlayers)
        await injectIntoSmallTime(localCacheSettings.currentWeather, true)
})

Hooks.on(SimpleCalendar.Hooks.DateTimeChange, async function (data) {
    if (game.user.isGM) {
        if (localCacheSettings.debug) console.info('⛅ SmallWeather Debug | SimpleCalendar.Hooks.DateTimeChange. data variable: ', data)
        if (localCacheSettings.weatherAPIKey) {
            let currentDateTimestamp = SimpleCalendar.api.dateToTimestamp(SimpleCalendar.api.getCurrentCalendar().currentDate);
            let hoursChanged = Math.floor(Math.abs((currentDateTimestamp - (lastUpdateInfo?.timestamp ?? 0))) / 3600) // check if hour changed.
            let daysChanged = Math.floor(Math.abs((currentDateTimestamp - (lastUpdateInfo?.timestamp ?? 0))) / 86400) // check if day changed.
            if (localCacheSettings.mode == 'hourly' && hoursChanged) {
                let offsetData = calculateOffset(currentDateTimestamp);
                await weatherUpdate(offsetData);
            } else if (localCacheSettings.mode == 'daily' && daysChanged) {
                let offsetData = calculateOffset(currentDateTimestamp);
                await weatherUpdate(offsetData);
            }
        }
    }
});

function calculateOffset(currentDateTimestamp) { 
    let currentDate = SimpleCalendar.api.getCurrentCalendar().currentDate;
    let yearStartingDate = SimpleCalendar.api.getCurrentCalendar().currentDate;
    yearStartingDate.month = 0;
    yearStartingDate.day = 0;
    yearStartingDate.hour = 0;
    yearStartingDate.seconds = 0;
    yearStartingDate.minute = 0; 
    let yearStartingDateTimestamp = SimpleCalendar.api.dateToTimestamp(yearStartingDate);    
    let daysOffset = Math.floor((currentDateTimestamp - yearStartingDateTimestamp) / 86400) // check how many days passed since the start of the year
    let yearEndDate = SimpleCalendar.api.timestampToDate(yearStartingDateTimestamp - 86400);
    yearEndDate.month = 0;
    yearEndDate.day = 0;
    yearEndDate.hour = 0;
    yearEndDate.seconds = 0;
    yearEndDate.minute = 0; 
    let previousYearDateTimestamp = SimpleCalendar.api.dateToTimestamp(yearEndDate);
    let numberOfDaysInYear = (yearStartingDateTimestamp - previousYearDateTimestamp) / 86400;
    let daysRatio = 365 / numberOfDaysInYear;
    daysOffset = Math.floor(daysOffset * daysRatio);
    let hoursOffset = Math.floor(currentDate.seconds / 3600)
    return { hours: hoursOffset, days: daysOffset };
}

async function injectIntoSmallTime(currentWeather, load) {
    if (!load) {
        if (game.user.isGM) {
            Hooks.call('smallweatherUpdate', currentWeather);
        }
        $("#weather-app").remove()
    }
    const html = $('div[id="smalltime-app"]')
    const injection = `
        <form class="flexcol" id="weather-app">
        <div id="displayContainer-weatherapp">
        <div id="current-temp">
            <img id="temp-icon" src="${MODULE_DIR}/images/${currentWeather.icon}.webp" ></img>
            <span id="temp"> ${currentWeather.feelslikeC}${currentWeather.unit}</span>
        </div>
        <div id="high-low">
            <i class="fas fa-temperature-high" id="fa-icon"></i><span id="temp"> ${currentWeather.feelslikemaxC}${currentWeather.unit}</span><br>
            <i class="fas fa-temperature-low" id="fa-icon"></i><span id="temp"> ${currentWeather.feelslikeminC}${currentWeather.unit}</span>
        </div>
        <div id="wind">
            <i class="fas fa-wind" id="fa-icon"></i><span id="temp"> ${currentWeather.windspeedFriendly}</span><br>
            <i class="far fa-compass" id="fa-icon"></i><span id="temp"> ${currentWeather.winddirFriendly}</span>
        </div>
        ${game.user.isGM ? '<div id="configWeather"><i class="fa-solid fa-bars"></i></div>' : ''}        
        <div id="weather-text">${currentWeather.weatherStr}</div>
        </div>
        <div id="rightHandle"></div>
        </form>`
    const dragHandle = html.find('#dragHandle')
    const formGroup = dragHandle.closest("form")
    formGroup.after(injection)
    html.find('#rightHandle').on('click', async function () {
        if (!$('#weather-app').hasClass('show')) {
            $('#weather-app').addClass('show');
            $('#weather-app').animate({ width: '325px', left: "+=200" }, 80);
            $("#smalltime-app .window-content").css("border-radius", "5px 0 0 5px")
            $('#rightHandle').css("width", "331px")
            await game.settings.set(MODULE, 'show', true);
        } else {
            $('#weather-app').removeClass('show');
            $('#weather-app').animate({ width: '325px', left: "-=200" }, 80);
            $("#smalltime-app .window-content").css("border-radius", "5px")
            $('#rightHandle').css("width", "206px")
            await game.settings.set(MODULE, 'show', false);
        }
        cacheSettings();
    });
    html.find('#timeDisplay').on('click', async function () {
        await new Promise(resolve => setTimeout(resolve, 100));
        let smalltimeHeight = $("#smalltime-app").css("height")
        $("#weather-app").css("height", smalltimeHeight)
    });
    const dateDisplayShow = game.settings.get('smalltime', 'date-showing');
    if (!dateDisplayShow) {
        $("#weather-app").css("height", $("#smalltime-app").css("height"))
    }
    let show = localCacheSettings.show;
    if (show) {
        $('#weather-app').addClass('show');
        $('#weather-app').css("width", '325px')
        $('#weather-app').css("left", "+=200")
        $('#rightHandle').css("width", "331px")
        $("#smalltime-app .window-content").css("border-radius", "5px 0 0 5px")
    }
    await activateFX(currentWeather);
}

export async function weatherUpdate(data = { hours: 0, days: 0}) {
    let newWeather = await getWeather(data.days); // here we get new data but using the query size specified by the user

    if (typeof newWeather == 'number') return errorAPI(newWeather)
    if (localCacheSettings.debug) console.warn("⛅ SmallWeather Debug | weatherUpdate function. variable newWeather: ", newWeather.days[0].datetime, newWeather)
    let currentWeather = newWeather.days[0];
    if (localCacheSettings.mode == "hourly") {
        currentWeather = newWeather.days[0].hours[data.hours]
    }
    currentWeather = treatWeatherObj(currentWeather, localCacheSettings.system, newWeather.days[0].feelslikemax, newWeather.days[0].feelslikemin);

    await game.settings.set(MODULE, "currentWeather", currentWeather)
    cacheSettings();

    if (localCacheSettings.debug) console.info("⛅ SmallWeather Debug | weatherUpdate function. variable currentWeather: ", currentWeather)
    await injectIntoSmallTime(currentWeather)
}

export function missingAPI() {
    new Dialog({
        title: "SmallWeather | API key is missing!",
        content: '<p>In order to generate your API key go to:</p><a href="https://www.visualcrossing.com/sign-up">https://www.visualcrossing.com/sign-up</a><p>Then copy and paste it in SmallWeather settings.</p>',
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "OK",
                callback: async () => {
                    return
                }
            },
        },
        default: "yes",
    }).render(true);
}

export function errorAPI(error) {
    new Dialog({
        title: "SmallWeather | API Error!",
        content: `<div id="errordialogcontent"><img id="errorsign" width="32"  style="border:none" src="${MODULE_DIR}/images/error.svg" ></img><span id="errordialog">API fetch method returned ${error} error.</span></div>`,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "OK",
                callback: async () => {
                    return
                }
            },
        },
        default: "yes",
    }, { height: 120 }).render(true);
}

// Helper function for handling sockets.
function emitSocket(type, payload) {
    game.socket.emit('module.smallweather', {
        type: type,
        payload: payload,
    });
}

async function doSocket(data) {
    if (data.type === 'handleWeatherApp') {
        if (!game.user.isGM) handleWeatherApp(data.payload);
    }
}

function handleWeatherApp(weather) {
    return injectIntoSmallTime(weather, false)
}

async function getWeather(days = 0, apiParameters = {}) {
    if (!localCacheSettings.weatherAPIKey) return

    let apiDefaultParameters = {
        dataUnit: 'us', //metric, us, uk
        location: localCacheSettings.location,
        date: getApiDate(localCacheSettings.startingYear, days),
        weatherAPIKey: localCacheSettings.weatherAPIKey
    }
    apiParameters = { ...apiDefaultParameters, ...apiParameters }

    //&lang=id
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${apiParameters.location}/${apiParameters.date}?unitGroup=${apiParameters.dataUnit}&include=days,hours&key=${apiParameters.weatherAPIKey}&contentType=json`

    let apiCall = await fetch(url, {
        "method": "GET",
        "headers": {}
    })
    
    if (!apiCall.ok) return apiCall.status
    
    let response = await apiCall.json()

    cacheWeatherData(response);
    if (localCacheSettings.debug) {
        console.warn("⛅ SmallWeather Debug | async function getWeather. Api Parameters Data", apiParameters.location, apiParameters.date, apiParameters.dateFinal, apiParameters)
        console.warn("⛅ SmallWeather Debug | async function getWeather. variable simpleCalendarData: ", simpleCalendarData)
        console.warn(url)
    }
    return response
}

async function cacheWeatherData(response) {
    let simpleCalendarData = {
        day: SimpleCalendar.api.getCurrentDay(),
        month: SimpleCalendar.api.getCurrentMonth(),
        year: SimpleCalendar.api.getCurrentYear(),
        season: SimpleCalendar.api.getCurrentSeason(),
    }
    simpleCalendarData.timestamp = SimpleCalendar.api.dateToTimestamp(SimpleCalendar.api.getCurrentCalendar().currentDate);
    simpleCalendarData.currentWeather = response;
    lastUpdateInfo = simpleCalendarData;
}


  // need to turn any old ones off separately first...
async function activateFX(weatherData) {
    if (!sceneReady)
      return;

    if (!weatherData)
      return;

    if (!game.scenes?.active?.getFlag(MODULE, 'auto-apply'))
       return;

    if (game.scenes?.active?.weather)
        return;

    const effectOptions = weatherData.fxEffect;

    if (game.user.isGM) {
        // turn off any old ones
        await deactivateFX();

        if (!effectOptions)
            return;

        if (effectOptions.fxMaster) {
            const effects = effectOptions.fxMaster;
            const fxEffects = (game.scenes?.active?.getFlag('fxmaster', 'effects') || {});

            for (let e = 0; e < effects.length; e++) {
                const name = effectOptions.name + '-' + e;

                if (effects[e].style === FXMStyleTypes.Particle) {
                    // adjust options
                    const options = structuredClone(effects[e].options);
                    
                    // override direction
                    if (options.direction) {
                        //TODO: wind direction? 
                        options.direction = Math.floor(Math.random() * (options.direction.end - options.direction.start)) + options.direction.start;
                    }
                    fxEffects[name] = { type: effects[e].type, options: options };
                } else if (effects[e].style === FXMStyleTypes.Filter) {
                    await FXMASTER.filters.addFilter(name, effects[e].type, effects[e].options);
                }
            }
            await game.scenes?.active?.setFlag('fxmaster', 'effects', fxEffects);
        }
    }
}

async function deactivateFX() {
    if (game.user.isGM) {
        // this isn't really safe because this is checking an internal setting but it's too easy to 
        //    get out of sync with FX master, in which case attempting to turn something off may actually
        //    add it instead
        let fxEffects = (game.scenes?.active?.getFlag('fxmaster', 'effects') || {});
        for (let e in fxEffects) { 
            if (e.startsWith('swr-')) {
                delete fxEffects[e];
                fxEffects['-=' + e] = null;
            }
        }
        await game.scenes?.active?.setFlag('fxmaster', 'effects', fxEffects);
        for (let e in FXMASTER.filters.filters) {
            if (e.startsWith('swr-')) {
                await FXMASTER.filters.removeFilter(e);
            }
        }
    }
}

Hooks.on('renderSceneConfig', async (app, html) => {
    if (!hasProperty(app.object, `data.flags.${MODULE}.auto-apply`)) {
        app.object.setFlag(MODULE, 'auto-apply', true);
    }
    const autoapplyCheckStatus = app.object.getFlag(MODULE, 'auto-apply') ? 'checked' : '';
    const injection = `
    <hr>
    <style> .wfx-scene-config {
        border: 1px solid #999;
        border-radius: 8px;
        margin: 8px 0;
        padding: 0 15px 5px 15px;
    }</style>
    <fieldset class="wfx-scene-config">
      <legend> <i class="fas fa-cloud-sun"></i><span>Weather FX</span> </legend>
      <div class="form-group">
        <label>Auto Apply</label>
        <input
          type="checkbox"
          name="flags.${MODULE}.auto-apply"
          ${autoapplyCheckStatus}>
        <p class="notes">Autoapply weather effects from SmallWeather to scene.</p>
      </div>
    </fieldset>`;
    const weatherEffect = html.find('select[name="weather"]');
    const formGroup = weatherEffect.closest(".form-group");
    formGroup.after(injection);
    app.setPosition({ height: "auto" });
})