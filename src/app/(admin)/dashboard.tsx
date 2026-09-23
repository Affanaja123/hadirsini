import AsyncStorage from "@react-native-async-storage/async-storage";


import React from "react";
import { useEffect, useState, useCallback } from "react";
import {
    router,
    useFocusEffect,
} from "expo-router";
import { supabase } from "../../lib/supabase";
import HeaderWave from "../../components/HeaderWave";
import AdminHeader from "../../components/AdminHeader";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function DashboardScreen() {
    const [totalSiswa, setTotalSiswa] =
        useState(0);

    const [hadir, setHadir] =
        useState(0);

    const [terlambat, setTerlambat] =
        useState(0);

    const [izin, setIzin] =
        useState(0);

    const [alfa, setAlfa] =
        useState(0);

    const [activities, setActivities] =
        useState<any[]>([]);




    useEffect(() => {
        const channel = supabase
            .channel("dashboard-realtime")

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "kehadiran",
                },
                () => {
                    loadDashboard();
                }
            )

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "izin",
                },
                () => {
                    loadDashboard();
                }
            )

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function loadDashboard() {
        const now = new Date();

        const hariIni =
            now.getFullYear() +
            "-" +
            String(now.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(now.getDate()).padStart(2, "0");

        // total siswa
        const { count: jumlahSiswa } =
            await supabase
                .from("siswa")
                .select("*", {
                    count: "exact",
                    head: true,
                });

        // kehadiran hari ini
        const { data: kehadiran } =
            await supabase
                .from("kehadiran")
                .select(`
        *,
        siswa (
          nama
        )
      `)
                .eq("tanggal", hariIni);

        // izin hari ini
        const { data: izinData } =
            await supabase
                .from("izin")
                .select("*")
                .eq("tanggal", hariIni)
                .eq("status", "Disetujui");

        const hadirCount =
            kehadiran?.filter(
                (x) => x.status === "Hadir"
            ).length || 0;

        const terlambatCount =
            kehadiran?.filter(
                (x) => x.status === "Terlambat"
            ).length || 0;

        const izinCount =
            izinData?.length || 0;

        const alfaCount =
            (jumlahSiswa || 0) -
            hadirCount -
            terlambatCount -
            izinCount;

        setTotalSiswa(
            jumlahSiswa || 0
        );

        setHadir(
            hadirCount
        );

        setTerlambat(
            terlambatCount
        );

        setIzin(
            izinCount
        );

        setAlfa(
            alfaCount < 0 ? 0 : alfaCount
        );

        setActivities(
            kehadiran || []
        );
    }

    useFocusEffect(
        useCallback(() => {
            loadDashboard();
        }, [])
    );

    useEffect(() => {
        loadDashboard();
    }, []);
    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <AdminHeader title="Dashboard" />



            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >

                <View style={styles.content}>
                    {/* TOTAL SISWA */}
                    <View style={styles.mainCard}>
                        <View style={styles.mainHeader}>
                            <Text style={styles.mainLabel}>
                                TOTAL SISWA
                            </Text>

                            <Ionicons
                                name="people-outline"
                                size={24}
                                color="#7C8BF9"
                            />
                        </View>

                        <Text style={styles.mainNumber}>
                            {totalSiswa}
                        </Text>


                    </View>

                    {/* STATS */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View
                                style={styles.statHeader}
                            >
                                <Text
                                    style={[
                                        styles.statTitle,
                                        {
                                            color: "#22C55E",
                                        },
                                    ]}
                                >
                                    HADIR
                                </Text>

                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={22}
                                    color="#22C55E"
                                />
                            </View>

                            <Text
                                style={styles.statValue}
                            >
                                {hadir}
                            </Text>

                            <View
                                style={styles.greenBar}
                            />
                        </View>

                        <View style={styles.statCard}>
                            <View
                                style={styles.statHeader}
                            >
                                <Text
                                    style={[
                                        styles.statTitle,
                                        {
                                            color: "#F97316",
                                        },
                                    ]}
                                >
                                    TERLAMBAT
                                </Text>

                                <Ionicons
                                    name="time-outline"
                                    size={22}
                                    color="#F97316"
                                />
                            </View>

                            <Text
                                style={styles.statValue}
                            >
                                {terlambat}
                            </Text>

                            <View
                                style={styles.orangeBar}
                            />
                        </View>

                        <View style={styles.statCard}>
                            <View
                                style={styles.statHeader}
                            >
                                <Text
                                    style={[
                                        styles.statTitle,
                                        {
                                            color: "#4F46E5",
                                        },
                                    ]}
                                >
                                    IZIN
                                </Text>

                                <Ionicons
                                    name="calendar-outline"
                                    size={22}
                                    color="#7C8BF9"
                                />
                            </View>

                            <Text
                                style={styles.statValue}
                            >
                                {izin}
                            </Text>

                            <Text
                                style={styles.statDesc}
                            >
                                Ketidakhadiran sah
                            </Text>
                        </View>

                        <View style={styles.statCard}>
                            <View
                                style={styles.statHeader}
                            >
                                <Text
                                    style={[
                                        styles.statTitle,
                                        {
                                            color: "#EF4444",
                                        },
                                    ]}
                                >
                                    ALFA
                                </Text>

                                <Ionicons
                                    name="close-circle-outline"
                                    size={22}
                                    color="#EF4444"
                                />
                            </View>

                            <Text
                                style={styles.statValue}
                            >
                                {alfa}
                            </Text>

                            <Text
                                style={[
                                    styles.statDesc,
                                    {
                                        color: "#EF4444",
                                    },
                                ]}
                            >
                                Perlu tindak lanjut
                            </Text>
                        </View>
                    </View>




                    {/* AKTIVITAS */}
                    <View
                        style={styles.activityHeader}
                    >
                        <Text
                            style={styles.sectionTitle}
                        >
                            Aktivitas Terbaru
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                router.push("/admin-riwayat")
                            }
                        >
                            <Text style={styles.seeAll}>
                                Lihat Semua
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {activities.slice(0, 2).map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.activityCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/detail-absen",
                                    params: {
                                        id: item.id,
                                    },
                                })
                            }
                        >
                            <View
                                style={[
                                    styles.activityIcon,
                                    {
                                        backgroundColor:
                                            item.status === "Hadir"
                                                ? "#ECFDF3"
                                                : "#FFF7ED",
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={
                                        item.status === "Hadir"
                                            ? "checkmark"
                                            : item.status === "Terlambat"
                                                ? "time"
                                                : "alert-circle"
                                    }
                                    size={20}
                                    color={
                                        item.status === "Hadir"
                                            ? "#22C55E"
                                            : "#F97316"
                                    }
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.activityName}>
                                    {item.siswa?.nama}
                                </Text>

                                <Text style={styles.activityDesc}>
                                    {item.status}
                                    {" • "}
                                    {item.jam_masuk}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F1F7",
    },

    header: {
        height: 220,
        paddingHorizontal: 20,
        paddingTop: 20,

        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,

        overflow: "hidden",
    },

    logoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logoLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    appTitle: {
        color: "#FFF",
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
    },

    schoolText: {
        color: "#E5E7EB",
        fontFamily: "Poppins_400Regular",
    },

    notifButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor:
            "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
    },

    welcomeContainer: {
        marginTop: 25,
    },

    welcomeTitle: {
        color: "#FFF",
        fontSize: 26,
        fontFamily: "Poppins_600SemiBold",
    },

    welcomeSub: {
        color: "#E5E7EB",
        marginTop: 4,
        fontFamily: "Poppins_400Regular",
    },

    content: {
        paddingHorizontal: 18,
        paddingBottom: 20,

        marginTop: 10,
    },

    mainCard: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 18,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 5,
    },

    mainHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    mainLabel: {
        color: "#3046E6",
        fontFamily: "Poppins_600SemiBold",
    },

    mainNumber: {
        fontSize: 42,
        marginTop: 10,
        fontFamily: "Poppins_700Bold",
    },

    growthText: {
        color: "#22C55E",
        fontFamily: "Poppins_600SemiBold",
    },

    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 16,
    },

    statCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },

    statHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    statTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 13,
    },

    statValue: {
        fontSize: 34,
        marginTop: 10,
        fontFamily: "Poppins_700Bold",
    },

    statDesc: {
        color: "#666",
        marginTop: 5,
        fontSize: 12,
    },

    greenBar: {
        height: 6,
        backgroundColor: "#22C55E",
        borderRadius: 10,
        marginTop: 12,
    },

    orangeBar: {
        height: 6,
        backgroundColor: "#F97316",
        borderRadius: 10,
        marginTop: 12,
    },

    sectionTitle: {
        fontSize: 28,
        marginTop: 14,
        marginBottom: 14,
        fontFamily: "Poppins_700Bold",
    },

    quickGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    quickCard: {
        width: "23%",
        backgroundColor: "#E9E8FF",
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
    },

    quickText: {
        textAlign: "center",
        marginTop: 10,
        fontSize: 11,
        fontFamily: "Poppins_500Medium",
    },

    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },

    seeAll: {
        color: "#3046E6",
        fontFamily: "Poppins_500Medium",
    },

    activityCard: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        elevation: 2,
    },

    activityIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    activityName: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 15,
    },

    activityDesc: {
        color: "#666",
        fontFamily: "Poppins_400Regular",
    },

    activityTime: {
        color: "#888",
        fontSize: 12,
    },
});