import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { SearchBar } from './components/search-bar';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { weatherImages } from './constants';
import { Forecast } from './components/forecast';

type Weather = {
  location: {
    name: string,
    region: string,
    country: string,
    lat: number,
    lon: number,
    tz_id: string,
    localtime_epoch: number,
    localtime: string
  },
  current: {
    last_updated_epoch: number,
    last_updated: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: {
      text: string,
      icon: string,
      code: number
    },
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
    vis_km: number,
    vis_miles: number,
    uv: number,
    gust_mph: number,
    gust_kph: number
  },
  error?: {
    code: number,
    message: string
  }
}


const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&aqi=no&q=`
export default function App() {
  const [city, setCity] = useState('Bogota');
  const [weather, setWeather] = useState<Weather>();
  const [loading, setLoading] = useState(false);
  const fetchWeather = async() =>{
    const result = await fetch(url+city)
    const data = await result.json()
    setWeather(data)
    setLoading(false)
  }
  useEffect(() => {
    fetchWeather()
  },[city])

  if(!weather) return(
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )

  const {current, location, error} = weather

  return (
    <KeyboardAvoidingView
    behavior='height'
    keyboardVerticalOffset={0}
    enabled={false}
    >
      <View style={styles.container}>
        <Image source={require('./assets/images/background.png')} blurRadius={100} style={styles.backStyles}/>
        <SearchBar setter={setCity} load={setLoading}/>
        
        {
          error !== undefined ? (
            <View style={styles.mainContainer}>
              <Image source={weatherImages['error']} style={styles.weatherIconError}/>
              <Text style={styles.weatherErr}>Error:</Text>
              {
                error.code === 1006 ? (
                  <Text style={styles.weatherErr}>City not found.</Text>
                ):(
                  <Text style={styles.weatherErr}>No search parameters.</Text>
                )
              }
              <Text style={styles.weatherErr}>Try with other city.</Text>
            </View>
          ):(
            <>
            {
              loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ):(
                <>
                  <View style={styles.mainContainer}>
                    <Image source={weatherImages[current?.condition?.text]} style={styles.weatherIcon}/>
                    <Text style={styles.weatherTemp}>{current?.temp_c} °C</Text>
                    <Text style={styles.weatherDesc}>{current?.condition?.text}</Text>
                    <Text style={styles.weatherLocation}>{location?.name}, {location?.country}</Text>
                  </View>
                </>
              )
            }
            </>
          )
        }
        <Forecast city={city} load={loading}/>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
  },
  backStyles:{
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherIconError: {
    width: 150,
    height: 150,
  },
  weatherTemp: {
    fontSize: 50,
    fontWeight: '500',
    color: 'white',
  },
  weatherErr:{
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    paddingVertical: 5,
  },
  weatherDesc: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize'
  },
  weatherLocation: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    paddingVertical: 10,
  },
});
