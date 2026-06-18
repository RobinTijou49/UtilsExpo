import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Configurer les comportements de notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationsScreen() {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
    } catch (err) {
      console.error("Erreur vérification permissions:", err);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      setLoading(true);
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser les notifications",
        );
        return;
      }

      Alert.alert("Succès", "Permission accordée");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const scheduleNotification = async () => {
    try {
      if (permissionStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "Veuillez d'abord accepter les permissions notifications",
        );
        await requestNotificationPermission();
        return;
      }

      setLoading(true);

      // Programmer une notification après 3 secondes
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Expo Lab 🚀",
          body: "Notification test réussie",
          sound: "default",
          badge: 1,
        },
        trigger: {
          seconds: 1,
          repeats: false,
        } as Notifications.TimeIntervalTriggerInput,
      });

      setNotificationSent(true);
      Alert.alert(
        "Notification programmée",
        "Vous recevrez une notification dans 1 seconde",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", `Impossible de programmer: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const sendImmediateNotification = async () => {
    try {
      if (permissionStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "Veuillez d'abord accepter les permissions notifications",
        );
        await requestNotificationPermission();
        return;
      }

      setLoading(true);

      // Envoyer une notification immédiate (après 1 seconde)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Expo Lab 🚀",
          body: "Notification immédiate envoyée",
          sound: "default",
          badge: 1,
        },
        trigger: {
          seconds: 3,
          repeats: false,
        } as Notifications.TimeIntervalTriggerInput,
      });

      setNotificationSent(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case "granted":
        return "✅ Autorisé";
      case "denied":
        return "❌ Refusé";
      case "undetermined":
        return "❓ Non déterminé";
      default:
        return "❓ Inconnu";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔔 Écran Notifications</Text>

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Status permissions:</Text>
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{getPermissionStatusText()}</Text>
          </View>
        </View>

        {notificationSent && (
          <View style={styles.successSection}>
            <Text style={styles.successText}>✅ Notification envoyée!</Text>
          </View>
        )}

        <View style={styles.section}>
          <Button
            title="🔔 Demander permission"
            onPress={requestNotificationPermission}
            disabled={loading || permissionStatus === "granted"}
          />
        </View>

        <View style={styles.section}>
          <Button
            title="⏰ Programmer notification (3s)"
            onPress={scheduleNotification}
            disabled={loading}
            color="#ff9800"
          />
        </View>

        <View style={styles.section}>
          <Button
            title="⚡ Envoyer immédiatement"
            onPress={sendImmediateNotification}
            disabled={loading}
            color="#4caf50"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Les notifications seront affichées après 3 secondes. Gardez l'app
            ouverte ou en arrière-plan pour les voir.
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
  statusBox: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e65100",
  },
  successSection: {
    marginBottom: 20,
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  successText: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "600",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#1565c0",
    lineHeight: 20,
  },
});
