import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import {Provider} from 'react-redux';
import AppNavigator from './src/configs/navigation/AppNavigator';
import {Text} from 'react-native-ui-lib';
// import store from './src/configs/redux/store';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      {/* <Provider store={store}> */}
      <AppNavigator />
      {/* </Provider> */}
    </SafeAreaProvider>
  );
};

export default App;
