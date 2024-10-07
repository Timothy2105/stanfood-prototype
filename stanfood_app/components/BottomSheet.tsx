import React, { forwardRef, useCallback, useMemo, useState, useRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import StatusModal from '@/components/StatusModal';

export interface BottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface BottomSheetProps {
  onToggle: (toggle: 'hungry' | 'full') => void;
  onStatusChange: (status: string) => void;
  initialStatus: string;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(({ onToggle, onStatusChange, initialStatus }, ref) => {
  const snapPoints = useMemo(() => ['50%'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [activeToggle, setActiveToggle] = useState<'hungry' | 'full'>('hungry');
  const [showStatus, setShowStatus] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const router = useRouter();

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  const resetState = useCallback(() => {
    setShowStatus(false);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  useImperativeHandle(
    ref,
    () => ({
      present: () => {
        resetState();
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }),
    [resetState]
  );

  const handleDismiss = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleToggle = useCallback(
    (toggle: 'hungry' | 'full') => {
      setActiveToggle(toggle);
      onToggle(toggle);
    },
    [onToggle]
  );

  const showStatusModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowStatus(true);
    });
  }, [slideAnim]);

  const hideStatusModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowStatus(false);
    });
  }, [slideAnim]);

  const handleCustomStatus = useCallback(() => {
    // Custom status change functionality to be implemented
    console.log('Custom status set');
  }, []);

  const handleSaveStatus = useCallback(
    (status: string) => {
      setCurrentStatus(status);
      onStatusChange(status);
    },
    [onStatusChange]
  );

  const handleLocationPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    setTimeout(() => {
      router.push('/(modal)/location_search');
    }, 175); // Timing for loocation router dismiss
  }, [router]);

  const mainContentTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -400],
  });

  const statusTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Online':
        return Colors.green;
      case 'Do Not Disturb':
        return Colors.red;
      case 'Appear Offline':
        return Colors.offlineGrey;
      default:
        return Colors.primary;
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: Colors.primary }}
      backgroundStyle={{ borderRadius: 26, backgroundColor: Colors.lightGrey }}
      onDismiss={handleDismiss}
    >
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.mainContent,
            {
              transform: [{ translateX: mainContentTranslate }],
            },
          ]}
        >
          <View style={styles.toggleSection}>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                activeToggle === 'hungry' ? styles.toggleActive : styles.toggleInactive,
                pressed && styles.togglePressed,
              ]}
              onPress={() => handleToggle('hungry')}
            >
              <Text style={activeToggle === 'hungry' ? styles.activeText : styles.inactiveText}>Hungry</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                activeToggle === 'full' ? styles.toggleActive : styles.toggleInactive,
                pressed && styles.togglePressed,
              ]}
              onPress={() => handleToggle('full')}
            >
              <Text style={activeToggle === 'full' ? styles.activeText : styles.inactiveText}>Full</Text>
            </Pressable>
          </View>

          <View style={styles.subheaderSection}>
            <Text style={styles.subheader}>Your Location</Text>
            <Pressable onPress={handleLocationPress}>
              {({ pressed }) => (
                <View style={[styles.item, pressed && styles.itemPressed]}>
                  <Ionicons name="location-outline" size={22} color={Colors.primary} />
                  <Text style={styles.itemText}>Current Location</Text>
                  <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
                </View>
              )}
            </Pressable>
          </View>

          <View style={styles.subheaderSection}>
            <Text style={styles.subheader}>Set Online Status</Text>
            <Pressable style={({ pressed }) => [styles.item, pressed && styles.itemPressed]} onPress={showStatusModal}>
              {({ pressed }) => (
                <>
                  <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(currentStatus) }]} />
                  <Text style={styles.itemText}>{currentStatus}</Text>
                  <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
                </>
              )}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => bottomSheetRef.current?.dismiss()}
          >
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            styles.statusContainer,
            {
              transform: [{ translateX: statusTranslate }],
            },
          ]}
        >
          <StatusModal
            goBack={hideStatusModal}
            onSaveStatus={handleSaveStatus}
            initialStatus={currentStatus}
            onCustomStatus={handleCustomStatus}
          />
        </Animated.View>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
  },
  statusContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.lightGrey,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 8,
    marginLeft: 4,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 15,
    gap: 10,
    marginBottom: 16,
  },
  toggleButton: {
    padding: 6,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleInactive: {
    borderColor: Colors.primary,
  },
  togglePressed: {
    opacity: 0.8,
  },
  activeText: {
    color: '#fff',
    fontWeight: '700',
  },
  inactiveText: {
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    marginTop: 24,
    margin: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subheaderSection: {
    paddingBottom: 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: '700',
    margin: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderColor: Colors.grey,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  itemPressed: {
    backgroundColor: Colors.grey,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
  },
});

export default BottomSheet;
