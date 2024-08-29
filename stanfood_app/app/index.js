import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../components/LoadingScreen'; 
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Simulate a loading delay; modify when real data is being fetched
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); 
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <HomeScreen />
  );
};

export default App;