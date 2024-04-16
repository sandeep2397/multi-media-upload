import moment from 'moment';
export const convertToBrowserTimeZone = (utcDateTime: string) => {
  // Parse the timestamp using Moment.js
  const utcMoment = moment.utc(utcDateTime);

  // Convert to local time
  const localMoment = utcMoment.local();

  // Format the result
  const formattedLocalTime = localMoment.format('MMM DD YYYY HH:mm:ss');
  return formattedLocalTime;
};
