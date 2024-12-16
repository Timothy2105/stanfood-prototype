import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ResizeMode } from 'expo-av';
import { Video as ExpoVideo } from 'expo-av';
import Colors from '@/constants/Colors';

const LoadingScreen = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      router.replace('./share_location');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <ExpoVideo
          ref={videoRef}
          source={require('@/assets/animations/stanfood_logo_animation.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.ultraLightGrey,
  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 300,
    height: 300,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default LoadingScreen;
