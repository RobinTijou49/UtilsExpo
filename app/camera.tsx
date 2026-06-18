import * as ImagePicker from "expo-image-picker";
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

export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      setLoading(true);
      setError(null);

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setError("Permission caméra refusée");
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser l'accès à la caméra",
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setError(null);
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

  const pickImage = async () => {
    try {
      setLoading(true);
      setError(null);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setError("Permission galerie refusée");
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser l'accès à la galerie",
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setError(null);
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
    setImage(null);
    setError(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📷 Écran Caméra</Text>

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {image && (
          <View style={styles.section}>
            <Text style={styles.label}>✅ Photo capturée:</Text>
            <Image source={{ uri: image }} style={styles.image} />
            <Button
              title="Supprimer la photo"
              onPress={resetImage}
              color="#ff9800"
            />
          </View>
        )}

        {!image && (
          <View style={styles.section}>
            <Text style={styles.label}>Aucune photo sélectionnée</Text>
            <View style={styles.placeholder} />
          </View>
        )}

        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Button
            title="📸 Prendre une photo"
            onPress={takePicture}
            disabled={loading}
          />
        </View>

        <View style={styles.section}>
          <Button
            title="🖼️ Choisir de la galerie"
            onPress={pickImage}
            disabled={loading}
            color="#4caf50"
          />
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
    height: 200,
    borderRadius: 8,
    backgroundColor: "#ddd",
    marginBottom: 15,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#999",
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
