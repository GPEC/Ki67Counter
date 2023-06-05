import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

//import { Audio } from 'expo-av';
import { CounterSounds } from '../../app/counterSounds';

export default function Hotspot({navigation}) {

    const threshold = 5;

    let counterSoundsObj = new CounterSounds(threshold);

    const showResult = () => {
        navigation.navigate('HotspotResults', {
            positive: counterSoundsObj.getCountPositive(), 
            negative: counterSoundsObj.getCountNegative(), 
            finalScore: counterSoundsObj.score, 
            resetScores: counterSoundsObj.resetCounts
        });
    }

    const showAlert = () => {
        counterSoundsObj.doneSound();
        Alert.alert(
            `Hot-spot score: ${counterSoundsObj.score}%`,  
            `Negative nuclei counted: ${counterSoundsObj.getCountNegative()} \n` +
            `Positive nuclei counted: ${counterSoundsObj.getCountPositive()} \n` +
            `Total nuclei counted: ${counterSoundsObj.totalCounted()}`,
            [{
                text: 'OK'
            }]
        );
    } 

    useEffect(() => {
        if (counterSoundsObj.getCountNegative() + counterSoundsObj.getCountPositive() >= threshold) {
            showAlert();
        }
    }, [counterSoundsObj.countPositive, counterSoundsObj.countNegative]);

    // Clean up resources when the component unmounts
    useEffect(() => {
        return () => {
            return counterSoundsObj.unloadSounds();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Please select 1 high-powered field with the highest Ki67 positivity and count up to 500 nuclei.</Text>
            
            <View style={styles.counterContainer}>
                <View style={styles.rowStyle}>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{counterSoundsObj.getCountNegative()}</Text>
                        <Button title='Negative' onPress={counterSoundsObj.onClickNegative} />
                    </View>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{counterSoundsObj.getCountPositive()}</Text>
                        <Button title='Positive' onPress={counterSoundsObj.onClickPositive} />
                    </View>
                </View>
            </View>

            <View style={styles.resetButtonContainer}>
                <Button style={styles.resetButton} color='red' title='Reset' onPress={counterSoundsObj.resetCounts} />
            </View>

            <View style={styles.showResultButtonContainer}>
                <Button style={styles.showResultButton} color='purple' title='Show Results' onPress={showResult} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainText: {
        margin:10,
        marginTop:25, 
        fontSize: 16,
        marginLeft: 15
    },
    rowStyle: {
        flexDirection: 'row',
    },
    colStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 45,
    },
    counterContainer: {
        alignItems: 'center',
        marginTop:20,
    },
    counterText: {
        fontSize: 30,
        marginBottom: 10,
    },
    resetButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 120,
    },
    showResultButtonContainer: {
        position: 'absolute',
        bottom:0,
        left:0,
        right:0,
    },
})