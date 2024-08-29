import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LoadingScreen from '../screens/LoadingScreen'

export default function App() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Simulate a loading delay; modify when real data is being fetched
      setTimeout(() => {
        setIsLoading(false);
      }, 3000); 
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the StanFood App!</Text>
      <Button title="Go to Home" onPress={() => router.push('/menu')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 16,
  },
});