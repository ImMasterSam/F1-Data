import type { DriversPointsEvolution, DriversRankEvolution, driverStanding_type } from "../Type/StandingTypes";
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
            await new Promise(r => setTimeout(r, 10)); 
            
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

export function getRankEvolution(pointsData: DriversPointsEvolution[]): DriversRankEvolution[] {
    
    // Data Processing
    const rankData: DriversRankEvolution[] = pointsData.map((roundData) => {
        const { name, round, ...driverPoints } = roundData;
        
        // 將該站所有車手的積分取出來排序
        const sortedDivers = Object.entries(driverPoints)
            .sort(([, pointsA], [, pointsB]) => (pointsB as number) - (pointsA as number))
            .map(([driverCode]) => driverCode);
            
        // 建立新的物件，將積分替換為排名
        const newRoundData: any = { name, round };
        
        // 填入排名 (index + 1)
        Object.keys(driverPoints).forEach(driver => {
            const rank = sortedDivers.indexOf(driver) + 1;
            newRoundData[driver] = rank;
        });
        
        return newRoundData;
    });

    return rankData;
}
