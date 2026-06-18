import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: "📍",
      title: "GPS",
      desc: "Récupérez votre localisation",
      route: "/gps",
    },
    {
      icon: "📷",
      title: "Caméra",
      desc: "Prenez des photos",
      route: "/camera",
    },
    {
      icon: "💾",
      title: "Storage",
      desc: "Sauvegardez vos données",
      route: "/storage",
    },
    {
      icon: "🐱",
      title: "API",
      desc: "Téléchargez des images",
      route: "/api",
    },
    {
      icon: "🗺️",
      title: "Maps",
      desc: "Affichez des cartes",
      route: "/maps",
    },
    {
      icon: "💡",
      title: "Lumière",
      desc: "Mesurez la luminosité",
      route: "/light-sensor",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🚀 Expo Lab</Text>
        <Text style={styles.subtitle}>
          Testez les fonctionnalités principales d&apos;Expo
        </Text>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Fonctionnalités disponibles :</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={() => router.push(feature.route as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Utilisez la barre de navigation en bas pour explorer chaque
            fonctionnalité et tester les capacités d&apos;Expo en détail.
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
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#1565c0",
    lineHeight: 20,
    textAlign: "center",
  },
});
