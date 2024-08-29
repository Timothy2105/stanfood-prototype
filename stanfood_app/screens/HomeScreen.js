import React, { useRef }from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import LogoHeader from '../components/LogoHeader'; 
import BottomNavBar from '../components/BottomNavBar'; 

const HomeScreen = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
  
    return (
      <View style={styles.container}>
        <LogoHeader scrollY={scrollY} />
        <Animated.ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Main content goes here */}
          <View style={styles.content}>
            <Text style={styles.contentText}>Welcome to the StanFood App!</Text>
            <Text style={styles.contentText}>AKA Home Screen</Text>
            <Text style={styles.contentText}>1...</Text>
            <Text style={styles.contentText}>2...</Text>
            <Text style={styles.contentText}>3...</Text>
            <Text style={styles.contentText}>1...</Text>
            <Text style={styles.contentText}>2...</Text>
            <Text style={styles.contentText}>3...</Text>
            <Text style={styles.contentText}>1...</Text>
            <Text style={styles.contentText}>2...</Text>
            <Text style={styles.contentText}>3...</Text>
            <Text style={styles.contentText}>1...</Text>
            <Text style={styles.contentText}>2...</Text>
            <Text style={styles.contentText}>3...</Text>
            <Text style={styles.contentText}>1...</Text>
            <Text style={styles.contentText}>2...</Text>
            <Text style={styles.contentText}>3...</Text>
            
          </View>
        </Animated.ScrollView>
        <BottomNavBar />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingTop: 150, // Match header height
    },
    contentText: {
      fontSize: 18,
      margin: 20,
      textAlign: 'center',
    },
  });

export default HomeScreen;