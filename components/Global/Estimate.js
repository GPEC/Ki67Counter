import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react';
import { ScoringFieldsAllocator } from '../../app/scoringFieldsAllocator';
import { Ki67Score } from '../../app/Ki67Score';

export default function Global({ navigation }) {

    const [sliderNegValue, setNegSliderValue] = useState(0);
    const [sliderMedValue, setMedSliderValue] = useState(0);
    const [sliderLowValue, setLowSliderValue] = useState(0);
    const [sliderHighValue, setHighSliderValue] = useState(0);

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    
    const [negUpperLimit, setNegUpperLimit] = useState(100);
    const [lowUpperLimit, setLowUpperLimit] = useState(100);
    const [medUpperLimit, setMedUpperLimit] = useState(100);
    const [highUpperLimit, setHighUpperLimit] = useState(100);

    let sfa = new ScoringFieldsAllocator();

    const sum = sliderNegValue + sliderMedValue + sliderLowValue + sliderHighValue;

    // function to navigate to the next screen
    const goToFields = () => {

        let ki67Score = new Ki67Score(sliderNegValue, sliderLowValue, sliderMedValue, sliderHighValue);

        for (let i=0; i<sfa.getNumNegligible(); i++) {
            ki67Score.addField(0,0,Ki67Score.FIELD_TYPE_NEG);
        }
        for (let i=0; i<sfa.getNumLow(); i++) {
            ki67Score.addField(0,0,Ki67Score.FIELD_TYPE_LOW);
        }
        for (let i=0; i<sfa.getNumMedium(); i++) {
            ki67Score.addField(0,0,Ki67Score.FIELD_TYPE_MED);
        }
        for (let i=0; i<sfa.getNumHigh(); i++) {
            ki67Score.addField(0,0,Ki67Score.FIELD_TYPE_HIGH);
        }
        
        navigation.navigate('Fields', {
            sfa,
            ki67Score
        });
    }
    
    /***************    SLIDER CHANGE HANDLERS START   ************************************/
    const handleNegSliderChange = (value) => {
        value = Math.round(value);
        
        if(value+sliderMedValue+sliderLowValue+sliderHighValue>100) {
            const acceptableValue = 100-(sliderMedValue+sliderLowValue+sliderHighValue);
            setNegUpperLimit(acceptableValue);
            setNegSliderValue(acceptableValue);
        } else {
            setNegUpperLimit(100);
            setNegSliderValue(value);
        }
    };
    const handleLowSliderChange = (value) => {
        value = Math.round(value);
        
        if(value+sliderMedValue+sliderNegValue+sliderHighValue>100) {
            const acceptableValue = 100-(sliderMedValue+sliderNegValue+sliderHighValue);
            setLowSliderValue(acceptableValue);
            setLowUpperLimit(acceptableValue);
        } else {
            setLowSliderValue(value);
            setLowUpperLimit(100);
        }
    };
    const handleMedSliderChange = (value) => {
        value = Math.round(value);
        
        if(value+sliderNegValue+sliderLowValue+sliderHighValue>100) {
            const acceptableValue =  100-(sliderNegValue+sliderLowValue+sliderHighValue)
            setMedSliderValue(acceptableValue);
            setMedUpperLimit(acceptableValue);
        } else {
            setMedSliderValue(value);
            setMedUpperLimit(100)
        }
    };
    const handleHighSliderChange = (value) => {
        value = Math.round(value);
        
        if(value+sliderMedValue+sliderLowValue+sliderNegValue>100) {
            const acceptableValue = 100-(sliderMedValue+sliderLowValue+sliderNegValue);
            setHighSliderValue(acceptableValue);
            setHighUpperLimit(acceptableValue);
        } else {
            setHighSliderValue(value);
            setHighUpperLimit(100);
        }
    };
    /*********************    SLIDER CHANGE HANDLERS END   ****************************/
    
    
    // listener to enable the next button when the sum is 100
    useEffect(() => {
        setIsButtonDisabled(sum  != 100);
    }, [sliderNegValue, sliderMedValue, sliderLowValue, sliderHighValue])

    // function to set the text on the screen
    const generateText = () => {
        const defaultText = "Please estimate percentage of invasive tumor area with various levels of Ki67: negligible, low, medium and high.";

        if(!isButtonDisabled) {
            sfa.init(sliderNegValue, sliderLowValue, sliderMedValue, sliderHighValue);
            let numNeg = sfa.getNumNegligible();
            let numLow = sfa.getNumLow();
            let numMed = sfa.getNumMedium();
            let numHigh = sfa.getNumHigh();
            
            let updatedString = "Required fields to score: ";
            if (numNeg>0) {
                updatedString = updatedString+numNeg+" negligible; ";
            }
            if (numLow>0) {
                updatedString = updatedString+numLow+" low; ";
            }
            if (numMed>0) {
                updatedString = updatedString+numMed+" medium; ";
            }
            if (numHigh>0) {
                updatedString = updatedString+numHigh+" high; ";
            }
            updatedString = updatedString+"Please press the NEXT button to continue";
            return updatedString;
        }
        
        return defaultText;
    }

    return (
        <View style={styles.container}>

            <Text style={styles.mainText}>{generateText()}</Text>
            
            <View style={styles.sliderRow}>
                <Text style={styles.leftText}>Neg:</Text> 
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={sliderNegValue}
                    onValueChange={handleNegSliderChange}
                    upperLimit={negUpperLimit}
                />
                <Text style={styles.textRight}>{sliderNegValue}%</Text>
            </View>
            <View style={styles.horizontalLine}/>
            
            <View style={styles.sliderRow}>
                <Text style={styles.leftText}>Low:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={sliderLowValue}
                    upperLimit={lowUpperLimit}
                    onValueChange={handleLowSliderChange}
                />
                <Text style={styles.textRight}>{sliderLowValue}%</Text>
            </View>
            <View style={styles.horizontalLine}/>

            <View style={styles.sliderRow}>
                <Text style={styles.leftText}>Med:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={sliderMedValue}
                    upperLimit={medUpperLimit}
                    onValueChange={handleMedSliderChange}
                />
                <Text style={styles.textRight}>{sliderMedValue}%</Text>
            </View>
            <View style={styles.horizontalLine}/>
            
            <View style={styles.sliderRow}>
                <Text style={styles.leftText}>High:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={sliderHighValue}
                    upperLimit={highUpperLimit}
                    onValueChange={handleHighSliderChange} 
                />
                <Text style={styles.textRight}>{sliderHighValue}%</Text>
            </View>
            <View style={styles.next}>
                <Button style={styles.nextButton} color='black' title='Next' onPress={goToFields} disabled={isButtonDisabled}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Makes the container take up the entire screen height
    },
    mainText: {
        margin:20,
        marginTop:25, 
        fontSize: 16
    },
    next: {
        position: 'absolute',
        right:0,
        bottom:0,
        left: 0,
    },
    sliderRow: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20
    },
    slider: {
        width: '60%',
        color: 'black'
    },
    horizontalLine: {
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
        margin: 30,
    },
    leftText: {
        marginLeft: 25,
        marginRight: 20,
        fontWeight: 'bold'
    },
    textRight:{
        marginLeft: 20,
        marginRight: 25
    }
})