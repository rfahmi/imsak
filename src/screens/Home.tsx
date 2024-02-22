import {useIsFocused} from '@react-navigation/native';
import moment, {MomentInput} from 'moment';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  Colors,
  Constants,
  Dialog,
  PanningProvider,
  Text,
  View,
} from 'react-native-ui-lib';
import Countdown from '../components/Countdown';
import SholatTable from '../components/SholatTable';
import {JadwalSholatResponse} from '../types/global.type';
import {DATA_INIT} from '../utils/consts';
import {getCityFromLocation} from '../utils/location';
import {fillWeatherData, getCuacaBMKG} from '../utils/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = () => {
  const isFocused = useIsFocused();
  const appState = useRef(AppState.currentState);
  const [today, _] = useState(moment().format('YYYY-MM-DD'));
  const [currentCity, setCurrentCity] = useState('-');
  const [currentCityId, setCurrentCityId] = useState(1301);
  const [todayString, setTodayString] = useState('-');
  const [data, setData] = useState(DATA_INIT);
  const [loading, setLoading] = useState(false);
  const [imsak, setImsak] = useState<MomentInput>();
  const [maghrib, setMaghrib] = useState<MomentInput>();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const fetchJadwalSholat = useCallback(async () => {
    const cacheKey = `jadwalSholat-${currentCityId}-${today}`;
    try {
      const response = await fetch(
        `https://api.myquran.com/v2/sholat/jadwal/${currentCityId}/${today}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const res: JadwalSholatResponse = await response.json();
      const jadwal = res.data.jadwal;

      setTodayString(jadwal.tanggal);
      setImsak(moment(jadwal.imsak, 'HH:mm').toISOString());
      setMaghrib(moment(jadwal.maghrib, 'HH:mm').toISOString());
      const newData = data.map(i => ({...i, time: jadwal[i.label]}));
      AsyncStorage.setItem(cacheKey, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error(error);
    }
  }, [currentCityId, data, today]);

  const findCity = useCallback(async (keyword: string) => {
    const cacheKey = `citySearch-${keyword}`;
    try {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await fetch(
        `https://api.myquran.com/v2/sholat/kota/cari/${keyword}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const res: any = await response.json();
      if (res.data.length > 0) {
        const cityData = res.data[0];
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cityData));
        return cityData;
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const {city, county} = await getCityFromLocation();
      if (city && county) {
        console.log('CURRENT CITY', city, county);

        setCurrentCity(city);
        const citySplit = city.split(' ');
        const cityData = await findCity(citySplit[0].toLocaleLowerCase());
        setCurrentCityId(cityData.id);
        let weather;
        try {
          weather = await getCuacaBMKG(city, county);
        } catch {
          try {
            weather = await getCuacaBMKG(citySplit[0], county);
          } catch (error) {
            console.error(error);
          }
        }
        const newData = fillWeatherData(data, weather);
        setData(newData);
      }
    } catch (error) {
      console.error(error);
    }
  }, [data, findCity]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([getCurrentLocation(), fetchJadwalSholat()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      refresh().finally(() => setLoading(false));
    }
  }, [isFocused, refresh]);

  useEffect(() => {
    const initializeData = async () => {
      const cacheKey = `jadwalSholat-${currentCityId}-${today}`;
      try {
        const storedData = await AsyncStorage.getItem(cacheKey);
        if (storedData) {
          const parsedJson = JSON.parse(storedData);
          console.log('Initial data loaded from cache:', parsedJson);

          setData(parsedJson);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    initializeData();
  }, [currentCityId, today]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setLoading(true);
        refresh().finally(() => setLoading(false));
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refresh]);

  return (
    <View>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View useSafeArea>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }>
          <View center width={'100%'} height={300}>
            <View flex center>
              <View margin-16 center>
                <View row center gap-8>
                  <Icon
                    name="navigation-variant"
                    size={18}
                    color={Colors.grey20}
                  />
                  <Text text60BO black>
                    {currentCity}
                  </Text>
                </View>
                <Text text80L black>
                  {todayString}
                </Text>
              </View>
              <View flex row>
                <View flex center>
                  <View row center gap-8>
                    <Icon
                      name="weather-sunset-up"
                      size={18}
                      color={Colors.grey20}
                    />
                    <Text text70L black>
                      Imsak
                    </Text>
                  </View>
                  <Text text30L black>
                    {moment(imsak).format('HH:mm')}
                  </Text>
                </View>
                <View flex center>
                  <View row center gap-8>
                    <Icon
                      name="weather-sunset-down"
                      size={18}
                      color={Colors.grey20}
                    />
                    <Text text70L black>
                      Buka Puasa
                    </Text>
                  </View>
                  <Text text30L black>
                    {moment(maghrib).format('HH:mm')}
                  </Text>
                </View>
              </View>
            </View>
            <View flex row>
              <Countdown
                targetTime={
                  moment().isBefore(moment(maghrib))
                    ? maghrib
                    : moment(imsak).add(1, 'd').toISOString()
                }
                message={
                  moment().isBefore(moment(maghrib))
                    ? 'Menuju Buka Puasa 💪'
                    : 'Menuju Imsak ☀️'
                }
              />
            </View>
          </View>

          <SholatTable data={data} />

          <View style={styles.footer}>
            <Text
              style={styles.creditText}
              //   onPress={() => Linking.openURL('http://rfahmi.com')}
              onPress={() => setShowAboutModal(true)}>
              Developed with ❤️ by rfahmi.com
            </Text>
          </View>
        </ScrollView>
      </View>
      <Dialog
        visible={showAboutModal}
        onDismiss={() => setShowAboutModal(false)}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={styles.modalContainer}
        height={300}>
        <View marginB-16>
          <Text text60>About</Text>
          <Text text80L>
            Versi aplikasi {require('../../package.json').version}
          </Text>
          <Text text80L>Credit: Nur Fahmi (rfahmi.com)</Text>
        </View>
        <View>
          <Text text60>API</Text>
          <Text text80>Jadwal Sholat:</Text>
          <Text text80L>API Muslim v2 - myQuran.com</Text>
          <Text text80>Data Cuaca:</Text>
          <Text text80L>
            BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
          </Text>
        </View>
      </Dialog>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    padding: 16,
  },
  contentImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  footer: {
    padding: 10,
    height: 48,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditText: {
    color: '#fff',
    fontSize: 12,
  },
  modalContainer: {
    backgroundColor: Colors.$backgroundDefault,
    marginBottom: Constants.isIphoneX ? 0 : 20,
    borderRadius: 12,
    padding: 16,
  },
});
