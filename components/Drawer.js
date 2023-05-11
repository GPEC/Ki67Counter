import { createDrawerNavigator } from '@react-navigation/drawer';
import { createAppContainer } from '@react-navigation/native';

import Home from './Home';
import Hotspot from './Hotspot';

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: Home
  },
  Hotspot: {
    screen: Hotspot
  }
});

export default createAppContainer(DrawerNavigator);
