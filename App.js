import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Home from './components/Home';
import HotspotStack from './components/Hotspot/HotspotStack';
import Global from './components/Global';

const DrawerNav = createDrawerNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Hot-spot';
  switch (routeName) {
    case 'Hot-spot':
      return 'Hot-spot';
    case 'HotspotResults':
      return 'Hot-spot Results';
  }
}

export default function App() {

  return (
    <NavigationContainer>
      <DrawerNav.Navigator initialRouteName="Home">
        <DrawerNav.Screen name="Home" component={Home} />
        <DrawerNav.Screen name="Hotspot" component={HotspotStack} 
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}/>
        <DrawerNav.Screen name="Global" component={Global} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
}