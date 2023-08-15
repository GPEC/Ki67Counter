import Hotspot from './Hotspot';
import HotspotResults from './HotspotResults'

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Hot-spot" component={Hotspot} />
      <Stack.Screen name="HotspotResults" component={HotspotResults} />
    </Stack.Navigator>
  );
}