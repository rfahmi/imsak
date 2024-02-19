// AppNavigator.tsx
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Home from '../../screens/Home';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const {top} = useSafeAreaInsets();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      <Toast topOffset={top} />
    </>
  );
};

export default AppNavigator;
