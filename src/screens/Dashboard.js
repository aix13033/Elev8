import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

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
        const res = await fetch('/api/oura-metrics');
        if (!res.ok) throw new Error('network');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load metrics');
      }
    }
    loadMetrics();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {metrics ? (
        <View style={styles.metricsGrid}>
          <MetricCard icon="💓" label="HRV" value={`${metrics.hrv} ms`} />
          <MetricCard icon="❤️" label="RHR" value={`${metrics.rhr} bpm`} />
          <MetricCard icon="😴" label="Sleep" value={metrics.sleepScore} />
          <MetricCard icon="👟" label="Steps" value={metrics.steps} />
        </View>
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
