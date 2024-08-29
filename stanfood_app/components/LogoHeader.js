import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LogoSVG from '../assets/images/stanfoodlogo.svg';

const LogoHeader = ({ scrollY }) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [150, 90],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
      <View style={styles.logoContainer}>
        <LogoSVG style={styles.logoImage} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e1ab',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    paddingTop: 40,
    justifyContent: 'center',
  },
});

export default LogoHeader;
