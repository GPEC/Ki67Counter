import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native'

import { Audio } from 'expo-av';

export default function Hotspot() {

    const [countNegative, setCountNegative] = useState(0);
    const [countPositive, setCountPositive] = useState(0);
    
    const [posSound, setPosSound] = React.useState();
    const [negSound, setNegSound] = React.useState();
    const [doneSound, setDoneSound] = React.useState();

    const threshold = 10;
    const totalCounted = countPositive + countNegative;

    const score = Math.round((countPositive/totalCounted)*1000)/10;

    const onClickNegative = () => {
        playNegSound();
        setCountNegative(countNegative+1);
    }

    const onClickPositive = () => {
        playPosSound();
        setCountPositive(countPositive+1);
    }

    const resetCounts = () => {
        setCountNegative(0);
        setCountPositive(0);
    }

    // async function loadSounds() {
    //     try {
    //       console.log('Loading Sound');
    //       const { sound } = await Audio.Sound.createAsync(require('../assets/Click01.wav'));
    //       setPosSound(sound);
    //       const { sound:nSound } = await Audio.Sound.createAsync(require('../assets/beep_09.wav'));
    //       setNegSound(nSound);
    //     //   const { sound:dSound } = await Audio.Sound.createAsync(require('../assets/DingLing.wav'));
    //     //   setDoneSound(dSound);
    //     } catch (error) {
    //       console.log('Error loading sound:', error);
    //     }
    //   }

    async function playPosSound() {
        try {
            console.log('Loading Pos Sound');
            const { sound } = await Audio.Sound.createAsync( require('../assets/Click01.wav') );
            setPosSound(sound);
            
            console.log('Playing Pos Sound');
            await sound.playAsync();
           
        } catch(error) {
            console.log('Error playing positive sound:', error);
        }
    }

    async function playNegSound() {
        try {
            console.log('Loading Neg Sound');
            const { sound } = await Audio.Sound.createAsync( require('../assets/beep_09.wav') );
            setNegSound(sound);
            
            console.log('Playing Neg Sound');
            await sound.playAsync();
            
        } catch(error) {
            console.log('Error playing negative sound:', error);
        }
    }

    async function playDoneSound() {
        try {
            console.log('Loading Done Sound');
            const { sound } = await Audio.Sound.createAsync( require('../assets/DingLing.wav') );
            setDoneSound(sound);

            console.log('Playing Done Sound');
            await sound.playAsync();
          
            //await doneSound.unloadAsync(); // Unload the sound after playing
        } catch (error) {
          console.log('Error playing done sound:', error);
        }
    }

    // async function playDoneSound() {
    //     try {
    //         if (doneSound) {
    //             console.log('Playing Done Sound');
    //             await doneSound.playAsync();
    //         } else {
    //             console.log('Sound not loaded. Call loadSounds() first.');
    //         }
    //     } catch(error) {
    //         console.log('Error playing done sound:', error);
    //     }
    // }

    const showAlert = () => {
        playDoneSound();  
        Alert.alert(  
            `Hot-spot score: ${score}%`,  
            `Negative nuclei counted: ${countNegative} \n` +
            `Positive nuclei counted: ${countPositive} \n` +
            `Total nuclei counted: ${totalCounted}`,  
            [{
                text: 'OK'
            }]  
        );  
    }  

    useEffect(() => {
        if (countNegative+countPositive >= threshold) {
            showAlert(); 
        }
    }, [countNegative, countPositive]);

    // Call the loadSounds function when the component mounts
    useEffect(() => {
        // loadSounds();
        // console.log("sounds are loaded successfully")
        return () => {
          // Clean up resources when the component unmounts
          console.log("Unloading sounds")
          if (posSound) {
            posSound.unloadAsync();
          }
          if (negSound) {
            negSound.unloadAsync();
          }
          if (doneSound) {
            doneSound.unloadAsync();
          }
        };
      }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Please select 1 high-powered field with the highest Ki67 positivity and count up to 500 nuclei.</Text>
            
            <View style={styles.counterContainer}>
                <View style={styles.rowStyle}>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{countNegative}</Text>
                        <Button title='Negative1' onPress={onClickNegative} />
                    </View>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{countPositive}</Text>
                        <Button title='Positive1' onPress={onClickPositive} />
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