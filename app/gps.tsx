import * as Location from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function GPSScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission de localisation refusée");
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser la localisation",
        );
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(`Erreur: ${errorMessage}`);
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📍 Écran GPS</Text>

        <View style={styles.section}>
          <Button
            title={loading ? "Chargement..." : "Obtenir ma position"}
            onPress={requestLocationPermission}
            disabled={loading}
          />
        </View>

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {location && (
          <View style={styles.section}>
            <Text style={styles.label}>✅ Position obtenue:</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Latitude: {location.coords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.infoText}>
                Longitude: {location.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.infoText}>
                Altitude: {location.coords.altitude?.toFixed(2)} m
              </Text>
              <Text style={styles.infoText}>
                Précision: {location.coords.accuracy?.toFixed(2)} m
              </Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  errorSection: {
    marginBottom: 20,
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    fontSize: 14,
    color: "#c62828",
    fontWeight: "500",
  },
});
