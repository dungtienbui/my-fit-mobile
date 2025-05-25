import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Thêm thư viện icon
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Weight = ({ navigation }: any) => {
  const [value, setValue] = useState(2);
  const router = useRouter();

  const handleDecrease = () => {
    if (value > 0) {
      setValue(value - 0.5);
    }
  };

  const handleIncrease = () => {
    setValue(value + 0.5);
  };

  const handleSave = () => {
    alert(`Saved: ${value} L`);
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
        <Text style={styles.title}>Water</Text>
      </View>

      {/* Số lượng */}
      <View style={styles.content}>
        <Text style={styles.number}>{value}</Text>
        <Text style={styles.perDay}>L</Text>
      </View>

      {/* Nút - + */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.diffButton} onPress={handleDecrease}>
          <Text style={styles.diffText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.diffButton} onPress={handleIncrease}>
          <Text style={styles.diffText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Save - dưới cùng, cách bottom 20 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Weight;

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
    backgroundColor: '#38CE38', // Màu primary (xanh lá nhạt)
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

  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  number: {
    fontSize: 70,
    fontWeight: 'normal',
    color: '#000000000000', // màu trung bình, không đậm
  },
  perDay: {
    fontSize: 16,
    marginTop: 10,
    color: '#000000000000', // màu trung tính nhẹ
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  diffButton: {
    backgroundColor: '#E5E5E5', // màu nền nút
    borderRadius: 10,
    paddingVertical: 10, // thay đổi padding theo chiều cao
    paddingHorizontal: 75, // 150px = 75 * 2
    marginHorizontal: 8,
    borderColor: '#F5F5F5',
  },
  diffText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4B5563',
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
    backgroundColor: '#38CE38', // màu primary
    borderRadius: 25, // bo góc nhiều
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});