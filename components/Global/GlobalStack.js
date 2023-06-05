import { createStackNavigator } from '@react-navigation/stack';
//import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Estimate from './Estimate'
import Fields from './FieldStack'
import Report from './Report'

const Stack = createStackNavigator();

export default function GlobalStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="Estimate" 
        component={Estimate} />
      <Stack.Screen name="Fields" component={Fields} />
      <Stack.Screen 
        name="Report"
        component={Report} />
    </Stack.Navigator>
  );
}