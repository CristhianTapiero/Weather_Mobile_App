import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { weatherImages } from "../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=5&aqi=no&alerts=no&q=`
type ForecastT = {
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
    forecast: {
        forecastday: [{
            date: string,
            date_epoch: number,
            day: {
                maxtemp_c: number,
                maxtemp_f: number,
                mintemp_c: number,
                mintemp_f: number,
                avgtemp_c: number,
                avgtemp_f: number,
                maxwind_mph: number,
                maxwind_kph: number,
                totalprecip_mm: number,
                totalprecip_in: number,
                avgvis_km: number,
                avgvis_miles: number,
                avghumidity: number,
                daily_will_it_rain: number,
                daily_chance_of_rain: string,
                daily_will_it_snow: number,
                daily_chance_of_snow: string,
                condition: {
                    text: string,
                    icon: string,
                    code: number
                },
                uv: number
            },
            astro: {
                sunrise: string,
                sunset: string,
                moonrise: string,
                moonset: string,
                moon_phase: string,
                moon_illumination: string
            },
            hour: {
                time_epoch: number,
                time: string,
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
                windchill_c: number,
                windchill_f: number,
                heatindex_c: number,
                heatindex_f: number,
                dewpoint_c: number,
                dewpoint_f: number,
                will_it_rain: number,
                chance_of_rain: string,
                will_it_snow: number,
                chance_of_snow: string,
                vis_km: number,
                vis_miles: number,
                gust_mph: number,
                gust_kph: number,
                uv: number
            }
        }]
    },
    error?: {
        code: number,
        message: string
    }
}

export const Forecast = ({ city, load }: { city: string, load: boolean }) => {
    const [f, setForecast] = useState<ForecastT>();
    const fetchWeather = async () => {
        const result = await fetch(url + city);
        const json = await result.json();
        setForecast(json);
    }
    useEffect(() => {
        fetchWeather();
    }, [city])

    if (!f || load) return (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={'#0000ff'}/>
    </View>)

    const { current, forecast, error } = f;

    return (
        <View style={styles.container}>
            {
                error ?
                    <View style={styles.errorContainer}>
                        <Image source={weatherImages['error']} style={styles.errorImage}/>
                        <Text style={styles.errorText}>No forecast</Text>
                    </View>
                    :
                    <>
                        <View style={styles.forecastTitle}>
                            <FontAwesome name="calendar" size={16} color={'white'}/>
                            <Text style={styles.forecastFont}>Forecast</Text>
                        </View>
                        <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={{alignItems: 'center', paddingHorizontal: 10}}
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}

                        >
                            {current && forecast?.forecastday.map((day: any, index: number) => {
                                let date = new Date(day.date);
                                let option = { weekday: 'long' as const };
                                let dayName = date.toLocaleDateString('en-US', option);
                                dayName = dayName.split(',')[0];

                                return(
                                    <View key={index} style={styles.forecastDay}>
                                        <Image source={weatherImages[day.day.condition.text]} style={{ width: 50, height: 50 }} />
                                        <Text style={styles.cardFont}>{dayName}</Text>
                                        <Text style={styles.cardFont}>{day.day.maxtemp_c}°C</Text>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </>
            }
        </View>
    )

}

const styles = StyleSheet.create({
    loadingContainer: {
        width: '100%',
        height: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
    },
    errorContainer:{
        width: '80%',
        alignSelf: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 20,
    },
    errorImage : {
        width: 150,
        height: 150,
    },
    errorText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        marginTop: -40,
    },
    container: {
        width: '100%',
        height: '20%',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 20,
    },
    scrollContainer : {
        width: '100%',
        height: '90%',
    },
    forecastDay: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        paddingVertical: 10,
        paddingHorizontal: 7,
        borderRadius: 10,
        width: 90,
        marginHorizontal: 10,
    },
    forecastTitle:{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
        paddingHorizontal: 17,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    forecastFont:{
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
    },
    cardFont:{
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
        marginVertical: 2,
    }
});