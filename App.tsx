import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { SearchBar } from './components/search-bar';
import { useState, useEffect } from 'react';
import { Image } from 'expo-image';

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
  }
}


const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&aqi=no&q=`
export default function App() {
  const [city, setCity] = useState('Bogota');
  const [weather, setWeather] = useState<Weather>();
  const fetchWeather = async() =>{
    const result = await fetch(url+city)
    const data = await result.json()
    setWeather(data)
    console.log(JSON.stringify(data,null,2))
  }
  useEffect(() => {
    fetchWeather()
  },[city])

  if(!weather) return(
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )

  const {current, location} = weather

  return (
    <KeyboardAvoidingView
    behavior='height'
    keyboardVerticalOffset={0}
    enabled={false}
    >
      <View style={styles.container}>
        <SearchBar setter={setCity}/>
        <Image source={'https:'+current?.condition.icon} style={styles.weatherIcon}/>
        <Text style={styles.weatherTemp}>{current?.temp_c} °C</Text>
        <Text style={styles.weatherLocation}>{location?.name}, {location?.country}</Text>
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
    backgroundColor: 'rgba(255,100,2,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherTemp: {
    fontSize: 50,
    fontWeight: '500',
    color: 'white',
  },
  weatherDesc: {
    fontSize: 25,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize'
  },
  weatherLocation: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
});
