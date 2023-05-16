import { StyleSheet, Text, View } from 'react-native';

export default function Header() {

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.textItem}>Home</Text>
        </View>
    )    
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 100,
        backgroundColor: 'gray',
        marginTop: 50,
        
    },
    textItem: {
        textAlign:'center',
        color: 'black',
        fontSize: 30,
    },
})