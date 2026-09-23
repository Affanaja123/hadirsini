import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert } from "react-native";
import AdminHeader from "../../components/AdminHeader";

export default function ProfilScreen() {

    async function logout() {
        await AsyncStorage.removeItem("user");
        router.replace("/");
    }

    function konfirmasiLogout() {
        Alert.alert(
            "Keluar",
            "Yakin ingin keluar dari akun?",
            [
                {
                    text: "Batal",
                    style: "cancel",
                },
                {
                    text: "Keluar",
                    style: "destructive",
                    onPress: logout,
                },
            ]
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <AdminHeader title="" />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >


                {/* PENGATURAN */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Pengaturan Akun
                    </Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            router.push("/profil-sekolah")
                        }
                    >
                        <View style={styles.menuLeft}>
                            <View style={styles.iconCircle}>
                                <Ionicons
                                    name="school-outline"
                                    size={22}
                                    color="#3046E6"
                                />
                            </View>

                            <Text style={styles.menuText}>
                                Ubah Profil Sekolah
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#777"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            router.push("/ubah-profil-admin")
                        }
                    >
                        <View style={styles.menuLeft}>
                            <View style={styles.iconCircle}>
                                <Ionicons
                                    name="person-outline"
                                    size={22}
                                    color="#3046E6"
                                />
                            </View>

                            <Text style={styles.menuText}>
                                Ubah Profil
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                {/* LOGOUT */}
                <TouchableOpacity
                    style={styles.logoutCard}
                    onPress={konfirmasiLogout}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={24}
                        color="#DC2626"
                    />

                    <Text style={styles.logoutText}>
                        Keluar
                    </Text>
                </TouchableOpacity>

                <Text style={styles.version}>
                    Versi 1.0.0
                </Text>

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F3F8",
    },

    profileContainer: {
        alignItems: "center",
        marginTop: 10,
    },

    avatarWrapper: {
        position: "relative",
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: "#FFF",
    },

    editButton: {
        position: "absolute",
        bottom: 0,
        right: 0,

        width: 32,
        height: 32,
        borderRadius: 16,

        backgroundColor: "#4C5DF4",

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 2,
        borderColor: "#FFF",
    },

    name: {
        marginTop: 12,
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
    },

    email: {
        color: "#777",
        marginTop: 4,
    },

    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginTop: 25,
        borderRadius: 20,
        padding: 20,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 16,
        color: "#777",
        marginBottom: 20,
        fontFamily: "Poppins_600SemiBold",
    },

    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        marginBottom: 20,
    },

    menuLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,

        backgroundColor: "#EEF0FF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: 15,
    },

    menuText: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
    },

    logoutCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginTop: 20,

        borderRadius: 20,
        padding: 20,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#FECACA",
    },

    logoutText: {
        color: "#DC2626",
        marginLeft: 12,
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },

    version: {
        textAlign: "center",
        color: "#AAA",
        marginTop: 25,
    },
});