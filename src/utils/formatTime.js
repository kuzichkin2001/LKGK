function checkTime(time) {
  if (time < 10) {
    time = '0' + time;
  }
  return time;
}

export function showTime(date) {
  const hours = checkTime(date.getHours());
  const minutes = checkTime(date.getMinutes());
  return `${hours}:${minutes}`;
}
