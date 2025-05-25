import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activity: { exerciseHours: 5, steps: 5000, sleepingStart: '23:00', sleepingEnd: '06:30' },
        health: { weight: null, bodyFatPercent: 10 },
        nutrition: { foodCalories: 2000 },
        energyBurned: 1200,
        water: 2,
      });
    }, 1000);
  });
};

export default function Index() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleNavigate = (pageName: string) => {
    router.push(`/(tabs)/(challenges)/edit/${pageName}` as any);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <Card label="Exercise hours" value={data.activity.exerciseHours} unit="Daily" onPress={() => handleNavigate('activity')} />
        <Card label="Steps" value={data.activity.steps.toLocaleString()} unit="Daily" onPress={() => handleNavigate('steps')} />
        <Card
          label="Sleeping"
          value={`${data.activity.sleepingStart} - ${data.activity.sleepingEnd}`}
          unit="Daily"
          onPress={() => handleNavigate('sleep')}
          isTimeRange
        />
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>Health</Text>
        <Card
          label="Weight"
          value={data.health.weight ? `${data.health.weight} kg` : "Set goal"}
          unit=""
          onPress={() => handleNavigate('weight')}
          isSpecial={!data.health.weight}
        />
        <Card label="Body fat percentage" value={`${data.health.bodyFatPercent} %`} unit="Target value" onPress={() => handleNavigate('bodyFat')} />
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>Nutrition</Text>
        <Card label="Food" value={`${data.nutrition.foodCalories} cal`} unit="Daily" onPress={() => handleNavigate('food')} />
        <Card label="Energy burned" value={`${data.energyBurned} cal`} unit="Daily" onPress={() => handleNavigate('energyBurned')} />
        <Card label="Water" value={`${data.water} L`} unit="Daily" onPress={() => handleNavigate('water')} />
      </View>
    </ScrollView>
    </SafeAreaView>
    </>
  );
}

function Card({ label, value, unit, onPress, isSpecial, isTimeRange = false }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.valueWithArrows}>
        <View style={styles.cardRight}>
          <Text
            style={[styles.cardValue, isSpecial && { color: '#16A34A' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {value}
          </Text>
          {unit ? <Text style={styles.cardUnit}>{unit}</Text> : null}
        </View>
        <View style={[styles.arrowsContainer, isTimeRange && { marginLeft: 10 }]}>
          <MaterialIcons
            name="keyboard-arrow-up"
            size={20}
            color="#000"
          />
          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color="#000"
            style={{ marginTop: 4 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionGroup: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000',
    maxWidth: '60%',
  },
  valueWithArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: 160,
  },
  cardRight: {
    alignItems: 'flex-end',
    maxWidth: 150,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'normal',
    marginBottom: 2,
    color: '#000',
  },
  cardUnit: {
    fontSize: 14,
    color: '#000',
  },
  arrowsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
