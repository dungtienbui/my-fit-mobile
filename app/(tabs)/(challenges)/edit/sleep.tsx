import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Sleep = () => {
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');

  const router = useRouter();

  const isValidHour = (h: number) => h >= 0 && h <= 23;
  const isValidMinute = (m: number) => m >= 0 && m <= 59;

  const onChangeHour = (
    text: string,
    setFunc: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const num = text.replace(/[^0-9]/g, '');
    if (num === '') {
      setFunc('');
      return;
    }
    const val = Math.min(parseInt(num, 10), 23);
    setFunc(val.toString());
  };

  const onChangeMinute = (
    text: string,
    setFunc: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const num = text.replace(/[^0-9]/g, '');
    if (num === '') {
      setFunc('');
      return;
    }
    const val = Math.min(parseInt(num, 10), 59);
    setFunc(val.toString());
  };

  const handleSave = () => {
    if (
      startHour === '' ||
      startMinute === '' ||
      endHour === '' ||
      endMinute === ''
    ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc');
      return;
    }

    const sh = parseInt(startHour, 10);
    const sm = parseInt(startMinute, 10);
    const eh = parseInt(endHour, 10);
    const em = parseInt(endMinute, 10);

    if (!isValidHour(sh) || !isValidMinute(sm) || !isValidHour(eh) || !isValidMinute(em)) {
      Alert.alert('Lỗi', 'Giờ hoặc phút không hợp lệ (giờ: 0-23, phút: 0-59)');
      return;
    }
    const startTotal = sh * 60 + sm;
    const endTotal = eh * 60 + em;

    if (startTotal >= endTotal) {
      Alert.alert('Lỗi', 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
      return;
    }

    Alert.alert(
      'Đã lưu',
      `Thời gian bắt đầu: ${startHour.padStart(2, '0')}:${startMinute.padStart(
        2,
        '0'
      )}\nThời gian kết thúc: ${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}`
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Quay về */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Sleep</Text>
      </View>

      {/* Input Start Time */}
      <View style={styles.row}>
        <Text style={styles.label}>Start Time</Text>
        <View style={styles.timeInputs}>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={startHour}
            onChangeText={(text) => onChangeHour(text, setStartHour)}
            placeholder="HH"
            placeholderTextColor="#999"
            textAlign="center"
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={startMinute}
            onChangeText={(text) => onChangeMinute(text, setStartMinute)}
            placeholder="MM"
            placeholderTextColor="#999"
            textAlign="center"
          />
        </View>
      </View>

      {/* Input End Time */}
      <View style={styles.row}>
        <Text style={styles.label}>End Time</Text>
        <View style={styles.timeInputs}>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={endHour}
            onChangeText={(text) => onChangeHour(text, setEndHour)}
            placeholder="HH"
            placeholderTextColor="#999"
            textAlign="center"
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="number-pad"
            maxLength={2}
            value={endMinute}
            onChangeText={(text) => onChangeMinute(text, setEndMinute)}
            placeholder="MM"
            placeholderTextColor="#999"
            textAlign="center"
          />
        </View>
      </View>

      {/* Nút Save - dưới cùng */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Sleep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    //paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#38CE38', // màu xanh lá
    borderRadius: 8,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  row: {
    marginBottom: 36,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  timeInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  timeInput: {
    backgroundColor: '#F0FDF4', // nền xanh lá nhẹ
    borderRadius: 12,
    width: 70,
    height: 50,
    fontSize: 28,
    fontWeight: '600',
    color: '#134E07', // xanh đậm
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: '#2F855A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  colon: {
    fontSize: 32,
    fontWeight: '700',
    color: '#134E07',
    marginHorizontal: 6,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  saveButton: {
    width: '90%',
    paddingVertical: 16,
    backgroundColor: '#38CE38',
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
