import HomeIcon from '../assets/icons/tempIcon.svg';
import MenuIcon from '../assets/icons/tempIcon.svg';
import NotificationsIcon from '../assets/icons/tempIcon.svg';
import LoginIcon from '../assets/icons/tempIcon.svg';

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const BottomNavBar = () => {
  return (
    <View style={styles.navBar}>
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.iconContainer}>
            <HomeIcon width={24} height={24} />
            <Text style={styles.iconText}>Home</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/menu" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.iconContainer}>
            <MenuIcon width={24} height={24} />
            <Text style={styles.iconText}>Menu</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/notifications" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.iconContainer}>
            <NotificationsIcon width={24} height={24} />
            <Text style={styles.iconText}>Notifications</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.iconContainer}>
            <LoginIcon width={24} height={24} />
            <Text style={styles.iconText}>Login</Text>
          </View>
        </TouchableOpacity>
      </Link>
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '170%',
  },
  iconText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
});

export default BottomNavBar;
