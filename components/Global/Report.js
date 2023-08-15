import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { Ki67ScoresByType } from '../../app/Ki67Score';
import React, { useEffect } from 'react';
import AsyncStore from '../../data/AsyncStore';
import  {Button} from "react-native-elements";

export default function Report({navigation, route}) {

    let {ki67Score, id} = route.params;

    let fieldsByTye = new Ki67ScoresByType(ki67Score);

    let allFieldTypes = fieldsByTye.getAllReportFields();

    // Stores the data collected when we land on the results page
    useEffect(() => {

        if (Platform.OS !== 'web') {
            const timestamp = new Date().getTime();

            AsyncStore.saveData(timestamp, {
                ki67Score: ki67Score,
                id: id,
                comments: ki67Score.getComments(),
                method: 'Global'
            });
        }
        
    }, [])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.rowContainer}>
                <Text style={styles.mainText}>Unweighted global score:</Text>
                <Text style={styles.scoreText}>{ki67Score.getGlobalScore()}%</Text>
            </View>
            <View style={styles.horizontalLine}/>

            <View style={styles.rowContainer}>
                <Text style={styles.mainText}>Weighted global score:</Text>
                <Text style={styles.scoreText}>{ki67Score.getWeightedGlobalScore()}%</Text>
            </View>
            <View style={styles.horizontalLine}/>

            <Text style={styles.mainText}>Nuclei count on fields:</Text>

            {allFieldTypes.map((fieldType) => {
                const background = fieldType.color;
                return(
                    <View key={fieldType.typeName}>
                        <View style={{backgroundColor:background}}><Text style={styles.heading}>{fieldType.typeName} ({fieldType.percentage}%)</Text></View>
                        {fieldType.fields.map((field, index) => {
                            return (
                                <View key={index}>
                                <View style={styles.rowContainer}>
                                    <Text style={styles.mainText}>{field.negCount}-/{field.posCount}+</Text>
                                    <Text style={styles.scoreText}>{field.getScore()}%</Text>
                                </View>
                                { index+1<fieldType.fields.length ? <View style={styles.horizontalLine}/> : null }
                                </View>
                            )
                        })}
                    </View>
                )
            })}
                
            <View style={styles.buttonContainer}>
                <Button
                    title='Score another slide'
                    buttonStyle={{backgroundColor: 'black'}}
                    onPress={()=> navigation.reset({
                        index: 0,
                        routes: [{ name: 'Estimate' }],
                    })}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15
    },
    mainText: {
        fontSize: 16,
        fontWeight: '400',
        margin: 10
    },
    rowContainer: {
        flexDirection: 'row'
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginLeft: 10,
        marginRight: 10
    },
    scoreText: {
        fontSize: 16,
        right: 10,
        position: 'absolute',
        fontWeight: '300',
        marginBottom: 10,
        marginTop: 10
    },
    heading: {
        fontSize: 18,
        padding: 5,
        color: 'white'
    },
    buttonContainer: {
        marginTop: 10
    }
});