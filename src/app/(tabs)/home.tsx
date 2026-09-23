import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import HeaderWave from "../../components/HeaderWave";

export default function HomeScreen() {
    const [time, setTime] = useState("");
    const [selectedMonth, setSelectedMonth] =
        useState(
            new Date().toLocaleDateString(
                "id-ID",
                {
                    month: "long",
                }
            )
        );
    const [showMonth, setShowMonth] = useState(false);
    const [riwayat, setRiwayat] = useState<any[]>([]);
    const [namaSiswa, setNamaSiswa] = useState("");
    const [tanggalHariIni, setTanggalHariIni] = useState("");
    const [search, setSearch] = useState("");

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

        const updateWaktu = () => {
            const now = new Date();

            setTime(
                now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );

            setTanggalHariIni(
                now.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
            );
        };

        updateWaktu();

        const interval =
            setInterval(updateWaktu, 1000);

        return () =>
            clearInterval(interval);
    }, []);

    async function loadRiwayat() {
        const userString =
            await AsyncStorage.getItem("user");

        if (!userString) return;

        const user =
            JSON.parse(userString);

        setNamaSiswa(user.nama);

        const { data, error } =
            await supabase
                .from("kehadiran")
                .select("*")
                .eq("siswa_id", user.id)
                .order("tanggal", {
                    ascending: false,
                });

        if (error) {
            console.log(error);
            return;
        }

        setRiwayat(data || []);
    }

    const [user, setUser] = useState<any>(null);
    async function loadUser() {
        const userString =
            await AsyncStorage.getItem("user");

        if (!userString) return;

        const loginUser =
            JSON.parse(userString);

        const { data } =
            await supabase
                .from("siswa")
                .select(`
        *,
        kelas (
          kelas,
          jurusan
        )
      `)
                .eq("id", loginUser.id)
                .single();


        setUser(data);
    }
    useEffect(() => {
        loadUser();
    }, []);

    const filteredRiwayat = riwayat.filter(
        (item) => {
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
                    : item.tanggal
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    item.status
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    item.jam_masuk
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

            return (
                cocokBulan &&
                cocokSearch
            );
        }
    );

    async function logout() {
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
                    onPress: async () => {
                        await AsyncStorage.removeItem(
                            "user"
                        );

                        router.replace("/");
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <LinearGradient
                colors={["#4657E8", "#5E72FF", "#728CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.profileRow}>
                    <View style={styles.leftProfile}>
                        <TouchableOpacity
                            onPress={() => router.push("/profile")}
                        >
                            <View style={styles.avatar}>
                                <Ionicons
                                    name="person"
                                    size={30}
                                    color="#4F46E5"
                                />
                            </View>
                        </TouchableOpacity>

                        <View>
                            <Text style={styles.greeting}>
                                Halo, {user?.nama || "-"}
                            </Text>

                            <Text style={styles.classText}>
                                {user?.kelas?.kelas} {user?.kelas?.jurusan}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerActions}>
                        {/* <TouchableOpacity style={styles.iconCircle}>
                                <Ionicons
                                    name="notifications-outline"
                                    size={22}
                                    color="#FFF"
                                />
                            </TouchableOpacity> */}

                        <TouchableOpacity
                            style={styles.iconCircle}
                            onPress={logout}
                        >
                            <MaterialCommunityIcons
                                name="logout"
                                size={22}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <HeaderWave />
            </LinearGradient>



            {/* CARD INFO */}
            <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                    <Ionicons
                        name="time-outline"
                        size={38}
                        color="#4F46E5"
                    />

                    <View>
                        <Text style={styles.label}>
                            Waktu Saat Ini
                        </Text>

                        <Text style={styles.bold}>
                            {time}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Ionicons
                        name="calendar-outline"
                        size={38}
                        color="#4F46E5"
                    />

                    <View>
                        <Text style={styles.label}>
                            Tanggal Hari Ini
                        </Text>

                        <Text
                            style={[
                                styles.bold,
                                {
                                    fontSize: 14,
                                },
                            ]}
                        >
                            {tanggalHariIni}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
            >


                {/* ABSEN */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Absen & Selfie
                    </Text>

                    <TouchableOpacity
                        style={styles.absenButton}
                        onPress={() => router.push("/camera")}
                    >
                        <View style={styles.cameraCircle}>
                            <Ionicons
                                name="camera"
                                size={28}
                                color="#4F46E5"
                            />
                        </View>

                        <Text style={styles.absenTitle}>
                            Absen
                        </Text>

                        <Text style={styles.absenSubtitle}>
                            Ambil foto untuk absen
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.infoText}>
                        Sistem mewajibkan foto kamera langsung
                        dan deteksi GPS aktif.
                    </Text>
                </View>

                {/* RIWAYAT */}
                <View style={styles.card}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <Text style={styles.sectionTitle}>
                            Riwayat Absen
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                router.push("/riwayat-kehadiran")
                            }
                        >
                            <Text
                                style={{
                                    color: "#3046E6",
                                    fontWeight: "700",
                                }}
                            >
                                Lihat Semua
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {filteredRiwayat.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="document-text-outline"
                                size={70}
                                color="#C7C7C7"
                            />

                            <Text style={styles.emptyTitle}>
                                Belum ada Absen
                            </Text>

                            <Text style={styles.emptyText}>
                                Riwayat absen akan muncul di sini
                            </Text>
                        </View>
                    ) : (
                        filteredRiwayat
                            .slice(0, 2)
                            .map((item) => (
                                <View
                                    key={item.id}
                                    style={{
                                        backgroundColor: "#F8F9FC",
                                        borderRadius: 14,
                                        padding: 14,
                                        marginTop: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: "700",
                                            fontSize: 15,
                                        }}
                                    >
                                        {item.tanggal}
                                    </Text>

                                    <Text
                                        style={{
                                            color: "#666",
                                            marginTop: 4,
                                        }}
                                    >
                                        Jam Masuk: {item.jam_masuk}
                                    </Text>

                                    <Text
                                        style={{
                                            marginTop: 4,
                                            color:
                                                item.status === "Hadir"
                                                    ? "green"
                                                    : "orange",
                                        }}
                                    >
                                        {item.status}
                                    </Text>
                                </View>
                            ))
                    )}
                </View>
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
        height: 230,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden",

        paddingTop: 20,
        paddingHorizontal: 20,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
    },

    leftProfile: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    greeting: {
        color: "#FFF",
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
    },
    classText: {
        color: "#FFF",
        marginTop: 2,
        fontFamily: "Poppins_400Regular",
    },

    headerActions: {
        flexDirection: "row",
        marginLeft: "auto",
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: -55,
    },

    infoCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 6,

        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    label: {
        color: "#666",
        fontSize: 12,
    },

    bold: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
    },
    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 20,
        padding: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 4,
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
        color: "#111827",
        marginBottom: 14,
    },
    absenButton: {
        marginTop: 15,
        backgroundColor: "#4F46E5",
        borderRadius: 18,
        paddingVertical: 25,
        justifyContent: "center",
        alignItems: "center",
    },

    cameraCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    absenTitle: {
        color: "#FFF",
        fontSize: 18,
        fontFamily: "Poppins_700Bold",
    },

    absenSubtitle: {
        color: "#FFF",
        marginTop: 5,
    },

    infoText: {
        marginTop: 10,
        fontSize: 12,
        color: "#666",
    },

    historyHeader: {
        flexDirection: "column",
    },

    rightMenu: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    search: {
        backgroundColor: "#F3F4F6",
        width: 90,
        height: 35,
        borderRadius: 10,
        paddingHorizontal: 10,
    },

    monthBtn: {
        height: 46,

        minWidth: 120,

        paddingHorizontal: 14,

        backgroundColor: "#EEF2FF",

        borderWidth: 1,
        borderColor: "#C7D2FE",

        borderRadius: 14,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    emptyContainer: {
        alignItems: "center",
        paddingVertical: 40,
    },

    emptyTitle: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },
    emptyText: {
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",

        flex: 1,

        height: 46,

        backgroundColor: "#F8FAFC",

        borderRadius: 14,

        borderWidth: 1,
        borderColor: "#E5E7EB",

        paddingHorizontal: 14,

        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,

        height: 46,
        paddingVertical: 0,

        fontSize: 14,
        color: "#111827",

        fontFamily: "Poppins_400Regular",

        includeFontPadding: false,
    },

    monthText: {
        color: "#3046E6",

        fontSize: 14,

        fontFamily: "Poppins_600SemiBold",
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
        borderBottomColor: "#E5E7EB",
    },

});