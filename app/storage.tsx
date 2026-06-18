import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "user_name";

export default function StorageScreen() {
  const [inputValue, setInputValue] = useState("");
  const [savedName, setSavedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    loadName();
  }, []);

  const saveName = async () => {
    if (!inputValue.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom");
      return;
    }

    try {
      setLoading(true);
      await AsyncStorage.setItem(STORAGE_KEY, inputValue);
      setSavedName(inputValue);
      setGreeting(`Bonjour ${inputValue}`);
      setInputValue("");
      Alert.alert("Succès", "Nom sauvegardé");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", `Impossible de sauvegarder: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const loadName = async () => {
    try {
      setLoading(true);
      const name = await AsyncStorage.getItem(STORAGE_KEY);
      if (name) {
        setSavedName(name);
        setGreeting(`Bonjour ${name}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", `Impossible de charger: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSavedName(null);
      setGreeting(null);
      setInputValue("");
      Alert.alert("Succès", "Données supprimées");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", `Impossible de supprimer: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>💾 Écran Storage</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Entrez votre nom:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Pierre"
            value={inputValue}
            onChangeText={setInputValue}
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Button
            title="💾 Sauvegarder"
            onPress={saveName}
            disabled={loading}
          />
        </View>

        {greeting && (
          <View style={styles.section}>
            <View style={styles.greetingBox}>
              <Text style={styles.greetingText}>{greeting} 👋</Text>
            </View>
          </View>
        )}

        {savedName && (
          <View style={styles.section}>
            <Text style={styles.label}>✅ Nom sauvegardé:</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{savedName}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Button
            title="🔄 Recharger"
            onPress={loadName}
            disabled={loading}
            color="#2196f3"
          />
        </View>

        <View style={styles.section}>
          <Button
            title="🗑️ Supprimer tout"
            onPress={clearStorage}
            disabled={loading}
            color="#f44336"
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
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
    color: "#333",
  },
  greetingBox: {
    backgroundColor: "#e3f2fd",
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1976d2",
  },
});
