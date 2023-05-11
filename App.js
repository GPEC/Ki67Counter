import 'react-native-gesture-handler';
//import Navigator from './components/Drawer';  // Commented out as Drawer.js is not working
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Home from './components/Home';
import Hotspot from './components/Hotspot';
import Global from './components/Global';

const DrawerNav = createDrawerNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <DrawerNav.Navigator initialRouteName="Home">
        <DrawerNav.Screen name="Home" component={Home} />
        <DrawerNav.Screen name="Hot-spot" component={Hotspot} />
        <DrawerNav.Screen name="Global" component={Global} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
}


