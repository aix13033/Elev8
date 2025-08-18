import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>\n      <Text style={styles.metricLabel}>{label}</Text>\n      <Text style={styles.metricValue}>{value}</Text>\n    </View>
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
        <View style={styles.metricsRow}>
          <Metric label="HRV" value={`${metrics.hrv} ms`} />
          <Metric label="RHR" value={`${metrics.rhr} bpm`} />
          <Metric label="Sleep" value={metrics.sleepScore} />
          <Metric label="Steps" value={metrics.steps} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  metric: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
