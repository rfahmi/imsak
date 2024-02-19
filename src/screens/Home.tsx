import moment, {MomentInput} from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
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

const Home = () => {
  const [today, _] = useState(moment().format('YYYY-MM-DD'));
  const [currentCity, setCurrentCity] = useState('-');
  const [currentCityId, setCurrentCityId] = useState(1301);

  const [todayString, setTodayString] = useState('-');
  const [data, setData] = useState(DATA_INIT);
  const [loading, setLoading] = useState(false);
  const [imsak, setimsak] = useState<MomentInput>();
  const [maghrib, setMaghrib] = useState<MomentInput>();
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  const fetchJadwalSholat = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.myquran.com/v2/sholat/jadwal/${currentCityId}/${today}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const res: JadwalSholatResponse = await response.json();
      const jadwal = res.data.jadwal;
      setTodayString(jadwal.tanggal);
      setimsak(moment(res.data.jadwal.imsak, 'HH:mm').toISOString());
      setMaghrib(moment(res.data.jadwal.maghrib, 'HH:mm').toISOString());

      setData(
        data.map(i => {
          const updatedItem = {...i};
          Object.keys(jadwal).forEach(key => {
            if (i.label === key) {
              updatedItem.time = jadwal[key];
            }
          });
          return updatedItem;
        }),
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const findCity = async (keyword: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.myquran.com/v2/sholat/kota/cari/${keyword}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const res: any = await response.json();
      if (res.data.length > 0) {
        return res.data[0];
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    const city = await getCityFromLocation();
    if (city) {
      setCurrentCity(city);
      const citySplit = city.split(' ');
      findCity(citySplit[0].toLocaleLowerCase()).then(e => {
        setCurrentCityId(e.id);
      });
      const weather = await getCuacaBMKG('Medan');
      console.log('weather', weather);
      const newData = fillWeatherData(data, weather);
      console.log('newData', newData);
      setData(newData);
    }
  };

  const refresh = async () => {
    getCurrentLocation();
    fetchJadwalSholat();
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    fetchJadwalSholat();
  }, [today, currentCityId]);

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
            <RefreshControl refreshing={false} onRefresh={refresh} />
          }>
          <View center width={'100%'} height={300}>
            <View flex center>
              <View margin-16 center>
                <Text text60BO black>
                  {currentCity}
                </Text>
                <Text text80L black>
                  {todayString}
                </Text>
              </View>
              <View flex row>
                <View flex center>
                  <Text text70L black>
                    Imsak
                  </Text>
                  <Text text30L black>
                    {moment(imsak).format('HH:mm')}
                  </Text>
                </View>
                <View flex center>
                  <Text text70L black>
                    Buka Puasa
                  </Text>
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
        containerStyle={{
          backgroundColor: Colors.$backgroundDefault,
          marginBottom: Constants.isIphoneX ? 0 : 20,
          borderRadius: 12,
          padding: 16,
        }}
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
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditText: {
    color: '#fff',
    fontSize: 12,
  },
});
