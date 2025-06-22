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

export const getDateRange = (start: string, end: string) => {

  const monthNamesEn = [
    'JUN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ]

  const startTime = new Date(start)
  const endTime = new Date(end)

  const startMonth = monthNamesEn[startTime.getMonth()]
  const endMonth = monthNamesEn[endTime.getMonth()]
  const startDate = startTime.getDate()
  const endDate = endTime.getDate()

  let res_date = `${startMonth} ${startDate} - ${endMonth !== startMonth ? endMonth+' ' : ''}${endDate}`

  return res_date

}