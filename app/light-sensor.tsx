import { LightSensor } from "expo-sensors";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function LightSensorScreen() {
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState(false);

  useEffect(() => {
    checkSensorAvailability();
  }, []);

  const checkSensorAvailability = async () => {
    try {
      const isAvailable = await LightSensor.isAvailableAsync();
      setSensorAvailable(isAvailable);
      if (!isAvailable) {
        setError("Capteur de luminosité non disponible sur cet appareil");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(`Erreur: ${errorMessage}`);
    }
  };

  const startListening = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!sensorAvailable) {
        setError("Capteur de luminosité non disponible");
        setLoading(false);
        return;
      }

      // Définir le délai d'actualisation (en ms)
      await LightSensor.setUpdateInterval(500);

      const subscription = LightSensor.addListener((data) => {
        setLightLevel(data.illuminance);
      });

      setIsListening(true);
      Alert.alert(
        "Écoute activée",
        "Le capteur de luminosité est maintenant actif. Approchez votre main du capteur pour voir les changements.",
      );

      // Stocker la souscription pour la désactiver plus tard
      (global as any).lightSensorSubscription = subscription;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(`Erreur: ${errorMessage}`);
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const stopListening = () => {
    try {
      if ((global as any).lightSensorSubscription) {
        (global as any).lightSensorSubscription.remove();
        (global as any).lightSensorSubscription = null;
      }
      setIsListening(false);
      Alert.alert("Arrêté", "L'écoute du capteur a été arrêtée");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", errorMessage);
    }
  };

  const resetData = () => {
    setLightLevel(null);
    setError(null);
  };

  const getLightLevelDescription = () => {
    if (lightLevel === null) return "Aucune lecture";
    if (lightLevel < 10) return "Très sombre (🌑)";
    if (lightLevel < 50) return "Sombre (🌙)";
    if (lightLevel < 500) return "Modéré (☁️)";
    if (lightLevel < 10000) return "Lumineux (☀️)";
    return "Très lumineux (😎)";
  };

  const getLightColor = () => {
    if (lightLevel === null) return "#ccc";
    if (lightLevel < 10) return "#1a1a1a";
    if (lightLevel < 50) return "#444";
    if (lightLevel < 500) return "#888";
    if (lightLevel < 10000) return "#ffcc00";
    return "#ff9800";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>💡 Capteur de Luminosité</Text>

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {sensorAvailable && (
          <>
            <View style={styles.section}>
              <View
                style={[styles.lightBox, { backgroundColor: getLightColor() }]}
              >
                <Text style={styles.lightValue}>
                  {lightLevel !== null
                    ? `${Math.round(lightLevel)} lux`
                    : "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>État:</Text>
              <View style={styles.statusBox}>
                <Text style={styles.statusText}>
                  {getLightLevelDescription()}
                </Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                📊 Niveau de luminosité en lux (lumens par mètre carré):
              </Text>
              <Text style={styles.infoTextSmall}>
                • Très sombre: &lt;10 lux{"\n"}• Sombre: 10-50 lux{"\n"}•
                Modéré: 50-500 lux{"\n"}• Lumineux: 500-10000 lux{"\n"}• Très
                lumineux: &gt;10000 lux
              </Text>
            </View>

            <View style={styles.section}>
              <Button
                title={
                  isListening ? "⏸️ Arrêter l'écoute" : "▶️ Démarrer l'écoute"
                }
                onPress={isListening ? stopListening : startListening}
                disabled={loading}
                color={isListening ? "#ff9800" : "#4caf50"}
              />
            </View>

            {isListening && (
              <View style={styles.section}>
                <Button
                  title="🔄 Réinitialiser"
                  onPress={resetData}
                  disabled={loading}
                  color="#2196f3"
                />
              </View>
            )}
          </>
        )}

        {!sensorAvailable && error && (
          <View style={styles.section}>
            <Text style={styles.warningText}>
              Ce capteur n'est pas disponible sur cet appareil.
            </Text>
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
    marginBottom: 15,
  },
  lightBox: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  lightValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  statusBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  statusText: {
    fontSize: 16,
    color: "#1565c0",
    fontWeight: "600",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#e65100",
    fontWeight: "600",
    marginBottom: 8,
  },
  infoTextSmall: {
    fontSize: 12,
    color: "#e65100",
    lineHeight: 18,
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
    fontWeight: "600",
  },
  warningText: {
    fontSize: 14,
    color: "#d32f2f",
    textAlign: "center",
    fontWeight: "600",
  },
});
