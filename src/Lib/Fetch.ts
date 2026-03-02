import type { race_type } from "../Type/RaceTypes";
import type { yearlist_type } from "../Type/Scheduletypes";
import type { constructorStanding_type, driverStanding_type } from "../Type/StandingTypes";
import { setRaceStatus } from "./Schedule/ScheduleHandler";

const requestOption = {
    method: 'GET',
    redirect: "follow" as RequestRedirect
} 

export async function fetchYearList(): Promise<Array<yearlist_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/seasons?limit=100`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  let yearList: Array<any> = jsonContent.MRData.SeasonTable.Seasons
  console.log(yearList)

  return yearList
}

export async function fetchScheduleList(year: number): Promise<Array<race_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/races/`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  let scheduleList: Array<any> = jsonContent.MRData.RaceTable.Races
  console.log(scheduleList)

  scheduleList = setRaceStatus(scheduleList)

  return scheduleList
}

export async function getDriverStanding(year: number): Promise<Array<driverStanding_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/driverstandings`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  const standingList: Array<driverStanding_type> = jsonContent.MRData.StandingsTable.StandingsLists[0].DriverStandings
  console.log(standingList)

  return standingList
}

export async function getConstructorStanding(year: number): Promise<Array<constructorStanding_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  const standingList: Array<any> = jsonContent.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
  console.log(standingList)

  return standingList
}

export async function getDriverStandingByRound(year: number, round: number): Promise<Array<driverStanding_type>> {
  
  const srcURL = `https://api.jolpi.ca/ergast/f1/${year}/${round}/driverstandings`
  const response = await fetch(srcURL, requestOption);

  if (!response.ok){
    throw new Error(`Error! status: ${response.status}`)
  }

  const jsonContent = await response.json()
  const standingList: Array<driverStanding_type> = jsonContent.MRData.StandingsTable.StandingsLists[0].DriverStandings

  return standingList
}