import { Text, View, StyleSheet, Platform } from 'react-native';
import React, { useEffect } from 'react';
import {Button} from 'react-native-elements';
import AsyncStore from '../../data/AsyncStore';

export default function HotspotResults({navigation, route}) {

    const { positive, negative, finalScore, id, comments } = route.params;

    // Function that converts NaN value to string to resolve console error
    const getScore = () => {
        if(!finalScore)
            return finalScore.toString();
        return finalScore;
    }

    const getCurrentTimestamp = () => new Date().getTime();

    // Stores the data collected when we land on the results page 
    useEffect(()=> {
        
        if (Platform.OS !== 'web') {
            const timestamp = getCurrentTimestamp();

            AsyncStore.saveData(timestamp, {
                countPositive: positive,
                countNegative: negative,
                score: finalScore,
                id: id,
                comments: comments,
                method: 'Hot-spot'
            });
        }

    }, [])

    return (
        <View style={styles.resultContainer}>
            <View style={styles.rowContainer}>
                <Text style={styles.textContainer}>Hot-spot score:</Text>
                <Text style={styles.scoreText}>{getScore()}</Text>
            </View>
            <View style={styles.horizontalLine}/>
            
            <View style={styles.rowContainer}>
                <Text style={styles.textContainer}># positive nuclei:</Text>
                <Text style={styles.scoreText}>{positive}</Text>
            </View>
            <View style={styles.horizontalLine}/>
            
            <View style={styles.rowContainer}>
                <Text style={styles.textContainer}># negative nuclei:</Text>
                <Text style={styles.scoreText}>{negative}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button 
                    title='Score another slide' 
                    onPress={()=> navigation.reset({
                        index: 0,
                        routes: [{ name: 'Hot-spot' }],
                    })}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    resultContainer: {
        margin: 20
    },
    buttonContainer: {
        marginTop: 15
    },
    textContainer: {
        margin: 10,
        fontSize: 18
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginLeft: 10,
        marginRight: 10,
    },
    rowContainer: {
        flexDirection: 'row'
    },
    scoreText: {
        right: 20,
        position: 'absolute',
        margin: 10,
        fontSize: 18,
        fontWeight: '300'
    }
})