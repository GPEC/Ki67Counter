import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native'


export default function Hotspot() {

    //const [title, setTitle] = useState('Hot-spot');

    const [countNegative, setCountNegative] = useState(0);
    const [countPositive, setCountPositive] = useState(0);

    const threshold = 5;
    const totalCounted = countPositive + countNegative;

    const score = Math.round((countPositive/totalCounted)*1000)/10;

    const updateCountNegative = () => setCountNegative(countNegative+1);

    const updateCountPositive = () => setCountPositive(countPositive+1);

    const resetCounts = () => {
        setCountNegative(0);
        setCountPositive(0);
    }

    const showAlert = () => {  
        Alert.alert(  
            `Hot-spot score: ${score}%`,  
            `Negative nuclei counted: ${countNegative} \n` +
            `Positive nuclei counted: ${countPositive} \n` +
            `Total nuclei counted: ${totalCounted}`,  
            [{
                text: 'OK', onPress: () => console.log('OK Pressed')
            }]  
        );  
    }  

    useEffect(() => {
        if (countNegative+countPositive >= threshold) {
            
            showAlert();
            console.log('The count exceeded 500.');
        }
    }, [countNegative, countPositive]);

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Please select 1 high-powered field with the highest Ki67 positivity and count up to 500 nuclei.</Text>
            
            <View style={styles.counterContainer}>
                <View style={styles.rowStyle}>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{countNegative}</Text>
                        <Button title='Negative' onPress={updateCountNegative} />
                    </View>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{countPositive}</Text>
                        <Button title='Positive' onPress={updateCountPositive} />
                    </View>
                </View>
            </View>

            <View style={styles.resetButtonContainer}>
                <Button style={styles.resetButton} color='red' title='Reset' onPress={resetCounts} />
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
    }
})