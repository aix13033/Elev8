import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

function MetricCard({ icon, label, value }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function Dashboard({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const base = process.env.EXPO_PUBLIC_API_BASE || '';
        const res = await fetch(`${base}/api/oura-metrics`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'network');
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load metrics');
      }
    }
    loadMetrics();
  }, []);

  const metricDefinitions = [
    { key: 'dailyActivity', icon: '👟', label: 'Steps', getValue: (m) => m?.dailyActivity?.[0]?.steps },
    { key: 'dailyCardiovascularAge', icon: '🫀', label: 'Cardio Age', getValue: (m) => m?.dailyCardiovascularAge?.[0]?.cardiovascular_age },
    { key: 'dailyReadiness', icon: '⚡', label: 'Readiness', getValue: (m) => m?.dailyReadiness?.[0]?.score },
    { key: 'dailyResilience', icon: '🧘', label: 'Resilience', getValue: (m) => m?.dailyResilience?.[0]?.score },
    { key: 'dailySleep', icon: '😴', label: 'Sleep Score', getValue: (m) => m?.dailySleep?.[0]?.score },
    { key: 'dailySpO2', icon: '🫁', label: 'Avg SpO₂', getValue: (m) => m?.dailySpO2?.[0]?.avg_saturation },
    { key: 'heartRate', icon: '❤️', label: 'Rest HR', getValue: (m) => m?.heartRate?.[0]?.bpm },
    { key: 'personalInfo', icon: '👤', label: 'Age', getValue: (m) => m?.personalInfo?.age },
    { key: 'restModePeriod', icon: '🛌', label: 'Rest Mode', getValue: (m) => m?.restModePeriod?.[0]?.start_datetime?.slice(0, 10) },
    { key: 'ringConfiguration', icon: '💍', label: 'Ring HW', getValue: (m) => m?.ringConfiguration?.hardware_version },
    { key: 'session', icon: '🎧', label: 'Session', getValue: (m) => m?.session?.[0]?.type },
    { key: 'sleep', icon: '🛏️', label: 'Sleep Duration', getValue: (m) => m?.sleep?.[0]?.total_sleep_duration },
    { key: 'sleepTime', icon: '⏰', label: 'Bedtime', getValue: (m) => m?.sleepTime?.[0]?.bedtime_start },
    { key: 'vo2Max', icon: '🏃', label: 'VO₂ Max', getValue: (m) => m?.vo2Max?.[0]?.vo2_max_ml_per_min_per_kg },
    { key: 'workout', icon: '🏋️', label: 'Workout Cal', getValue: (m) => m?.workout?.[0]?.calories },
  ];

  const formatValue = (v) => (v !== undefined && v !== null ? String(v) : 'N/A');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {metrics ? (
        <ScrollView contentContainerStyle={styles.metricsGrid}>
          {metricDefinitions.map((def) => (
            <MetricCard
              key={def.key}
              icon={def.icon}
              label={def.label}
              value={formatValue(def.getValue(metrics))}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.subtitle}>{error || 'Loading metrics...'}</Text>
      )}
      <Button title="Open Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
});
