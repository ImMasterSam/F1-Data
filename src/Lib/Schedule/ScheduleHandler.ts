import type { race_type } from "../../Type/RaceTypes";

export const setRaceStatus = (scheduleList: race_type[]) => {

  const currentTime = new Date()
  let nextRace = true;

  return scheduleList.map((race) => {

    const raceTime = new Date(race.date + ' ' + race.time)

    if (raceTime < currentTime)
      race = {...race, status: 'finish'}
    else {
      if (nextRace){
        race = {...race, status: 'next'}
        nextRace = false
      }
      else
        race = {...race, status: 'yetStart'}
    }
    
    return race
  })
}