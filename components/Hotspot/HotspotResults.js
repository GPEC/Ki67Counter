import { Text, View, Button, StyleSheet } from 'react-native';

export default function HotspotResults({navigation, route}) {

    const { positive, negative, finalScore, resetScores } = route.params;

    const goBack = () => {
        resetScores();
        navigation.goBack();
    }

    return (
        <View style={styles.resultContainer}>
            <Text style={styles.textContainer}>Hot-spot score: {finalScore}</Text>
            <View style={styles.horizontalLine}/>
            <Text style={styles.textContainer}># positive nuclei: {positive}</Text>
            <View style={styles.horizontalLine}/>
            <Text style={styles.textContainer}># negative nuclei: {negative}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Score another slide' onPress={goBack}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    resultContainer: {
        margin: 20,
    },
    buttonContainer: {
        marginTop: 15
    },
    textContainer: {
        margin: 10,
        fontSize: 18,
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginLeft: 10,
        marginRight: 10,
    }
})
