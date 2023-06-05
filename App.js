import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Home from './components/Home';
import HotspotStack from './components/Hotspot/HotspotStack';
import Global from './components/Global/GlobalStack';

const DrawerNav = createDrawerNavigator();

// function to return screen titles in hot-spot flow 
function getHotspotHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Hot-spot';
  switch (routeName) {
    case 'Hot-spot':
      return 'Hot-spot';
    case 'HotspotResults':
      return 'Hot-spot Results';
  }
}

// function to set drawer headerShown as False for fields screens
function getGlobalHeaderShown(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Estimate';
  if(routeName==='Fields')
    return false;
  return true;
}

// function to set screen titles for drawer headers in Global feature
function getGlobalHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Estimatte';
  switch (routeName) {
    case 'Estimate':
      return 'Global - estimate';
    case 'Report':
      return 'Global - score report';
  }
}

export default function App() {

  return (
    <NavigationContainer>
      <DrawerNav.Navigator initialRouteName="Home">
        <DrawerNav.Screen name="Home" component={Home} />
        <DrawerNav.Screen name="Hotspot" component={HotspotStack} 
          options={({ route }) => ({
            headerTitle: getHotspotHeaderTitle(route),
          })}/>
        <DrawerNav.Screen name="Global" component={Global} 
        options={({ route }) => ({
          headerTitle: getGlobalHeaderTitle(route),
          headerShown: getGlobalHeaderShown(route)
        })}/>
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
}