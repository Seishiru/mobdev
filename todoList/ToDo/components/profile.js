import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  const handleSignOut = () => {
    // Add sign out logic here later
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/todologo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('TodoPage')}
        >
          <Ionicons name="list" size={24} color="#000" />
          <Text>To do</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Completed')}
        >
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#000" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 40,
  },
  signOutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default Profile;
