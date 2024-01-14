import { View, TextInput, Text, Pressable, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const SearchBar = ({ setter, load }: { setter: Function, load: Function }) => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const api = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=`
    const [place, setPlace] = useState('');
    const [results, setResults] = useState([]);
    const handlePress = () => {
        Keyboard.dismiss()
        load(true);
        setter(place);
        setPlace('');
    }
    const handleOptionPress = (result: any) => {
        Keyboard.dismiss()
        load(true);
        setter(result.name + ', ' + result.country);
        setPlace('');
    }
    const fetchResults = async () => {
        const result = await fetch(api + place);
        const json = await result.json();
        setResults(json);
    }

    useEffect(() => {
        fetchResults();
    }, [place])

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput placeholder='City...' value={place} onKeyPress={(e) => {
                    if (e.nativeEvent.key === 'Enter') {
                        handlePress();
                    }
                }} style={styles.input} onChange={e => { setPlace(e.nativeEvent.text) }} />
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <FontAwesome name='search' size={16}></FontAwesome>
                </TouchableOpacity>
            </View>
            { place !== '' && 
                <View style={styles.resultBox} >
                    {
                        results.length > 0 ?
                            <>
                                {results.map((result: any, index: number) => (
                                    <Pressable key={index} style={styles.option} onPress={() => handleOptionPress(result)}>
                                        <Text>{result.name}, {result.country}</Text>
                                    </Pressable>
                                ))}
                            </>
                            : <Text>No results</Text>
                    }
                </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        rowGap: 5,
        paddingHorizontal: 20,
        zIndex: 1000
    },
    resultBox: {
        position: 'relative',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    option: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 20,
    },
    input: {
        height: 40,
        width: '75%',
        paddingHorizontal: 20,
        borderRadius: 20,
        fontSize: 20,
        fontWeight: '500'
    },
    button: {
        height: 40,
        width: '25%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500'
    }
});