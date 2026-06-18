import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NavItem {
  name: string;
  route: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "Accueil", route: "/", icon: "🏠" },
  { name: "GPS", route: "/gps", icon: "📍" },
  { name: "Caméra", route: "/camera", icon: "📷" },
  { name: "Storage", route: "/storage", icon: "💾" },
  { name: "API", route: "/api", icon: "🐱" },
  { name: "Maps", route: "/maps", icon: "🗺️" },
  { name: "Lumière", route: "/light-sensor", icon: "💡" },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === "/" && pathname === "/") return true;
    if (route !== "/" && pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.navItem,
              isActive(item.route) && styles.navItemActive,
            ]}
            onPress={() => router.push(item.route as any)}
          >
            <Text
              style={[
                styles.navIcon,
                isActive(item.route) && styles.navIconActive,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                isActive(item.route) && styles.navLabelActive,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 26,
  },
  navLabel: {
    fontSize: 11,
    textAlign: "center",
    color: "#666",
  },
  navLabelActive: {
    fontSize: 12,
    color: "#2196f3",
    fontWeight: "600",
  },
});
