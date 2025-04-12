import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log('Sign up pressed');
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/todologo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={navigateToSignIn}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#333',
  },
  signInLink: {
    fontSize: 16,
    color: '#4169E1',
    fontWeight: 'bold',
  },
});

export default SignUp;
