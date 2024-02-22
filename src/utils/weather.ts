import {searchKeyword} from './string';

export const getCuacaBMKG = async (cityName: string, provinceName: string) => {
  const url = `https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${provinceName.replace(
    ' ',
    '',
  )}.xml`;

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  let jsonData;
  try {
    const xmlData = await response.text();
    jsonData = await parser.parseStringPromise(xmlData);
  } catch (error) {
    throw new Error(`Failed to parse XML data: ${error}`);
  }

  if (!jsonData?.data?.forecast?.length) {
    throw new Error('No forecast data available');
  }

  const areaData = jsonData.data.forecast[0].area.find(i =>
    searchKeyword(cityName, i.name[0]._),
  );

  // console.log('area', jsonData.data.forecast[0].area);
  // jsonData.data.forecast[0].area.map(i => console.log(i.name[0]._));

  if (!areaData) {
    throw new Error(`No area data found for ${cityName}`);
  }

  const weatherData = areaData.parameter.find(i => i.$.id === 'weather');
  if (!weatherData || !weatherData.timerange) {
    throw new Error(`No weather data found for ${cityName}`);
  }

  const result = weatherData.timerange.map(i => {
    return {
      hour: i.$.h,
      weather: getWeatherDescription(Number(i.value[0]._)),
    };
  });

  return result;
};

export const getWeatherDescription = (code: number) => {
  switch (code) {
    case 0:
      return {icon: 'weather-sunny', desc: 'Cerah'};
    case 1:
      return {icon: 'weather-partly-cloudy', desc: 'Cerah Berawan'};
    case 2:
      return {icon: 'weather-partly-cloudy', desc: 'Cerah Berawan'};
    case 3:
      return {icon: 'weather-cloudy', desc: 'Berawan'};
    case 4:
      return {icon: 'weather-cloudy-alert', desc: 'Berawan Tebal'};
    case 5:
      return {icon: 'weather-sunny', desc: 'Udara Kabur'};
    case 10:
      return {icon: 'weather-fog', desc: 'Asap'};
    case 45:
      return {icon: 'weather-fog', desc: 'Kabut'};
    case 60:
      return {icon: 'weather-hail', desc: 'Hujan Ringan'};
    case 61:
      return {icon: 'weather-rainy', desc: 'Hujan Sedang'};
    case 63:
      return {icon: 'weather-pouring', desc: 'Hujan Lebat'};
    case 80:
      return {icon: 'weather-pouring', desc: 'Hujan Lokal'};
    case 95:
    case 97:
      return {icon: 'weather-lightning-rainy', desc: 'Hujan Petir'};
    default:
      return {icon: 'cloud-question', desc: 'Unknown'};
  }
};

export const fillWeatherData = (prayerSchedule, weatherForecast) => {
  return prayerSchedule.map(item => {
    const prayerTime = Number(item.time.split(':')[0]); // Extract hour from prayer time
    const forecast = weatherForecast.find(forecastItem => {
      const forecastHour = Number(forecastItem.hour);
      return forecastHour <= prayerTime && forecastHour + 6 > prayerTime; // Check if prayer time falls within forecast hour range
    });
    return {
      ...item,
      weather: forecast ? forecast.weather : null, // Assign weather from forecast data or null if no matching forecast found
    };
  });
};
