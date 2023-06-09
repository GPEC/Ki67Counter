// import { Audio } from 'expo-av';
// import { Platform } from 'react-native';
// import React from 'react';
// export class CounterSounds {
    
//     constructor() {

//         const [posSound, setPosSound] = React.useState();
//         const [negSound, setNegSound] = React.useState();
//         const [doneSound, setDoneSound] = React.useState();

//         async function playPosSound() {
//             try {
//                 const { sound } = await Audio.Sound.createAsync( require('../assets/Click01.wav') );
//                 setPosSound(sound);
//                 sound.setOnPlaybackStatusUpdate((status) => {
//                     if (status.didJustFinish) {
//                       sound.unloadAsync(); // Unload the sound when it finishes playing
//                     }
//                 });
                
//                 console.log('Playing Pos Sound');
//                 await sound.playAsync();
//             } catch(error) {
//                 console.log('Error playing positive sound:', error);
//             }
//         }
        
//         async function playNegSound() {
//             try {
//                 const { sound } = await Audio.Sound.createAsync( require('../assets/beep_09.wav') );
//                 setNegSound(sound);
//                 sound.setOnPlaybackStatusUpdate((status) => {
//                     if (status.didJustFinish) {
//                       sound.unloadAsync(); // Unload the sound when it finishes playing
//                     }
//                 });
                
//                 console.log('Playing Neg Sound');
//                 await sound.playAsync();
//             } catch(error) {
//                 console.log('Error playing negative sound:', error);
//             }
//         }
        
//         async function playDoneSound() {
//             try {
//                 const { sound } = await Audio.Sound.createAsync( require('../assets/DingLing.wav') );
//                 setDoneSound(sound);
//                 sound.setOnPlaybackStatusUpdate((status) => {
//                     if (status.didJustFinish) {
//                       sound.unloadAsync(); // Unload the sound when it finishes playing
//                     }
//                 });
        
//                 console.log('Playing Done Sound');
//                 await sound.playAsync();
//             } catch (error) {
//               console.log('Error playing done sound:', error);
//             }
//         }
        
        
//         this.unloadSounds = () => {
//             console.log("Unloading sounds")
//             if (posSound) {
//                 posSound.unloadAsync();
//             }
//             if (negSound) {
//                 negSound.unloadAsync();
//             }
//             if (doneSound) {
//                 doneSound.unloadAsync();
//             }
            
//         };

//         this.playPosSound = playPosSound;
//         this.playDoneSound = playDoneSound;
//         this.playNegSound = playNegSound;
    
//     }
// }