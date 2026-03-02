import type { DriversPointsEvolution, driverStanding_type } from "../Type/StandingTypes";
import { fetchScheduleList, getDriverStandingByRound } from "./Fetch";

export async function getPointsEvolution(year: number): Promise<DriversPointsEvolution[]> {
    try {

        // Fetch schedule to know how many rounds there are in the season
        const schedule = await fetchScheduleList(year);
        const totalRounds = schedule.length;
        
        // Points evolution data structure
        const evolutionData: DriversPointsEvolution[] = [];
        const results = [];
        
        // To avoid sending too many requests at once, we can fetch standings round by round with a small delay
        for (let round = 1; round <= totalRounds; round++) {
            await new Promise(r => setTimeout(r, 100)); 
            
            try {
                const standings = await getDriverStandingByRound(year, round);
                results.push({ round, standings });
            } catch (err) {
                console.warn(`Failed to fetch rnd ${round}`, err);
            }
        }

        // Data Processing
        results.sort((a, b) => a.round - b.round);

        results.forEach(({ round, standings }) => {
            const roundData: DriversPointsEvolution = {
                round: `${round}`, // X Axis label
            };

            standings.forEach((driver: driverStanding_type) => {
                // Using driver code as key and points as value for the line chart
                roundData[driver.Driver.code] = parseFloat(driver.points as unknown as string); 
            });

            evolutionData.push(roundData);
        });

        return evolutionData;

    } catch (error) {
        console.error("Error fetching points evolution:", error);
        return [];
    }
}
