export const MODULE = "smallweather"; //module name
export const MODULE_DIR = `modules/${MODULE}`; //module folder
export const ModuleSocketName = `module.${MODULE}`;
  
  export const FXMStyleTypes = {
    Filter: 0,
    Particle: 1
  }
  
  export const FXMParticleTypes = {
    Snowstorm: 'snowstorm',
    Bubbles: 'bubbles',
    Clouds: 'clouds',
    Embers: 'embers',
    RainSimple: 'rainsimple',
    Stars: 'stars',
    Crows: 'crows',
    Bats: 'bats',
    Spiders: 'spiders',
    Fog: 'fog',
    RainTop: 'raintop',
    Leaves: 'leaves',
    Rain: 'rain',
    Snow: 'snow'
  };
  
  export const FXMFilterTypes = {
    Lightning: 'lightning',
    Bloom: 'bloom'
  }
  
  // weather options
  export const availableEffects = {
    LightClouds: {
      name: 'swr-light-clouds',
      core: null,
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Clouds,
          options: {
            scale: 1, 
            direction: {start: -30, end: 30},
            speed: 0.4, 
            lifetime: 2, 
            density: 0.03, 
            alpha: 0.7, 
            tint: { value: '#000000', apply: false },
          },
        },
      ],
    },
  
    ModerateClouds: {
      core: null,
      name: 'swr-moderate-clouds',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Clouds,
          options: {
            scale: 1, 
            direction: {start: -30, end: 30},
            speed: 0.2, 
            lifetime: 2.6, 
            density: 0.1, 
            alpha: 0.7, 
            tint: { value: '#ffffff', apply: true },
          },
        },
      ],
    },
  
    HeavyClouds: {
      core: null,
      name: 'swr-heavy-clouds',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Clouds,
          options: {
            scale: 1, 
            direction: {start: -30, end: 30},
            speed: 0.1, 
            lifetime: 2.6, 
            density: 0.3, 
            alpha: 0.5, 
            tint: { value: '#ffffff', apply: true },
          },
        },
      ],
    },
  
    StormClouds: {
      core: null,
      name: 'swr-storm-clouds',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Clouds,
          options: {
            scale: 1, 
            direction: {start: -30, end: 30},
            speed: 0.1, 
            lifetime: 2.6, 
            density: 0.6, 
            alpha: 1.0, 
            tint: { value: '#776e6e', apply: true },
          },
        },
      ],
    },
  
    Overcast: {
      core: null,
      name: 'swr-overcast',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 0.3, 
            lifetime: 1.0,
            density: 0.08, 
            alpha: 1.0,
            tint: { value: '#c2bdbd', apply: true },
          },
        },
      ],
    },
  
    // drifting around, not linear
    BlusterWind: {
      core: null,
      name: 'swr-bluster-wind',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Leaves,
          options: {
            scale: 0.7, 
            speed: 2.8, 
            lifetime: 1, 
            density: 0.1, 
            alpha: 0.8, 
            tint: { value: '#4F4040', apply: true },
          },
        },
      ],
    },
  
    // snow in each direction
    BlusterSnow: {
      core: { effect: 'snow' },
      name: 'swr-bluster-snow',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 1.0, 
            direction: {start: -30, end: 30},
            speed: 2.8, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 1.0, 
            direction: {start: 60, end: 120},
            speed: 2.8, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 1.0, 
            direction: {start:150, end: 210},
            speed: 2.8, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 1.0, 
            direction: {start: 240, end: 300},
            speed: 2.8, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },
  
    LightWind: {
      core: null,
      name: 'swr-light-wind',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 0.6, 
            direction: {start: -15, end: 15},
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#1d1d1b', apply: true },
          },
        },
      ],
    },
  
    ModerateWind: {
      core: null,
      name: 'swr-moderate-wind',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 0.6, 
            direction: {start: -15, end: 15},
            speed: 2.0, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#1d1d1b', apply: true },
          },
        },
      ],
    },
  
    HeavyWind: {
      core: null,
      name: 'swr-heavy-wind',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 0.6, 
            direction: {start: -15, end: 15},
            speed: 3.0, 
            lifetime: 1.0, 
            density: 0.2, 
            alpha: 1.0, 
            tint: { value: '#1d1d1b', apply: true },
          },
        },
      ],
    },
  
    BlusterRain: { 
      core: { effect: 'rain' }, 
      name: 'swr-bluster-rain',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 0.4, 
            direction: {start: -30, end: 30},
            speed: 0.1, 
            lifetime: 0.8, 
            density: 0.1, 
            alpha: 0.7, 
            tint: { value: '#000000', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 0.4, 
            direction: {start: 60, end: 120},
            speed: 0.1, 
            lifetime: 0.8, 
            density: 0.1, 
            alpha: 0.7, 
            tint: { value: '#000000', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 0.4, 
            direction: {start: 150, end: 210 },
            speed: 0.1, 
            lifetime: 0.8, 
            density: 0.1, 
            alpha: 0.7, 
            tint: { value: '#000000', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 0.4, 
            direction: {start: 240, end: 300 },
            speed: 0.1, 
            lifetime: 0.8, 
            density: 0.1, 
            alpha: 0.7, 
            tint: { value: '#000000', apply: false },
          },
        },
      ],
    },

    LightRain: { 
      core: { effect: 'rain' },
      name: 'swr-light-rain',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 1, 
            direction: {start: 60, end: 120},
            speed: 0.1, 
            lifetime: 0.8, 
            density: 0.1, 
            alpha: 0.7, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },

    ModerateRain: { 
      core: { effect: 'rainStorm' },
      name: 'swr-moderate-rain',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 1, 
            direction: {start: 60, end: 120},
            speed: 0.5, 
            lifetime: 0.8, 
            density: 1.0, 
            alpha: 0.7, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },

    HeavyRain: {
      core: { effect: 'rainStorm' },
      name: 'swr-heavy-rain',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 1.3,
            direction: {start: 60, end: 120},
            speed: 0.5, 
            lifetime: 0.8, 
            density: 1.7, 
            alpha: 0.7, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },
    
    LightFog: { 
      core: { effect: 'fog' },
      name: 'swr-light-fog',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 0.5, 
            lifetime: 1.0,
            density: 0.05, 
            alpha: 0.4,
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },

    ModerateFog: { 
      core: { effect: 'fog' },
      name: 'swr-moderate-fog',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 0.5, 
            lifetime: 1.0,
            density: 0.08, 
            alpha: 0.4,
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },

    HeavyFog: { 
      core: { effect: 'fog' },
      name: 'swr-heavy-fog',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 0.5, 
            lifetime: 1.0,
            density: 0.12, 
            alpha: 0.4,
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },

    RollingFog: { 
      core: { effect: 'fog' },
      name: 'swr-rolling-fog',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 3.5, 
            lifetime: 1.0,
            density: 0.08, 
            alpha: 0.4,
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },

    Lightning: {
      core: null,
      name: 'swr-lightning',
      fxMaster: [
        {
          style: FXMStyleTypes.Filter,
          type: FXMFilterTypes.Lightning,
          options: {
            frequency: 500,
            spark_duration: 300,
            brightness: 1.3,
          },
        },
      ],
    },
  
    Wildfire: {
      core: null,
      name: 'swr-wildfire',
      fxMaster: [
        // use lightning to make a flicker
        {
          style: FXMStyleTypes.Filter,
          type: FXMFilterTypes.Lightning,
          options: {
            frequency: 100,
            spark_duration: 2000,
            brightness: 1.1,
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Embers,
          options: {
            scale: 1.3, 
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },
  
    LightSnow: { 
      core: { effect: 'snow' },
      name: 'swr-light-snow',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snow,
          options: {
            scale: 1.0, 
            direction: {start: 60, end: 120},
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.1, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },

    ModerateSnow: { 
      core: { effect: 'snow' },
      name: 'swr-moderate-snow',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 1.0, 
            direction: {start: 60, end: 120},
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },

    HeavySnow: { 
      core: { effect: 'blizzard' },
      name: 'swr-heavy-snow',
      fxMaster: [
        // two different snow effects
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 1, 
            direction: {start: 60, end: 90},
            speed: 1.9, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 1, 
            direction: {start: 90, end: 120},
            speed: 1.5, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },

    WhiteoutSnow: { 
      core: { effect: 'blizzard' },
      name: 'swr-whiteout-snow',
      // two different snow effects plus fog
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 1, 
            direction: {start: 60, end: 90},
            speed: 1.9, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 1, 
            direction: {start: 90, end: 120},
            speed: 1.5, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.15, 
            alpha: 0.9, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ],
    },

    Hail: { 
      core: { effect: 'rainStorm' },
      name: 'swr-hail',
      fxMaster: [{
        style: FXMStyleTypes.Particle,
        type: FXMParticleTypes.RainSimple,
        options: {
          scale: 4.0, 
          direction: {start: 60, end: 120},
          speed: 0.2, 
          lifetime: 0.2, 
          density: 0.05, 
          alpha: 1.0, 
          tint: { value: '#ffffff', apply: false },
        },
      }],
    },

    Sleet: { 
      core: { effect: 'rainStorm' },
      name: 'swr-sleet',
      // rain plus snow
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Rain,
          options: {
            scale: 1, 
            direction: {start: 60, end: 90 },  // tighter range because we need snow direction to be similar
            speed: 0.5, 
            lifetime: 0.8, 
            density: 1.0, 
            alpha: 0.7, 
            tint: { value: '#ffffff', apply: false },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 1.0, 
            direction: {start: 60, end: 90 },
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#ffffff', apply: false },
          },
        },
      ]
    },

    // like a colored blizzard, with smaller particles
    DustStorm: { 
      core: { effect: '' },
      name: 'swr-dust-storm',
      fxMaster: [
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 0.5, 
            direction: {start: -30, end: 30},
            speed: 1.9, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#8f8c61', apply: true },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Snowstorm,
          options: {
            scale: 0.5, 
            direction: {start: 150, end: 210},
            speed: 1.5, 
            lifetime: 1.0, 
            density: 0.9, 
            alpha: 1.0, 
            tint: { value: '#8f8c61', apply: true },
          },
        },
        {
          style: FXMStyleTypes.Particle,
          type: FXMParticleTypes.Fog,
          options: {
            scale: 1.0, 
            speed: 1.0, 
            lifetime: 1.0, 
            density: 0.15, 
            alpha: 0.9, 
            tint: { value: '#8f8c61', apply: true },
          },
        },
      ],
    },
  }
  
  // combine two effects into one
  // for fx like core where there can only be one option, effect1 is used if present
  export const joinEffects = function(effect1, effect2) {
    const output = foundry.utils.deepClone({
      ...effect1
    });
  
    if (!output.core)
      output.core = { effect: '' };
    if (!output.fxMaster)
      output.fxMaster = [];
    
    output.name = (effect1.name || '') + '-' + (effect2.name || '');
    output.core.effect = output.core?.effect || effect2.core?.effect || '';
    output.fxMaster = output.fxMaster.concat(effect2.fxMaster || []);
  
    return output;
  }