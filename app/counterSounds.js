import { Audio } from 'expo-av';
import React, { useState } from 'react';

export class CounterSounds {
    
    constructor(threshold) {

        [this.countNegative, this.setCountNegative] = useState(0);
        [this.countPositive, this.setCountPositive] = useState(0);
        
        const [posSound, setPosSound] = React.useState();
        const [negSound, setNegSound] = React.useState();
        const [doneSound, setDoneSound] = React.useState();

        async function playPosSound() {
            try {
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
                const { sound } = await Audio.Sound.createAsync( require('../assets/DingLing.wav') );
                setDoneSound(sound);
        
                console.log('Playing Done Sound');
                await sound.playAsync();
            } catch (error) {
              console.log('Error playing done sound:', error);
            }
        }        

        this.resetCounts = () => {
            this.setCountNegative(0);
            this.setCountPositive(0);
        }

        this.onClickNegative = () => {
            playNegSound();
            this.setCountNegative(this.countNegative+1);
        }
    
        this.onClickPositive = () => {
            playPosSound();
            this.setCountPositive(this.countPositive+1);
        }
        
        this.totalCounted = () => this.countPositive + this.countNegative;

        this.score = Math.round((this.countPositive/this.totalCounted())*1000)/10;

        this.doneSound = playDoneSound;

        this.isDisplayAlert = () => {
            if (this.countNegative+this.countPositive >= threshold) {
                return true; 
            }
            return false;
        };

        this.unloadSounds = () => {
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
    
    }

    getCountNegative() {
        return this.countNegative;
    }

    getCountPositive() {
        return this.countPositive;
    }

    getOnClickNegative() {
        return this.onClickNegative;
    }

    getOnClickPositive() {
        return this.onClickPositive;
    }

    getDoneSound() {
        return this.doneSound;
    }

    getTotalCounted() {
        return this.totalCounted;
    }

    getIsDisplayAlert() {
        return this.isDisplayAlert();
    }

    getUnloadSounds() {
        return this.unloadSounds;
    }

    getScore() {
        return this.score;
    }
}