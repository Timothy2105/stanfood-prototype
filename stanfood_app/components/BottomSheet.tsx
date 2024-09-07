import { View, Text, StyleSheet } from 'react-native';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export type Ref = BottomSheetModal;

const BottomSheet = forwardRef<Ref, { onToggle: (toggle: 'hungry' | 'full') => void }>(({ onToggle }, ref) => {
  const snapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

  const { dismiss } = useBottomSheetModal();
  const [activeToggle, setActiveToggle] = useState<'hungry' | 'full'>('hungry');
  const handleToggle = (toggle: 'hungry' | 'full') => {
    setActiveToggle(toggle); // Set local state
    onToggle(toggle); // Update parent of state change
  };

  return (
    <BottomSheetModal
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={{ borderRadius: 0, backgroundColor: Colors.lightGrey }}
      overDragResistanceFactor={0}
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.contentContainer}>
        <View style={styles.toggleSection}>
          <TouchableOpacity
            style={[styles.toggleButton, activeToggle === 'hungry' ? styles.toggleActive : styles.toggleInactive]}
            onPress={() => handleToggle('hungry')}
          >
            <Text style={activeToggle === 'hungry' ? styles.activeText : styles.inactiveText}>Hungry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeToggle === 'full' ? styles.toggleActive : styles.toggleInactive]}
            onPress={() => handleToggle('full')}
          >
            <Text style={activeToggle === 'full' ? styles.activeText : styles.inactiveText}>Full</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subheader}>Your Location</Text>
        <Link href={'/'} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Ionicons name="location-outline" size={22} color={Colors.primary} />
              <Text style={styles.itemText}>Current Location</Text>
              <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </Link>

        <Text style={styles.subheader}>Appearance</Text>
        <TouchableOpacity>
          <View style={styles.item}>
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
            <Text style={styles.itemText}>Online</Text>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => dismiss()}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
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
    margin: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
  },
});

export default BottomSheet;
