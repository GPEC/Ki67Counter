import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStore = {
    saveData: async (key, dataObj) => {
        try {
            key = key.toString();
            const serialised = JSON.stringify(dataObj);
            await AsyncStorage.setItem(key, serialised);

            console.log('Data saved successfully');
        } catch (error) {
            console.log('Error while saving data: ', error);
        }
    },

    fetchAllData: async () => {
        try {
            let allStoredValues = [];
            const allKeys = await AsyncStorage.getAllKeys();

            await Promise.all(
                allKeys.map(async (key) => {
                    const jsonValue = await AsyncStorage.getItem(key);
                    const value = JSON.parse(jsonValue);
                    
                    allStoredValues.push({ key, value });
                })
            );

            console.log('Data fetched successfully');
            return allStoredValues;
        } catch (error) {
            console.log('Error while fetching all data: ', error);
        }
    },

    deleteAllData: async () => {
        try {
            const allKeys = await AsyncStorage.getAllKeys();

            await AsyncStorage.multiRemove(allKeys);
            console.log('Data removed successfully');
        
        } catch (error) {
            console.log("Error while deleting all data: ", error);
        }

    }
}

export default AsyncStore;