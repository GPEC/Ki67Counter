import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Field from './Fields';
import { Ki67Score } from '../../app/Ki67Score';

const Stack = createStackNavigator();

export default function FieldsStack({route}) {

    let {sfa, ki67Score} = route.params;

    let numNeg = sfa.getNumNegligible();
    let numLow = sfa.getNumLow();
    let numMed = sfa.getNumMedium();
    let numHigh = sfa.getNumHigh();
    const totalScreens = ki67Score.showNumFields();

    console.log('numNeg:', numNeg);
    console.log('numLow:', numLow);
    console.log('numMed:', numMed);
    console.log('numHigh:', numHigh);
    console.log('totalScreens:', totalScreens);

    const screenNames = [...Array(totalScreens)].map((_, index) => `Field ${index + 1}`);

    const getFieldName = () => {
        if (numNeg>0) {
            numNeg--;
            return Ki67Score.FIELD_TYPE_NEG;
        }
        if (numLow>0) {
            numLow--;
            return Ki67Score.FIELD_TYPE_LOW;
        }
        if (numMed>0) {
            numMed--;
            return Ki67Score.FIELD_TYPE_MED;
        }
        numHigh--;
        return Ki67Score.FIELD_TYPE_HIGH;
    }

    const getColor = (type) => ki67Score.getColor(type);

    return (
        <Stack.Navigator>
            {screenNames.map((screenName, index) => {
                const nextScreen = index === totalScreens - 1 ? 'Report' : screenNames[index + 1]; // Determine the next screen name

                const fieldType = getFieldName();
                console.log("type? ", fieldType);
                
                const color = getColor(fieldType);
                console.log("rang? ", color);

                const FieldComponent = ({ navigation }) => (
                    <Field
                        navigation={navigation}
                        fieldType={fieldType}
                        nextScreen={nextScreen}
                        ki67Score={ki67Score}
                        index={index}
                    />
                );

                return (
                <Stack.Screen
                    key={screenName}
                    name={screenName}
                    component={FieldComponent}
                    options={{
                        headerTitle: `${screenName} (of ${totalScreens}) - ${fieldType}`,
                        headerStyle: {
                            backgroundColor: color
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            color: 'white'
                        },
                    }}
                />
                ); 
            })}
        </Stack.Navigator>
    );
}