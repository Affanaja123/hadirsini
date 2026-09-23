import { Tabs } from "expo-router";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    height: 70,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: "#FFF",
                },

                tabBarActiveTintColor: "#3046E6",
                tabBarInactiveTintColor: "#666",

                tabBarLabelStyle: {
                    fontFamily: "Poppins_500Medium",
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="view-dashboard"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="siswa"
                options={{
                    title: "Siswa",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="people-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="izin"
                options={{
                    title: "Izin",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="calendar-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="laporan"
                options={{
                    title: "Laporan",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="bar-chart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profil"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            
        </Tabs>

    );
}