export const themes: {[team: string]: string} = {
  'audi': '#F50537',
  'cadillac': '#909090',
  'mclaren': '#F47600',
  'mercedes': '#00D7B6',
  'red_bull': '#4781D7',
  'ferrari': '#ED1131',
  'aston_martin': '#229971',
  'williams': '#1868DB',
  'rb': '#6C98FF',
  'haas': '#9C9FA2',
  'alpine': '#00A1E8	',
  'sauber': '#01C00E',
  "alfa": '#900000',
  "alphatauri": '#5a6e86',
  "toro_rosso": '#469BFF',
  "racing_point": '#F596C8',
  "renault": '#FFF500',
  "force_india": '#F27836',
  "manor": '#006DC1',
}

export const team_theme = new Proxy(themes, {
  get: (target, prop: string) => {
    return target[prop] || '#fff';
  }
});