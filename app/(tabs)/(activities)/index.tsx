import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';
import { Menu, Divider, Provider } from 'react-native-paper';
import { useRouter } from 'expo-router';

// Thêm key 'route' cho từng card!
const activities = [
  {
    icon: <MaterialCommunityIcons name="run" size={24} color="#2ecc71" />,
    label: 'Exercise',
    bgColor: '#eafaf1',
    route: '/(tabs)/(activities)/activities-detail/exercise',
  },
  {
    icon: <FontAwesome5 name="bed" size={24} color="#9b59b6" />,
    label: 'Sleep',
    bgColor: '#f5ecfc',
    route: '/(tabs)/(activities)/activities-detail/sleep',
  },
  {
    icon: <Ionicons name="body" size={24} color="#3498db" />,
    label: 'Body measurements',
    bgColor: '#eaf3fc',
    route: '/(tabs)/(activities)/activities-detail/body-measurement',
  },
  {
    icon: <Entypo name="bowl" size={24} color="#e67e22" />,
    label: 'Nutrition',
    bgColor: '#fef2e7',
    route: '/(tabs)/(activities)/activities-detail/nutrition',
  },
];

export default function CollectionScreen() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const router = useRouter();

  const navigateTo = (path) => {
    closeMenu();
    router.push(path);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.header}>Collection</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activities.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: item.bgColor }]}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconWrapper}>{item.icon}</View>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Overlay làm mờ nền khi menu mở */}
        {visible && (
          <Pressable style={styles.overlay} onPress={closeMenu}>
            {/* Cho phép ấn ngoài để tắt menu */}
          </Pressable>
        )}
        <View pointerEvents="box-none" style={styles.fabWrapper}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity style={styles.fabButton} onPress={openMenu} activeOpacity={0.7}>
                <Ionicons name="add" size={32} color="#2ecc71" />
              </TouchableOpacity>
            }
            contentStyle={{
              borderRadius: 16,
              minWidth: 260,
              backgroundColor: '#fff',
            }}
          >
            <Menu.Item
              title="Live tracking"
              disabled
              titleStyle={{ color: "#bbb" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-exercise')}
              title="Exercise"
              titleStyle={{ color: "#222" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-sleep')}
              title="Sleep"
              titleStyle={{ color: "#222" }}
            />
            <Divider />
            <Menu.Item
              title="Manual log"
              disabled
              titleStyle={{ color: "#bbb" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-exercise')}
              title="Exercise"
              titleStyle={{ color: "#222" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-sleep')}
              title="Sleep"
              titleStyle={{ color: "#222" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-calories')}
              title="Calories"
              titleStyle={{ color: "#222" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-hydration')}
              title="Water"
              titleStyle={{ color: "#222" }}
            />
            <Menu.Item
              onPress={() => navigateTo('/(tabs)/(activities)/(add-metric)/add-body-measurement')}
              title="Body measurement"
              titleStyle={{ color: "#222" }}
            />
          </Menu>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 40 },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  scrollContent: { paddingBottom: 100 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#f0f0f0',
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  label: { fontSize: 16, fontWeight: '500' },
  fabWrapper: {
    position: 'absolute',
    right: 26,
    bottom: 34,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.20,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  overlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)', // Màu tối nhẹ, muốn mạnh hơn tăng 0.18 lên 0.3
    zIndex: 10,
  }
});
