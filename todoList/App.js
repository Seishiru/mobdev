import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './ToDo/components/signin.js';
import SignUp from './ToDo/components/signup.js';
import TodoPage from './ToDo/components/todopage.js';
import CompletedPage from './ToDo/components/completed.js';
import Profile from './ToDo/components/profile.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="SignIn" 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: '#fff' }
            }}
          >
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="TodoPage" component={TodoPage} />
            <Stack.Screen name="Completed" component={CompletedPage} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
