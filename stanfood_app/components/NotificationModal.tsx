import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';

export type Ref = BottomSheetModal;

const NotificationModal = forwardRef<Ref, {}>((props, ref) => {
  const snapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

  const { dismiss } = useBottomSheetModal();

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ borderRadius: 0, backgroundColor: Colors.lightGrey }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Notifications</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Enable Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Disable Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneButton} onPress={() => dismiss()}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  optionText: {
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    marginTop: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationModal;
