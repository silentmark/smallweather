import { joinEffects, availableEffects } from "./const.js";

export function treatWeatherObj(currentWeather, system, feelslikemax, feelslikemin) {
    currentWeather.windspeedFriendly = stringfyWindSpeed(currentWeather.windspeed)
    currentWeather.winddirFriendly = stringfyWindDir(currentWeather.winddir)
    currentWeather.feelslikeC = roundNoFloat(fahrToCelsius(system, currentWeather.feelslike))
    currentWeather.feelslikemaxC = roundNoFloat(fahrToCelsius(system, feelslikemax))
    currentWeather.feelslikeminC = roundNoFloat(fahrToCelsius(system, feelslikemin))
    currentWeather.unit = unit(system)

    let stringIcon = stringfyWeather(currentWeather.cloudcover, currentWeather.humidity, inToMm(currentWeather.precip), currentWeather.precipprob, currentWeather.preciptype, currentWeather.snow, currentWeather.snowdepth, fahrToCelsius('metric', currentWeather.temp), currentWeather.visibility, currentWeather.dew, currentWeather.windspeed, currentWeather.datetime)

    Object.assign(currentWeather, stringIcon)

    return currentWeather
}

export function inToMm(number) {
    return number * 25.4
}

// https://www.visualcrossing.com/resources/documentation/weather-data/weather-data-documentation/
export function stringfyWeather(cloudCover, humidity, precipitation, precipProb, precipType, snow, snowDepth, temperature, visibility, dew, windSpeed, dateTime) {
    let effects = [];
    let weatherStr = '', cloudStr = '', precStr = '', visiStr = '', icon = '';
    let weatherStrPl = '', cloudStrPl = '', precStrPl = '', visiStrPl = '';
    let obj = {}, effect = [];
    const isSnow = precipType?.includes('snow')
    dateTime = Math.abs(dateTime.slice(0, 2))

    // https://spectrumlocalnews.com/nc/charlotte/weather-stories/2019/07/07/mostly-sunny--partly-cloudy--mostly-cloudy--what-s-the-difference-
    if (cloudCover <= 10 && precipProb == 0) {
        cloudStr = 'clear'
        cloudStrPl = 'bezchmurnie'
    }
    else if (cloudCover <= 20 && precipProb == 0) {
        cloudStr = 'fair'
        cloudStrPl = 'przeważnie bezchmurnie'
        effects.push(availableEffects.LightClouds)
    }
    else if (cloudCover <= 60) {
        cloudStr = 'partly cloudy'
        cloudStrPl = 'częściowo zachmurzone'
        effects.push(availableEffects.ModerateClouds)
    }
    else if (cloudCover <= 90) {
        cloudStr = 'mostly cloudy'
        cloudStrPl = 'przeważnie zachmurzone'
        effects.push(availableEffects.HeavyClouds)
    }
    else {
        cloudStr = 'overcast'
        cloudStrPl = 'pochmurnie'
        effects.push(availableEffects.Overcast)
    }

    icon = removeSpaces(cloudStr)
    effect.push(camelize(icon).replace('-', ''))

    if (icon != 'overcast')
        if (dateTime >= 6 && dateTime <= 18) icon += '-day'
        else icon += '-night'

    // https://climate.weather.gc.ca/glossary_e.html and https://weatherins.com/rain-guidelines/
    if (precipProb == 100) {
        if (precipitation <= 0.2) {
            if (temperature > 0 && !isSnow) {
                precStr = 'Drizzle';
                precStrPl = 'Mżawka';
                effects.push(availableEffects.LightRain);
            } 
            else {
                precStr = 'Snow grains';
                precStrPl = 'Płatki śniegu';
                effects.push(availableEffects.LightSnow);
            }
            precStr += ', ';
        }
        else if (precipitation < 2) {
            precStr = 'Light ' + precType(temperature, humidity, isSnow).precStr;
            precStrPl = 'Lekkie opady ' + precType(temperature, humidity, isSnow).precStrPl;
            if (isSnow) {
                effects.push(availableEffects.ModerateSnow);
            } else {
                effects.push(availableEffects.ModerateRain);
            }
        }
        else if (precipitation <= 7.5) {
            precStr = 'Moderate ' + precType(temperature, humidity, isSnow).precStr;
            precStrPl = 'Umiarkowane opady ' + precType(temperature, humidity, isSnow).precStrPl;
            if (isSnow) {
                effects.push(availableEffects.HeavySnow);
            } else {
                effects.push(availableEffects.HeavyRain);
            }
        }
        else if (precipitation > 7.5 && precipitation <= 16) {
            precStr = 'Heavy ' + precType(temperature, humidity, isSnow).precStr;
            precStrPl = 'Intensywne opady ' + precType(temperature, humidity, isSnow).precStrPl;
            if (isSnow) {
                effects.push(availableEffects.BlusterSnow);
            } else {
                effects.push(availableEffects.BlusterRain);
            }
        }
        else if (temperature < 0 && isSnow) {
            precStr = 'Blizzard, '// more study for this case
            precStrPl = 'Burza śnieżna, '
            effects.push(availableEffects.WhiteoutSnow)
        }
        else {
            precStr = 'Thunderstorm, ' // Still gotta account for hailstorm. 
            precStrPl = 'Burza z piorunami, '
            effects.push(availableEffects.Lightning)
            effects.push(availableEffects.BlusterRain);
        }
    }

    if (precStr) {
        icon = removeSpaces(precStr)
        effect.push(camelize(icon).replace('-', ''))
    }
    
    // https://ambientweather.com/faqs/question/view/id/1816/#:~:text=Mist%20forms%20when%20the%20relative,time%2C%20the%20humidity%20will%20increase. and https://www.weather.gov/source/zhu/ZHU_Training_Page/fog_stuff/forecasting_fog/FORECASTING_FOG.htm and https://mediawiki.ivao.aero/index.php?title=Fog,_mist_and_haze
    if (windSpeed < 18) {
        if (visibility) {
            if (visibility <= 0.63 && Math.abs(temperature - dew) <= 2.5) {
                visiStr = ', with fog'
                visiStrPl = ', z mgłą'
                effects.push(availableEffects.LightFog);
            }
            else if (visibility >= 1.26 && visibility < 3.1 && humidity >= 60) {
                visiStr = ', with mist'
                visiStrPl = ', z mgiełką'
                effects.push(availableEffects.ModerateFog);
            }
            else if (visibility < 3.1 && humidity < 60) {
                visiStr = ', with haze'
                visiStrPl = ', z zamgleniem'
                effects.push(availableEffects.HeavyFog);
            }
        }
    }
    
    if (!precStr && visiStr) {
        icon = removeSpaces(visiStr)
        // effect.push(camelize(icon).replace('-', '')) When I add effects for mist, haze and fog in Weather FX I re-implement this
    }

    weatherStr = precStr + cloudStr + visiStr;
    weatherStrPl = precStrPl + cloudStrPl + visiStrPl;

    obj.weatherStr = capitalizeFirstLetter(weatherStrPl)
    let combinedEffect = effects[0];
    for (let i = 1; i < effects.length; i++) {
        combinedEffect = joinEffects(combinedEffect, effects[i]);
    }
    obj.fxEffect = combinedEffect;
    obj.icon = icon
    obj.effect = effect
    return obj
}

function precType(temperature, humidity, isSnow) {
    let precStr = ''
    let precStrPl = '';
    // https://newtoski.com/how-humidity-affects-snow/ and https://sites.psu.edu/siowfa14/2014/10/24/why-does-humidity-affect-snow/#:~:text=In%20relation%20to%20snow%2C%20when,is%20high%20the%20snow%20melts.
    if (temperature < 0 && isSnow) {
        precStr = 'snow'
        precStrPl = 'śniegu'
    } else {
        precStr = 'rain'
        precStrPl = 'deszczu'
    }
    return { precStr: precStr + ', ', precStrPl: precStrPl + ', ' }
}

export function getApiDate(year, days) {
    let result = new Date(year, 0, 1);
    result.setDate(result.getDate() + days);
    return dateToString(result)
}

export function dateToString(unixDate) {
    let dateString = `${unixDate.getUTCFullYear()}-${pad2(unixDate.getUTCMonth() + 1)}-${pad2(unixDate.getUTCDate())}`;
    return dateString
}

export function unit(system) {
    switch (system) {
        case 'metric': return 'ºC'
        case 'uk': return 'ºC'
        case 'us': return 'F'
    }
}

export function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

export function fahrToCelsius(system, fahrTemp) {
    if (system === 'us') return fahrTemp
    else {
        let celsiusTemp = (fahrTemp - 32) * 5 / 9
        return celsiusTemp
    }
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeSpaces(string) {
    string = string.replace('with ', '')
    string = string.replace(', ', '')
    string = string.replace(/[\s+]/g, '-').toLowerCase()
    string = string.replace('--', '-').toLowerCase()
    return string
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export function mphToKph(system, mph) {
    if (system === 'us') return mph
    else {
        let kph = mph * 1.60934
        return kph
    }
}

export function stringfyWindSpeed(number) { // table from https://www.weather.gov/pqr/wind
    if (number == 0) return 'Cisza'
    else if (number <= 3) return 'Lekki powiew'
    else if (number <= 7) return 'Słaby wiatr'
    else if (number <= 12) return 'Łagodny wiatr'
    else if (number <= 18) return 'Umiarkowany wiatr'
    else if (number <= 24) return 'Świeży wiatr'
    else if (number <= 31) return 'Silny wiatr'
    else if (number <= 38) return 'Bardzo silny wiatr'
    else if (number <= 46) return 'Sztorm'
    else if (number <= 54) return 'Silny sztorm'
    else if (number <= 63) return 'Bardzo silny sztorm'
    else if (number <= 75) return 'Gwałtowny sztorm'
    else if (number > 75) return 'Huragan'
}

export function stringfyWindDir(number) { //table from http://snowfence.umn.edu/Components/winddirectionanddegreeswithouttable3.htm
    if (348.75 <= number || number <= 11.25) return 'Północny'
    if (11.25 < number && number <= 33.75) return 'Północny, północno-wschodni'
    if (33.75 < number && number <= 56.25) return 'Północno-wschodni'
    if (56.25 < number && number <= 78.75) return 'Wschodni, północno-wschodni'
    if (78.75 < number && number <= 101.25) return 'Wschodni'
    if (101.25 < number && number <= 123.75) return 'Wschodni, południowo-wschodni'
    if (123.75 < number && number <= 146.25) return 'Południowo-wschodni'
    if (146.25 < number && number <= 168.75) return 'Południowy, południowo-wschodni'
    if (168.75 < number && number <= 191.25) return 'Południowy'
    if (191.25 < number && number <= 213.75) return 'Południowy, południowo-zachodni'
    if (213.75 < number && number <= 236.25) return 'Południowo-zachodni'
    if (236.25 < number && number <= 258.75) return 'Zachodni, południowo-zachodni'
    if (258.75 < number && number <= 281.25) return 'Zachodni'
    if (281.25 < number && number <= 303.75) return 'Zachodni, północno-zachodni'
    if (303.75 < number && number <= 326.25) return 'Północno-zachodni'
    if (326.25 < number && number <= 348.75) return 'Północny, północno-zachodni'
}

export function roundNoFloat(number) {
    number = Math.round((number + Number.EPSILON))
    return number
}