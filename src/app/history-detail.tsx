import React from "react";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HistoryDetailScreen() {
    const { month } = useLocalSearchParams();

    const [activeFilter, setActiveFilter] =
        React.useState("Semua");


    const [dataIzin, setDataIzin] =
        React.useState<any[]>([]);

    async function loadDetail() {
        const userString =
            await AsyncStorage.getItem("user");

        if (!userString) return;

        const user =
            JSON.parse(userString);

        const { data, error } =
            await supabase
                .from("izin")
                .select("*")
                .eq("siswa_id", user.id);

        if (error) {
            console.log(error);
            return;
        }

        const filtered =
            data?.filter((item) => {
                const bulan =
                    new Date(
                        item.tanggal
                    ).toLocaleDateString(
                        "id-ID",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    );

                return (
                    bulan.toLowerCase() ===
                    String(month).toLowerCase()
                );
            }) || [];

        setDataIzin(filtered);
    }

    useEffect(() => {
        loadDetail();
    }, []);

    const total = dataIzin.length;

    const disetujui =
        dataIzin.filter(
            (x) => x.status === "Disetujui"
        ).length;

    const diproses =
        dataIzin.filter(
            (x) => x.status === "Menunggu"
        ).length;

    const ditolak =
        dataIzin.filter(
            (x) => x.status === "Ditolak"
        ).length;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/(tabs)/history")
                        }
                    >
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color="#2563EB"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Histori Izin - {month}
                    </Text>
                </View>

                {/* FILTER */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            activeFilter === "Semua" && styles.activeBlue,
                        ]}
                        onPress={() => setActiveFilter("Semua")}
                    >
                        <Text
                            style={
                                activeFilter === "Semua"
                                    ? styles.activeText
                                    : styles.filterText
                            }
                        >
                            Semua
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            styles.redSoft,
                            activeFilter === "Ditolak" &&
                            styles.activeRed,
                        ]}
                        onPress={() => setActiveFilter("Ditolak")}
                    >
                        <Text
                            style={
                                activeFilter === "Ditolak"
                                    ? styles.activeText
                                    : styles.filterText
                            }
                        >
                            Ditolak
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            styles.greenSoft,
                            activeFilter === "Disetujui" &&
                            styles.activeGreen,
                        ]}
                        onPress={() => setActiveFilter("Disetujui")}
                    >
                        <Text
                            style={
                                activeFilter === "Disetujui"
                                    ? styles.activeText
                                    : styles.filterText
                            }
                        >
                            Disetujui
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            styles.yellowSoft,
                            activeFilter === "Diproses" &&
                            styles.activeYellow,
                        ]}
                        onPress={() => setActiveFilter("Diproses")}
                    >
                        <Text
                            style={
                                activeFilter === "Diproses"
                                    ? styles.activeText
                                    : styles.filterText
                            }
                        >
                            Diproses
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SUMMARY CARD */}
                <View style={styles.summaryCard}>
                    <Ionicons
                        name="calendar"
                        size={40}
                        color="#2563EB"
                    />

                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.monthTitle}>
                            {month}
                        </Text>

                        <Text>
                            Total Izin {total}
                        </Text>

                        <View style={styles.statsRow}>
                            <Text style={{ color: "green" }}>
                                ● Disetujui {disetujui}
                            </Text>

                            <Text style={{ color: "#EAB308" }}>
                                ● Diproses {diproses}
                            </Text>

                            <Text style={{ color: "red" }}>
                                ● Ditolak {ditolak}
                            </Text>
                        </View>
                    </View>
                </View>

                {dataIzin
                    .filter((item) => {
                        if (activeFilter === "Semua")
                            return true;

                        if (
                            activeFilter ===
                            "Diproses"
                        ) {
                            return (
                                item.status ===
                                "Menunggu"
                            );
                        }

                        return (
                            item.status ===
                            activeFilter
                        );
                    })
                    .map((item) => (
                        <View
                            key={item.id}
                            style={styles.itemCard}
                        >
                            <Text style={styles.date}>
                                {item.tanggal}
                            </Text>

                            <Text style={styles.title}>
                                {item.jenis}
                            </Text>

                            <Text style={styles.desc}>
                                {item.alasan}
                            </Text>

                            <View
                                style={{
                                    alignSelf: "flex-start",
                                    backgroundColor:
                                        item.status ===
                                            "Disetujui"
                                            ? "#DCFCE7"
                                            : item.status ===
                                                "Ditolak"
                                                ? "#FEE2E2"
                                                : "#FEF9C3",
                                    paddingHorizontal: 12,
                                    paddingVertical: 5,
                                    borderRadius: 20,
                                    marginTop: 10,
                                }}
                            >
                                <Text>
                                    {item.status ===
                                        "Menunggu"
                                        ? "Diproses"
                                        : item.status}
                                </Text>
                            </View>
                        </View>
                    ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },

    headerTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
        color: "#2563EB",
    },

    filterRow: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
    },

    filterBtn: {
        paddingHorizontal: 16,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
    },

    whiteText: {
        color: "#FFF",
    },

    summaryCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        marginBottom: 16,
        elevation: 4,
    },

    monthTitle: {
        fontFamily: "Poppins_700Bold",
        fontSize: 18,
    },

    statsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 6,
    },

    itemCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },

    date: {
        color: "#666",
    },

    title: {
        fontFamily: "Poppins_700Bold",
    },

    desc: {
        color: "#666",
        marginTop: 4,
    },

    badgeGreen: {
        alignSelf: "flex-start",
        backgroundColor: "#DCFCE7",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 10,
    },

    badgeRed: {
        alignSelf: "flex-start",
        backgroundColor: "#FEE2E2",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 10,
    },

    badgeYellow: {
        alignSelf: "flex-start",
        backgroundColor: "#FEF9C3",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 10,
    },

    badgeText: {
        fontFamily: "Poppins_600SemiBold",
    },

    activeBlue: {
        backgroundColor: "#2563EB",
    },

    activeGreen: {
        backgroundColor: "#22C55E",
    },

    activeYellow: {
        backgroundColor: "#EAB308",
    },

    activeRed: {
        backgroundColor: "#EF4444",
    },

    greenSoft: {
        backgroundColor: "#C7DFC8",
    },

    yellowSoft: {
        backgroundColor: "#E8D9A8",
    },

    redSoft: {
        backgroundColor: "#F2D0CA",
    },

    activeText: {
        color: "#FFF",
        fontFamily: "Poppins_600SemiBold",
    },

    filterText: {
        color: "#111827",
        fontFamily: "Poppins_600SemiBold",
    },
});