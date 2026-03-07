import type { race_type } from "../Type/RaceTypes";
import type { yearlist_type } from "../Type/Scheduletypes";
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

// export async function fetchData<T>(url: string, dataKey: string): Promise<Array<T>> {
//   const srcURL = url
//   const response = await fetch(srcURL, requestOption);

//   if (!response.ok){
//     throw new Error(`Error! status: ${response.status}`)
//   }

//   const jsonContent = await response.json()
  
//   // 檢查資料是否存在，避免因為年份太早或 API 結構改變而報錯
//   const listRoot = jsonContent.MRData.StandingsTable.StandingsLists[0];
//   const standingList: Array<T> = listRoot ? listRoot[dataKey] : [];
  
//   console.log(standingList)
//   return standingList
// }