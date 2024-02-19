export const getCuacaBMKG = async (provinceName: string) => {
  const url = `https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-Indonesia.xml?provinsi=${provinceName}`;

  const response = await fetch(url);

  // Check for successful response
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  // Parse XML using a dedicated library (e.g., xml2js)
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser();
  const xmlData = await response.text();

  // Convert parsed XML to JSON
  const jsonData = await parser.parseStringPromise(xmlData);

  console.log('JSON Data:', jsonData);

  // Extract relevant data from the parsed JSON
  const prakiraanCuaca = jsonData.data.forecast[0].area
    .find(i => i.$.description === provinceName)
    .parameter.find(i => i.$.id === 'weather').timerange;

  const result = prakiraanCuaca.map(i => {
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
      return 'Cerah';
    case 1:
      return 'Cerah Berawan';
    case 2:
      return 'Cerah Berawan';
    case 3:
      return 'Berawan';
    case 4:
      return 'Berawan Tebal';
    case 5:
      return 'Udara Kabur';
    case 10:
      return 'Asap';
    case 45:
      return 'Kabut';
    case 60:
      return 'Hujan Ringan';
    case 61:
      return 'Hujan Sedang';
    case 63:
      return 'Hujan Lebat';
    case 80:
      return 'Hujan Lokal';
    case 95:
    case 97:
      return 'Hujan Petir';
    default:
      return 'Unknown';
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
