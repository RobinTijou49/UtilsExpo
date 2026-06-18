import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

interface LocationCoord {
  latitude: number;
  longitude: number;
}

// Fonction pour calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface UserLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapsScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [mapRegion, setMapRegion] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trajectory, setTrajectory] = useState<LocationCoord[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null,
  );

  useEffect(() => {
    return () => {
      // Nettoyer la souscription à la localisation quand le composant se démonte
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== "granted") {
        setError("Permission de localisation refusée");
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser la localisation pour voir votre position sur la carte",
        );
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      // Configurer la région de la carte
      setMapRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

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

  const centerMapOnLocation = () => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const startTracking = async () => {
    try {
      if (permissionStatus !== "granted") {
        Alert.alert(
          "Permission requise",
          "Veuillez d'abord accepter les permissions de localisation",
        );
        return;
      }

      setLoading(true);
      setTrajectory([]);
      setTotalDistance(0);

      // Ajouter la position actuelle comme point de départ
      if (location) {
        setTrajectory([
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        ]);
      }

      // Commencer le suivi en temps réel
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);

          // Ajouter le nouveau point au trajet
          setTrajectory((prevTrajectory) => {
            const newTrajectory = [...prevTrajectory];
            const lastPoint = newTrajectory[newTrajectory.length - 1];

            // Calculer la distance avec le dernier point
            const distance = calculateDistance(
              lastPoint.latitude,
              lastPoint.longitude,
              newLocation.coords.latitude,
              newLocation.coords.longitude,
            );

            // Ajouter le point seulement s'il y a une distance significative
            if (distance > 0.001) {
              newTrajectory.push({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
              });

              // Mettre à jour la distance totale
              setTotalDistance((prevDistance) => prevDistance + distance);
            }

            return newTrajectory;
          });

          // Centrer la carte sur la position actuelle
          setMapRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
      );

      watchSubscriptionRef.current = subscription;
      setIsTracking(true);
      Alert.alert(
        "Suivi activé",
        "Votre position est suivie en temps réel. Commencez à vous déplacer!",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = () => {
    try {
      if (watchSubscriptionRef.current) {
        watchSubscriptionRef.current.remove();
        watchSubscriptionRef.current = null;
      }
      setIsTracking(false);
      Alert.alert(
        "Suivi arrêté",
        `Distance parcourue: ${totalDistance.toFixed(2)} km`,
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", errorMessage);
    }
  };

  const clearTrajectory = () => {
    Alert.alert("Confirmer", "Êtes-vous sûr de vouloir effacer le trajet?", [
      { text: "Annuler", onPress: () => {}, style: "cancel" },
      {
        text: "Effacer",
        onPress: () => {
          setTrajectory([]);
          setTotalDistance(0);
        },
        style: "destructive",
      },
    ]);
  };

  const refreshLocation = async () => {
    try {
      const userLocation = await Location.getCurrentPositionAsync({});

      setLocation(userLocation);

      setMapRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      Alert.alert("Erreur", "Impossible d'actualiser la position");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🗺️ Ma Position sur la Carte</Text>

        {loading && (
          <View style={styles.section}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {!location && !mapRegion && (
          <View style={styles.section}>
            <Text style={styles.label}>
              Cliquez sur le bouton ci-dessous pour accéder à votre position
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {mapRegion && (
          <View style={styles.section}>
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChange={setMapRegion}
            >
              {/* Afficher le trajet complet */}
              {trajectory.length > 1 && (
                <Polyline
                  coordinates={trajectory}
                  strokeColor="rgba(33, 150, 243, 0.8)"
                  strokeWidth={3}
                  lineCap="round"
                  lineJoin="round"
                />
              )}

              {/* Afficher le point de départ */}
              {trajectory.length > 0 && (
                <Marker
                  coordinate={trajectory[0]}
                  title="Départ"
                  pinColor="#4caf50"
                />
              )}

              {/* Afficher le point de fin (position actuelle) */}
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Position actuelle"
                  description={`Lat: ${location.coords.latitude.toFixed(
                    6,
                  )}, Lon: ${location.coords.longitude.toFixed(6)}`}
                  pinColor={isTracking ? "#ff9800" : "#2196f3"}
                />
              )}
            </MapView>
          </View>
        )}

        {location && (
          <>
            {/* Afficher les informations du trajet */}
            {trajectory.length > 0 && (
              <View style={styles.section}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>📍 Points du trajet:</Text>
                  <Text style={styles.infoValue}>
                    {trajectory.length} points
                  </Text>

                  <Text style={styles.infoLabel}>📏 Distance parcourue:</Text>
                  <Text style={styles.infoValue}>
                    {totalDistance.toFixed(3)} km
                  </Text>

                  <Text style={styles.infoLabel}>⏱️ État du suivi:</Text>
                  <Text style={styles.infoValue}>
                    {isTracking ? "🟢 En cours..." : "⏹️ Arrêté"}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Coordonnées actuelles :</Text>

                <Text style={styles.detailText}>
                  Latitude : {location.coords.latitude.toFixed(6)}
                </Text>

                <Text style={styles.detailText}>
                  Longitude : {location.coords.longitude.toFixed(6)}
                </Text>

                <Text style={styles.detailText}>
                  Altitude : {location.coords.altitude?.toFixed(2)} m
                </Text>

                <Text style={styles.detailText}>
                  Précision : {location.coords.accuracy?.toFixed(2)} m
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Button
            title={
              permissionStatus === "granted"
                ? "✅ Permission accordée"
                : "🔐 Demander permission"
            }
            onPress={requestLocationPermission}
            disabled={loading || permissionStatus === "granted"}
            color={permissionStatus === "granted" ? "#4caf50" : "#2196f3"}
          />
        </View>

        {location && !isTracking && (
          <View style={styles.section}>
            <Button
              title="▶️ Démarrer le suivi"
              onPress={startTracking}
              disabled={loading}
              color="#4caf50"
            />
          </View>
        )}

        {isTracking && (
          <View style={styles.section}>
            <Button
              title="⏹️ Arrêter le suivi"
              onPress={stopTracking}
              disabled={loading}
              color="#f44336"
            />
          </View>
        )}

        {trajectory.length > 0 && (
          <>
            <View style={styles.section}>
              <Button
                title="📍 Centrer sur ma position"
                onPress={centerMapOnLocation}
                disabled={loading}
                color="#ff9800"
              />
            </View>

            <View style={styles.section}>
              <Button
                title="🔄 Actualiser la position"
                onPress={refreshLocation}
                disabled={loading}
                color="#2196f3"
              />
            </View>
          </>
        )}

        <View style={styles.infoBoxBottom}>
          <Text style={styles.infoTextSmall}>
            💡 La carte affiche votre position actuelle. Vous pouvez zoomer et
            vous déplacer sur la carte pour explorer votre région.
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
  map: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 15,
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
    fontWeight: "600",
  },
  infoBoxBottom: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
    marginTop: 20,
  },
  infoTextSmall: {
    fontSize: 12,
    color: "#1565c0",
    lineHeight: 18,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },

  infoValue: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },

  detailBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },

  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  detailText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
});
