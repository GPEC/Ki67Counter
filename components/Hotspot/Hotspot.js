import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';
import { Audio } from 'expo-av';

export default function Hotspot({navigation}) {

    const threshold = 500;

    const [countNegative, setCountNegative] = useState(0);
    const [countPositive, setCountPositive] = useState(0);
    const [isAlertShown, setIsAlertShown] = useState(false);

    const [posSound, setPosSound] = useState();
    const [negSound, setNegSound] = useState();
    const [doneSound, setDoneSound] = useState();
    const [specimenId, setSpecimenId] = useState("");
    const [comments, setComments] = useState("");

    const [isWeb, setIsWeb] = useState(false);

    const totalCounted = countNegative + countPositive;
    const score = Math.round((countPositive/totalCounted)*1000)/10;

    const onClickNegative = () => {
        playNegSound();
        setCountNegative((prevValue) => prevValue+1);
    }

    const onClickPositive = () => {
        playPosSound(); 
        setCountPositive((prevValue) => prevValue+1);
    }

    const resetCounts = () => {
        setCountNegative(0);
        setCountPositive(0);
    }

    // Navigation to the next page
    const showResult = () => {
        navigation.navigate('HotspotResults', {
            positive: countPositive, 
            negative: countNegative, 
            finalScore: score,
            id: specimenId,
            comments: comments
        });
    }

    // Function to handle change in ID
    const onChangeId = (val) => {
        setSpecimenId(val);
    }

    // Function to handle change in comments
    const onChangeComments = (val) => {
        setComments(val);
    }
 
    // Function to play positive sound or show error
    // the sound needs to be unloaded everytime or it runs out of memory
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

    // function to play negative sound or show error
    // the sound needs to be unloaded everytime or it runs out of memory
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

    // function to play done sound or show error
    // the sound needs to be unloaded everytime or it runs out of memory
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

    // listener for countPositive and countNegative that displays alert when the sum reaches the threshold
    useFocusEffect(
        React.useCallback(() => {
          if (totalCounted >= threshold) {
            playDoneSound();
            setIsAlertShown(true);
          }
        }, [countNegative, countPositive])
    );

    // Listener with empty arguments, listens with every change
    // For web, it reads the Keyboard input A or D for negative and positive, repectively
    useFocusEffect(
        React.useCallback(() => {

        let handleKeyDown;
        if (Platform.OS === 'web') {
            setIsWeb(true);
            handleKeyDown = (event) => {
                if (event.code === 'KeyA') {
                    onClickNegative();
                } else if (event.code === 'KeyD') {
                    onClickPositive();
                }
            };
            document.addEventListener('keydown', handleKeyDown);
        }

        // Clean up resources when the component unmounts
        return () => {
            if (posSound) {
                posSound.unloadAsync();
            }
            if (negSound) {
                negSound.unloadAsync();
            }
            if (doneSound) {
                doneSound.unloadAsync();
            }
            if (isWeb) {
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, []));

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Please select 1 high-powered field with the highest Ki67 positivity and count up to 500 nuclei.</Text>
            
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
            
            {isWeb ? null : 
                <View style={styles.counterContainer}>
                    <Text style={[styles.mainText]}>Add Specimen ID: </Text>
                
                    <TextInput
                        onChangeText={onChangeId}
                        value={specimenId}
                        style={styles.idField}
                        maxLength={40}/>

                    <Text style={[styles.mainText, { marginTop: 20 }]}>Add comments: </Text>
                    
                    <TextInput
                        onChangeText={onChangeComments}
                        value={comments}
                        style={styles.commentsField}
                        editable
                        multiline
                        numberOfLines={4}/>
                
                </View>
            }
            
            <View style={styles.resetButtonContainer}>
                <Button style={styles.resetButton} color='red' title='Reset' onPress={resetCounts} />
            </View>

            <View style={styles.showResultButtonContainer}>
                <Button style={styles.showResultButton} color='purple' title='Show Results' onPress={showResult} />
            </View>

            <Overlay isVisible={isAlertShown}>
                <Text style={styles.alertTitle}>Hot-spot score: {score}%</Text>
                <Text style={styles.alertText}>Negative nuclei counted: {countNegative}</Text>
                <Text style={styles.alertText}>Positive nuclei counted: {countPositive}</Text>
                <Text style={styles.alertText}>Total nuclei counted: {totalCounted}</Text>
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
    resetButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    showResultButtonContainer: {
        position: 'absolute',
        bottom:0,
        left:0,
        right:0,
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
    },
    idField: {
        borderWidth: 2,
        width: 250,
        paddingLeft:4,
        paddingRight:4
    },
    commentsField: {
        borderWidth: 2,
        width: 250,
        paddingLeft:4,
        paddingRight:4
    }
})