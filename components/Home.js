import { StyleSheet, Text, View, Dimensions, Image, Button, Linking } from 'react-native';

export default function Home({navigation}) {

    const onButtonClick = () => {
      navigation.openDrawer();
    }

    const handleLinkPress1 = () => {
      Linking.openURL('https://www.nature.com/articles/npjbcancer201614');
    };
  
    const handleLinkPress2 = () => {
      Linking.openURL('https://academic.oup.com/jnci/article/103/22/1656/890097');
    };

    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
              <Image 
              source={require('../assets/mainScreenLogo.png')} 
              style={styles.image}
              resizeMode='contain'
              />
          </View>
          <Text style={styles.mainText}>
            This app will guide you through the <Text style={styles.link} onPress={handleLinkPress1}>standardized ki67 scoring method</Text> proposed by the <Text style={styles.link} onPress={handleLinkPress2}>International Ki67 Working Group</Text>.
          </Text>
          <View style={styles.buttonContainer}>
              <Button title='select score type' onPress={onButtonClick} />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#fff',
    },
    mainText: {
      margin:10,
      marginTop:0, 
      fontSize: 16
    },
    buttonContainer: {
      margin: 10,
      justifyContent:'flex-start'
    },
    imageContainer: {
      margin: 5,
      width: Dimensions.get('window').width - 24, // Set the container width to be the width of the screen minus some padding
      height: 140, // Set a fixed height for the container
    },
    image: {
      width: '100%', // Set the image width to be the full width of its container
      height: '100%',
    },
    link: {
      color: 'blue',
    },
  });