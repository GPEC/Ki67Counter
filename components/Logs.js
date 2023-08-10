import React, { useEffect, useState } from 'react';
import AsyncStore from '../data/AsyncStore';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Ki67ScoresByType, Ki67Score } from '../app/Ki67Score';
import { Button } from "react-native-elements";

export default function Logs() {

    const [data, setData] = useState([]);
    const [hotspotDataList, setHotspotDataList] = useState([]);
    const [globalDataList, setGlobalDataList] = useState([]);
    const [updatedGlobalList, setUpdatedGlobalList] = useState([]);
    const [isWeb, setIsWeb] = useState(false);

    useEffect(() => {

        if (Platform.OS === 'web') {
            setIsWeb(true);
        } else {
            const fetchData = async () => {
                try {
                    const fetchedData = await AsyncStore.fetchAllData();
                    setData(fetchedData);
                } catch (error) {
                    console.log('Error while fetching data:', error);
                }
            };
        
            fetchData();
        }

    }, []);
    
    useEffect(() => {

        const newHotspotDataList = [];
        const newGlobalDataList = [];
        
        data.map((stored) => {
            if(stored.value.method==='Hot-spot') {
                newHotspotDataList.push(stored);
            }
            else {
                newGlobalDataList.push(stored);
            }
        })

        setHotspotDataList(newHotspotDataList);
        setGlobalDataList(newGlobalDataList);

    }, [data]);

    useEffect(() => {

        const newGlobalDataList = [];
        globalDataList.map((entry) => {
            const key = entry.key;
            const value = entry.value.ki67Score;
            const id = entry.value.id;
            const comments = entry.value.comments;
            
            const ki67ScoreObj = new Ki67Score(value.pNeg, value.pLow, value.pMed, value.pHigh);
            value.ki67ScoreFields.forEach(field => {
                ki67ScoreObj.addField(field["negCount"], field["posCount"], field["fieldType"]);
            });
            
            newGlobalDataList.push({key, ki67ScoreObj, id, comments});
        })
        setUpdatedGlobalList(newGlobalDataList);

    }, [globalDataList])

    const showTimestamp = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDateTime = date.toLocaleString('en-US', options);
        return formattedDateTime;
    }

    const showAlert = () => {
        Alert.alert(
            'Are you sure?', 
            'There is no way to retrieve deleted data. Press Continue to proceed.', [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Continue', onPress: () => deleteAllData()}
            ]
        )
    }

    const deleteAllData = async () => {
        try {
            await AsyncStore.deleteAllData();
            setHotspotDataList([]);
            setUpdatedGlobalList([]);
        } catch (error) {
            console.log('Error while removing data:', error);
        }
    }

    return(
        
        <ScrollView style={styles.container}>
            { !isWeb ? <View>
            <Text style={styles.subTitle}>Hot-spot</Text>

            {hotspotDataList.length>0 ?
                hotspotDataList.map((entry, index) => {
                    const timestamp = showTimestamp(entry.key);
                    const value = entry.value;
                    return(
                        <View key={index}>
                            <Text style={styles.timestamp}>{timestamp}</Text>
                            {value.id? <Text style={styles.mainText}>Specimen ID: {value.id}</Text>: null}
                            <View style={styles.rowContainer}>
                                <Text style={styles.mainText}>{value.countNegative}-/{value.countPositive}+</Text>
                                <Text style={styles.scoreText}>{value.score}%</Text>
                            </View>
                            {value.comments ? <Text style={styles.mainText}>Comments: {value.comments}</Text> : null}
                            {index+1<hotspotDataList.length ?<View style={styles.horizontalLine}/> : null}
                        </View>
                    )
                }) : 
                <Text style={styles.mainText}>No data available yet.</Text>
            }

            <Text style={styles.subTitle}>Global</Text>
            {updatedGlobalList.length>0 ?
                updatedGlobalList.map((entry, index) => {
                    const timestamp = showTimestamp(entry.key);
                    const ki67Obj = entry.ki67ScoreObj;
                    const scoresByType = new Ki67ScoresByType(ki67Obj);
                    let allFieldTypes = scoresByType.getAllReportFields();
                    return(
                        <View style= {styles.globalField} key={index}>
                            <Text style={styles.timestamp}>{timestamp}</Text>
                            {entry.id ? <Text style={styles.mainText}>Specimen ID: {entry.id}</Text>: null}
                            <View style={styles.rowContainer}>
                                <Text style={styles.mainText}>Global Score:</Text>
                                <Text style={styles.scoreText}>{ki67Obj.getGlobalScore()}%</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.mainText}>Weighted Global Score:</Text>
                                <Text style={styles.scoreText}>{ki67Obj.getWeightedGlobalScore()}%</Text>
                            </View>
                            {allFieldTypes.map((fieldType) => {
                                const background = fieldType.color;
                                return(
                                    <View key={fieldType.typeName}>
                                        <View><Text style={[styles.typeHeading, {backgroundColor:background}]}>{fieldType.typeName} ({fieldType.percentage}%)</Text></View>
                                        {fieldType.fields.map((field, index) => {
                                            return (
                                                <View key={index}>
                                                <View style={styles.rowContainer}>
                                                    <Text style={styles.globalMainText}>{field.negCount}-/{field.posCount}+</Text>
                                                    <Text style={styles.globalScoreText}>{field.getScore()}%</Text>
                                                </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                )
                            })}
                            {entry.comments ? <Text style={styles.mainText}>Comments: {entry.comments}</Text> : null}
                            { index+1<updatedGlobalList.length ? <View style={[styles.horizontalLine, {marginTop: 15}]}/> : null }
                        </View>
                    )
                }) :
                <Text style={styles.mainText}>No data available yet.</Text>
            }
            
            <View style={styles.buttonContainer}>
                <Button 
                    title='Delete all data'
                    buttonStyle={{backgroundColor: 'black'}}
                    onPress={showAlert}/>
            </View>
            </View> : 
            <Text style={styles.mainText}>This feature is not supported in web. Please use our Android or iOS App to save and look up previous results.</Text> 
            }
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row'
    },
    subTitle: {
        fontSize: 25,
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: 'purple',
        color: 'white',
        textAlign: 'center'
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 10
    },
    container: {
        marginLeft: 15,
        marginRight: 15
    },
    scoreText: {
        fontSize: 16,
        right: 15,
        position: 'absolute',
        fontWeight: '300',
        marginBottom: 10,
        marginTop: 10
    },
    timestamp: {
        fontWeight: 'bold',
        fontSize: 16
    },
    mainText: {
        fontSize: 16,
        fontWeight: '400',
        marginTop: 10,
        marginLeft: 10
    },
    typeHeading: {
        marginRight: 10,
        marginLeft: 10,
        color: 'white'
    },
    globalField: {
        marginBottom: 10
    },
    globalMainText: {
        marginLeft: 15,
        fontWeight: '300',
    },
    globalScoreText: {
        right: 20,
        position: 'absolute',
        fontWeight: '300',
    },
    buttonContainer: {
        marginTop: 15,
        marginBottom: 10
    }
})