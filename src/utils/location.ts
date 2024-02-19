import Geolocation from '@react-native-community/geolocation';

interface AddressComponent {
  city?: string;
}

interface GeocodingResponse {
  items: {
    address: AddressComponent;
  }[];
}

export const getCityFromLocation = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude, longitude} = position.coords;
          console.log('GPS Location:', {latitude, longitude});

          const apiKey = 'af7r-5nCSj6d_LkeUMwlAaOCJ5tcGDdXmBA7WbHCSHk';
          const response = await fetch(
            `https://geocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`,
          );
          const data: GeocodingResponse = await response.json();
          console.log('HERE API Response:', data.items);

          if (data.items.length > 0) {
            const address = data.items[0].address;
            const city = address.city ?? ''; // Assuming city is represented as state in HERE API response
            resolve(city);
          } else {
            reject('No address found for the provided coordinates');
          }
        } catch (error) {
          reject(error);
        }
      },
      error => {
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};
