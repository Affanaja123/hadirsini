import React, {
    useEffect,
    useState,
} from "react";

import { supabase } from "../lib/supabase";

import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";

import {
    router,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

export default function AdminRiwayatScreen() {
    const [riwayat, setRiwayat] =
        useState<any[]>([]);

    const [search, setSearch] =
        useState("");

    const [selectedMonth, setSelectedMonth] =
        useState(
            new Date().toLocaleDateString(
                "id-ID",
                {
                    month: "long",
                }
            )
        );

    const [showMonth, setShowMonth] =
        useState(false);

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    useEffect(() => {
        loadRiwayat();
    }, []);

    async function loadRiwayat() {
        const { data, error } =
            await supabase
                .from("kehadiran")
                .select(`
          *,
          siswa (
            nama
          )
        `)
                .order("tanggal", {
                    ascending: false,
                });

        if (error) {
            console.log(error);
            return;
        }

        setRiwayat(data || []);
    }

    const filteredRiwayat =
        riwayat.filter((item) => {

            const bulanItem =
                new Date(item.tanggal)
                    .toLocaleDateString(
                        "id-ID",
                        {
                            month: "long",
                        }
                    );

            const cocokBulan =
                bulanItem.toLowerCase() ===
                selectedMonth.toLowerCase();

            const cocokSearch =
                search.trim() === ""
                    ? true
                    : item.siswa?.nama
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    item.status
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

            return (
                cocokBulan &&
                cocokSearch
            );
        });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#111"
                    />
                </TouchableOpacity>

                <View>
                    <Text style={styles.title}>
                        Semua Riwayat Absensi
                    </Text>

                    <Text
                        style={{
                            color: "#666",
                            marginLeft: 12,
                        }}
                    >
                        {riwayat.length} Data Absensi
                    </Text>

                </View>
            </View>

            <View style={styles.topMenu}>

                <View
                    style={styles.searchContainer}
                >
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color="#9CA3AF"
                    />

                    <TextInput
                        placeholder="Cari siswa..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.monthBtn}
                        onPress={() =>
                            setShowMonth(
                                !showMonth
                            )
                        }
                    >
                        <Text
                            style={styles.monthText}
                        >
                            {selectedMonth}
                        </Text>

                        <Ionicons
                            name={
                                showMonth
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={16}
                            color="#3046E6"
                        />
                    </TouchableOpacity>

                    {showMonth && (
                        <View
                            style={styles.dropdown}
                        >
                            <ScrollView
                                nestedScrollEnabled
                            >
                                {months.map(
                                    (month) => (
                                        <TouchableOpacity
                                            key={month}
                                            style={
                                                styles.dropdownItem
                                            }
                                            onPress={() => {
                                                setSelectedMonth(
                                                    month
                                                );

                                                setShowMonth(
                                                    false
                                                );
                                            }}
                                        >
                                            <Text>
                                                {month}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                )}
                            </ScrollView>
                        </View>
                    )}
                </View>

            </View>

            <ScrollView





                
                contentContainerStyle={{
                    padding: 16,
                }}
            >
                {filteredRiwayat.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: "/detail-absen",
                                params: {
                                    id: item.id,
                                },
                            })
                        }
                    >
                        <View style={styles.row}>
                            <View style={styles.iconCircle}>
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
                                            : "#F59E0B"
                                    }
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.nama}>
                                    {item.siswa?.nama}
                                </Text>

                                <Text style={styles.tanggal}>
                                    {new Date(
                                        item.tanggal
                                    ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </Text>

                                <Text style={styles.jam}>
                                    Jam Masuk: {item.jam_masuk}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.badge,
                                    {
                                        backgroundColor:
                                            item.status === "Hadir"
                                                ? "#DCFCE7"
                                                : "#FEF3C7",
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color:
                                            item.status === "Hadir"
                                                ? "#16A34A"
                                                : "#D97706",
                                        fontWeight: "700",
                                    }}
                                >
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F4F3F8",
        },

        header: {
            flexDirection: "row",
            alignItems: "center",

            paddingHorizontal: 20,
            paddingTop: 50,
            paddingBottom: 15,
        },

        title: {
            fontSize: 22,
            marginLeft: 12,
            fontFamily:
                "Poppins_700Bold",
        },

        card: {
            backgroundColor: "#FFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
        },

        nama: {
            fontSize: 16,
            fontFamily:
                "Poppins_600SemiBold",
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
        },

        iconCircle: {
            width: 48,
            height: 48,
            borderRadius: 24,

            backgroundColor: "#F3F4F6",

            justifyContent: "center",
            alignItems: "center",

            marginRight: 12,
        },

        badge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },

        tanggal: {
            color: "#666",
            marginTop: 2,
        },

        jam: {
            color: "#999",
            marginTop: 2,
            fontSize: 12,
        },
        topMenu: {
            flexDirection: "row",
            paddingHorizontal: 16,
            marginBottom: 10,
        },

        searchContainer: {
            flex: 1,

            flexDirection: "row",

            alignItems: "center",

            height: 48,

            backgroundColor: "#FFF",

            borderRadius: 14,

            paddingHorizontal: 14,

            marginRight: 10,
        },

        searchInput: {
            flex: 1,
            marginLeft: 8,
        },

        monthBtn: {
            height: 48,

            minWidth: 120,

            paddingHorizontal: 14,

            borderRadius: 14,

            backgroundColor: "#EEF2FF",

            borderWidth: 1,

            borderColor: "#C7D2FE",

            flexDirection: "row",

            justifyContent: "space-between",

            alignItems: "center",
        },

        monthText: {
            color: "#3046E6",

            fontFamily:
                "Poppins_600SemiBold",
        },

        dropdown: {
            position: "absolute",

            top: 52,
            right: 0,

            width: 150,

            maxHeight: 220,

            backgroundColor: "#FFF",

            borderRadius: 16,

            borderWidth: 1,

            borderColor: "#E5E7EB",

            zIndex: 999,

            elevation: 6,
        },

        dropdownItem: {
            padding: 12,

            borderBottomWidth: 0.5,

            borderBottomColor:
                "#E5E7EB",
        },
    });