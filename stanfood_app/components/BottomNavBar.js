import HomeIcon from '../assets/icons/tempIcon.svg';
import MenuIcon from '../assets/icons/tempIcon.svg';
import NotificationsIcon from '../assets/icons/tempIcon.svg';
import LoginIcon from '../assets/icons/tempIcon.svg';

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BottomNavBar = () => {
  return (
    <View style={styles.navBar}>
      <View style={styles.navItem}>
        <HomeIcon width={24} height={24} />
        <Text style={styles.iconText}>Home</Text>
      </View>
      <View style={styles.navItem}>
        <MenuIcon width={24} height={24} />
        <Text style={styles.iconText}>Menu</Text>
      </View>
      <View style={styles.navItem}>
        <NotificationsIcon style={styles.icon} width={24} height={24} />
        <Text style={styles.iconText}>Notifications</Text>
      </View>
      <View style={styles.navItem}>
        <LoginIcon width={24} height={24} />
        <Text style={styles.iconText}>Login</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 85,
    backgroundColor: '#ff5733',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
});

export default BottomNavBar;
