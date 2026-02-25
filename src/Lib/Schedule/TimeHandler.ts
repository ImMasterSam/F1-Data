export const getTimeString = () => {

  let currentTime = new Date()

  const year = currentTime.getFullYear();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const date = currentTime.getDate().toString().padStart(2, '0');

  const hour = currentTime.getHours().toString().padStart(2, '0');
  const minute = currentTime.getMinutes().toString().padStart(2, '0');
  const second = currentTime.getSeconds().toString().padStart(2, '0');

  const dateStamp = `${year} - ${month} - ${date}`
  let timestamp = `${hour} : ${minute} : ${second}`

  return `${dateStamp} ${timestamp}`

}

export const getDateRange = (day: string) => {

  const monthNamesEn = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ]

  const endTime = new Date(day)
  // F1 賽事通常在週末舉行，第一練習通常在週五，因此將開始時間設為結束時間的前兩天
  const startTime = new Date(endTime)
  startTime.setDate(endTime.getDate() - 2)

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return 'TBA'; // 或其他預設值
  }

  const startMonth = monthNamesEn[startTime.getMonth()]
  const endMonth = monthNamesEn[endTime.getMonth()]
  const startDate = startTime.getDate()
  const endDate = endTime.getDate()

  // 確保 startMonth 存在 (防止 undefined)
  if (!startMonth || !endMonth) return 'Date Error';

  let res_date = `${startMonth} ${startDate} - ${endMonth !== startMonth ? endMonth+' ' : ''}${endDate}`

  return res_date

}