import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export default function APIScreen() {
  const [catImage, setCatImage] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatImage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search",
      );

      if (!response.ok) {
        throw new Error(`API erreur: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setCatImage(data[0]);
      } else {
        setError("Aucune image trouvée");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(`Erreur: ${errorMessage}`);
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setCatImage(null);
    setError(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🐱 Écran API (Chat)</Text>

        <View style={styles.section}>
          <Text style={styles.description}>
            Cet écran appelle l'API The Cat API pour récupérer une image
            aléatoire de chat.
          </Text>
        </View>

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Chargement de l'image...</Text>
          </View>
        )}

        {catImage && (
          <View style={styles.section}>
            <Text style={styles.label}>✅ Image obtenue:</Text>
            <Image
              source={{ uri: catImage.url }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ID: {catImage.id}</Text>
              <Text style={styles.infoText}>
                Dimensions: {catImage.width}x{catImage.height}
              </Text>
            </View>
          </View>
        )}

        {!catImage && !loading && (
          <View style={styles.section}>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>🐱</Text>
              <Text style={styles.placeholderLabel}>Aucune image</Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Button
            title="🔄 Charger une nouvelle image"
            onPress={fetchCatImage}
            disabled={loading}
          />
        </View>

        {catImage && (
          <View style={styles.section}>
            <Button
              title="🗑️ Effacer l'image"
              onPress={resetImage}
              disabled={loading}
              color="#ff9800"
            />
          </View>
        )}

        <View style={styles.infoBoxBottom}>
          <Text style={styles.infoTextSmall}>
            API: https://api.thecatapi.com/v1/images/search
          </Text>
        </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#ddd",
  },
  placeholder: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 15,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  placeholderLabel: {
    fontSize: 14,
    color: "#999",
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
  infoBoxBottom: {
    backgroundColor: "#eceff1",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTextSmall: {
    fontSize: 12,
    color: "#546e7a",
    textAlign: "center",
    fontFamily: "monospace",
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
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
});
