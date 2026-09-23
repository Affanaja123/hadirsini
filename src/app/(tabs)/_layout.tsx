import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="izin"
        options={{
          title: "Izin",
          tabBarIcon: ({ color, size }) => (
            <Feather name="edit" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Histori",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="reload" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}