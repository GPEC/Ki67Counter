import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Audio } from 'expo-av';

export default function Field ( {navigation, fieldType, nextScreen, ki67Score, index} ) {

    // function to display text for the next page button
    const nextButtonText = () => {
        if (nextScreen==='Report')
            return 'Show Score';
        return 'Next Field';
    }

    const [isInitialRender, setIsInitialRender] = useState(true);
    const [isAlertShown, setIsAlertShown] = useState(false);

    const [countNegative, setCountNegative] = useState(ki67Score.getFieldByIndex(index).negCount);
    const [countPositive, setCountPositive] = useState(ki67Score.getFieldByIndex(index).posCount);
    
    const [posSound, setPosSound] = React.useState();
    const [negSound, setNegSound] = React.useState();
    const [doneSound, setDoneSound] = React.useState();

    const threshold = 100;

    const onClickNegative = () => {
        if(isInitialRender)
            setIsInitialRender(false);
        playNegSound();
        setCountNegative((prev)=> prev+1);
    }

    const onClickPositive = () => {
        if(isInitialRender)
            setIsInitialRender(false);
        playPosSound(); 
        setCountPositive((prev)=> prev+1);
    }

    const resetCounts = () => {
        setCountNegative(0);
        setCountPositive(0);
    }

    // function to handle navigation to the next screen
    const goToNextScreen = () => {

        // Saving the values whenever we go to the next screen
        ki67Score.setNegCount(index, countNegative);
        ki67Score.setPosCount(index, countPositive);

        setIsInitialRender(true);

        if (nextScreen==='Report')
            navigation.navigate(nextScreen, {ki67Score});
        else
            navigation.navigate(nextScreen);
    }

    async function playPosSound() {
        try {
            const { sound } = await Audio.Sound.createAsync( require('../../assets/Click01.wav') );
            setPosSound(sound);
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                  sound.unloadAsync(); // Unload the sound when it finishes playing
                }
            });
            
            console.log('Playing Pos Sound');
            await sound.playAsync();
        } catch(error) {
            console.log('Error playing positive sound:', error);
        }
    }

    async function playNegSound() {
        try {
            const { sound } = await Audio.Sound.createAsync( require('../../assets/beep_09.wav') );
            setNegSound(sound);
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                  sound.unloadAsync(); // Unload the sound when it finishes playing
                }
            });
            
            console.log('Playing Neg Sound');
            await sound.playAsync();
        } catch(error) {
            console.log('Error playing negative sound:', error);
        }
    }

    async function playDoneSound() {
        try {
            const { sound } = await Audio.Sound.createAsync( require('../../assets/DingLing.wav') );
            setDoneSound(sound);
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                  sound.unloadAsync(); // Unload the sound when it finishes playing
                }
            });

            console.log('Playing Done Sound');
            await sound.playAsync();
        } catch (error) {
          console.log('Error playing done sound:', error);
        }
    } 

    // listener to show the alert when positive and negative values exceed threshold
    useFocusEffect(
        React.useCallback(() => {
            if (!isInitialRender && (countNegative + countPositive >= threshold)) {
                playDoneSound();  
                setIsAlertShown(true); 
            }
        }, [countNegative, countPositive, isInitialRender])
    );

    // Listener triggered with every change, used to monitor keyboard input
    useEffect(() => {
        
        let handleKeyPress;
        if (Platform.OS === 'web') {
            handleKeyPress = (event) => {
                if (event.code === 'KeyA') {
                    onClickNegative();
                } else if (event.code === 'KeyD') {
                    onClickPositive();
                }
            };
        
            document.addEventListener('keydown', handleKeyPress);
        }

        // Clean up resources when the component unmounts
        return () => {
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
            if (Platform.OS === 'web') {
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
      }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.mainText}>
                Please select 1 high-powered field with the Ki67 <Text style={{fontWeight: 'bold'}}>{fieldType}</Text> positivity and count up to 100 nuclei.
            </Text>

            <View style={styles.counterContainer}>
                <View style={styles.rowStyle}>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{countNegative}</Text>
                        <Button title='Negative' onPress={onClickNegative} />
                    </View>
                    <View style={styles.colStyle}>
                        <Text style={styles.counterText}>{countPositive}</Text>
                        <Button title='Positive' onPress={onClickPositive} />
                    </View>
                </View>
            </View>

            <View style={styles.resetButtonContainer}>
                <Button style={styles.resetButton} color='red' title='Reset' onPress={resetCounts} />
            </View>

            <View style={styles.showResultButtonContainer}>
                <Button color='purple' title={nextButtonText()} onPress={goToNextScreen} />
            </View>

            <Overlay isVisible={isAlertShown}>
                <Text style={styles.alertTitle}>Enough nuclei counted</Text>
                <Text style={styles.alertText}>Please press button below to continue.</Text>
                <View style={styles.alertButton}>
                    <Button title="OK" onPress={() => setIsAlertShown(false)} />
                </View>
            </Overlay>

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
    showResultButtonContainer: {
        position: 'absolute', 
        bottom:0,
        left:0,
        right:0,
    },
    resetButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 120,
    },
    alertText: {
        marginLeft: 15,
        marginRight: 15
    },
    alertTitle: {
        fontWeight:'bold', 
        fontSize:15,
        margin: 15
    },
    alertButton: {
        margin: 15
    }
})