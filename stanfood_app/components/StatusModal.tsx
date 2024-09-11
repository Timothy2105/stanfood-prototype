import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface StatusModalProps {
  goBack: () => void;
  onSaveStatus: (status: string) => void;
  initialStatus: string;
  onCustomStatus: () => void;
}

interface StatusOptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  dotColor: string;
}

const StatusOption: React.FC<StatusOptionProps> = ({ label, isSelected, onSelect, dotColor }) => (
  <Pressable style={({ pressed }) => [styles.option, pressed && styles.optionPressed]} onPress={onSelect}>
    {({ pressed }) => (
      <>
        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
        <Text style={styles.optionText}>{label}</Text>
        <View style={[styles.outerSelectionCrcle, isSelected && styles.filledSelectionCircle]}>
          {isSelected && <View style={styles.innerSelectionCircle} />}
        </View>
      </>
    )}
  </Pressable>
);

const StatusModal: React.FC<StatusModalProps> = ({ goBack, onSaveStatus, initialStatus, onCustomStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    onSaveStatus(status);
    goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Online Status</Text>
      <View style={styles.optionsContainer}>
        <StatusOption
          label="Online"
          isSelected={selectedStatus === 'Online'}
          onSelect={() => handleStatusSelect('Online')}
          dotColor={Colors.green}
        />
        <StatusOption
          label="Do Not Disturb"
          isSelected={selectedStatus === 'Do Not Disturb'}
          onSelect={() => handleStatusSelect('Do Not Disturb')}
          dotColor={Colors.red}
        />
        <StatusOption
          label="Appear Offline"
          isSelected={selectedStatus === 'Appear Offline'}
          onSelect={() => handleStatusSelect('Appear Offline')}
          dotColor={Colors.offlineGrey}
        />
      </View>
      <View style={styles.separator} />
      <Pressable
        style={({ pressed }) => [styles.customOption, pressed && styles.customOptionPressed]}
        onPress={onCustomStatus}
      >
        {({ pressed }) => (
          <>
            <Ionicons name="pencil-outline" size={22} color={Colors.primary} style={styles.customIcon} />
            <Text style={styles.customOptionText}>Set a custom status</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    marginTop: 10,
    marginBottom: 30,
  },
  optionsContainer: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  optionPressed: {
    backgroundColor: Colors.grey,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 20,
    marginHorizontal: 3,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    marginHorizontal: 18,
  },
  outerSelectionCrcle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledSelectionCircle: {
    backgroundColor: Colors.primary,
  },
  innerSelectionCircle: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  separator: {
    height: 25,
  },
  customOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  customOptionPressed: {
    backgroundColor: Colors.grey,
  },
  customIcon: {
    marginHorizontal: 3,
  },
  customOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    marginHorizontal: 10,
  },
});

export default StatusModal;
