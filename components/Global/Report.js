import { View, Text, Button, StyleSheet } from 'react-native';
import { Ki67Score } from '../../app/Ki67Score';

export default function Report({navigation, route}) {

    let {ki67Score} = route.params;

    let fieldNeg = {
        typeName: Ki67Score.FIELD_TYPE_NEG,
        color: ki67Score.getColor(Ki67Score.FIELD_TYPE_NEG),
        percentage: ki67Score.pNeg,
        fields: ki67Score.getFieldsNeg()
    };
    let fieldLow = {
        typeName: Ki67Score.FIELD_TYPE_LOW,
        color: ki67Score.getColor(Ki67Score.FIELD_TYPE_LOW),
        percentage: ki67Score.pLow,
        fields: ki67Score.getFieldsLow()
    };
    let fieldMed = {
        typeName: Ki67Score.FIELD_TYPE_MED,
        color: ki67Score.getColor(Ki67Score.FIELD_TYPE_MED),
        percentage: ki67Score.pMed,
        fields: ki67Score.getFieldsMed()
    };
    let fieldHigh = {
        typeName: Ki67Score.FIELD_TYPE_HIGH,
        color: ki67Score.getColor(Ki67Score.FIELD_TYPE_HIGH),
        percentage: ki67Score.pHigh,
        fields: ki67Score.getFieldsHigh()
    };

    let allFieldTypes = [fieldNeg, fieldLow, fieldMed, fieldHigh];

    return (
        <View style={styles.container}>
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
                    color='black'
                    onPress={()=> navigation.reset({
                        index: 0,
                        routes: [{ name: 'Estimate' }],
                    })}
                />
            </View>
        </View>
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