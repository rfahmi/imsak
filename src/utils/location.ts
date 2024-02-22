import Geolocation from '@react-native-community/geolocation';

interface AddressComponent {
  city: string;
  county: string;
}

interface GeocodingResponse {
  items: {
    address: AddressComponent;
  }[];
}

export const getCityFromLocation = (): Promise<AddressComponent> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('GPS Location:', {latitude, longitude});

        const apiKey = 'af7r-5nCSj6d_LkeUMwlAaOCJ5tcGDdXmBA7WbHCSHk';
        fetch(
          `https://geocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`,
        )
          .then(response => response.json())
          .then((data: GeocodingResponse) => {
            if (data.items.length > 0) {
              const address = data.items[0].address;
              const city = address.city ?? '';
              const county = address.county ?? '';

              resolve({city, county});
            } else {
              reject(
                new Error('No address found for the provided coordinates'),
              );
            }
          })
          .catch(error => {
            reject(new Error(`Geocoding failed: ${error.message}`));
          });
      },
      error => {
        reject(new Error(`Geolocation failed: ${error.message}`));
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};
