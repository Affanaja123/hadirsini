import React, {
    useState,
    useEffect,
} from "react";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import AdminHeader from "../../components/AdminHeader";

export default function LaporanScreen() {
    const [activeTab, setActiveTab] =
        useState("Harian");

    const [kelasData, setKelasData] =
        useState<any[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            getKelas();
        }, [])
    );

    // import React, {
    //     useState,
    //     useEffect,
    // } from "react";

    async function getKelas() {
    const { data, error } =
        await supabase
            .from("kelas")
            .select(`
                *,
                siswa (
                    id
                )
            `);

    if (error) {
        console.log(error);
        return;
    }

    setKelasData(data || []);
}
    return (
        <SafeAreaView style={styles.container}>
            <AdminHeader title="Laporan Kehadiran" />

            <ScrollView
                showsVerticalScrollIndicator={false}
            >


                {/* RINGKASAN */}
                <Text style={styles.sectionTitle}>
                    Ringkasan per Kelas
                </Text>

                {kelasData.map(
                    (item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.classCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/detail-kelas",
                                    params: {
                                        id: item.id,
                                        kelas: item.kelas,
                                        jurusan: item.jurusan,
                                    },
                                })
                            }
                        >
                            <View
                                style={styles.numberBox}
                            >
                                <Text
                                    style={
                                        styles.numberText
                                    }
                                >
                                    {item.kelas}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    marginLeft: 15,
                                }}
                            >
                                <Text style={styles.className}>
                                    Kelas {item.kelas}
                                </Text>

                                <Text style={styles.classInfo}>
                                    Jurusan {item.jurusan}
                                </Text>

                                <Text
                                    style={{
                                        color: "#666",
                                        marginTop: 2,
                                    }}
                                >
                                    Wali: {item.wali_kelas}
                                </Text>

                                <Text style={styles.total}>
                                    {item.siswa?.length || 0} Siswa
                                </Text>
                            </View>



                            <Ionicons
                                name="chevron-forward"
                                size={22}
                                color="#777"
                            />
                        </TouchableOpacity>
                    )
                )}

                <View
                    style={{ height: 120 }}
                />
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() =>
                    router.push("/tambah-kelas")
                }
            >
                <Ionicons
                    name="add"
                    size={35}
                    color="#FFF"
                />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F3F8",
    },

    tabContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 4,
        elevation: 4,
    },

    tabButton: {
        flex: 1,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },

    activeTab: {
        backgroundColor: "#4C5DF4",
    },

    tabText: {
        fontFamily: "Poppins_500Medium",
        color: "#555",
    },

    activeTabText: {
        color: "#FFF",
    },

    chartCard: {
        backgroundColor: "#FFF",
        margin: 20,
        borderRadius: 20,
        padding: 16,
        elevation: 3,
    },

    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    chartTitle: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
    },

    chartSub: {
        color: "#777",
        fontFamily: "Poppins_400Regular",
    },

    legend: {
        flexDirection: "row",
        alignItems: "center",
    },

    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#3046E6",
        marginRight: 5,
    },

    legendText: {
        fontSize: 12,
        color: "#666",
    },

    fakeChart: {
        height: 220,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginTop: 20,
    },

    bar: {
        width: 28,
        borderRadius: 10,
        backgroundColor: "#3046E6",
    },

    daysRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
    },

    day: {
        color: "#888",
        fontFamily: "Poppins_500Medium",
    },

    exportRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
    },

    exportBtn: {
        width: "48%",
        height: 70,
        backgroundColor: "#FFF",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },

    exportText: {
        marginLeft: 8,
        fontFamily: "Poppins_600SemiBold",
    },

    sectionTitle: {
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 14,
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
    },

    classCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginBottom: 14,
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },

    numberBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#DADCFD",
        justifyContent: "center",
        alignItems: "center",
    },

    numberText: {
        fontSize: 24,
        color: "#1E2F9E",
        fontFamily: "Poppins_700Bold",
    },

    className: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
    },

    classInfo: {
        color: "#777",
        marginTop: 2,
    },
    studentCount: {
        marginTop: 4,
        color: "#3046E6",
        fontFamily: "Poppins_600SemiBold",
    },

    badge: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginRight: 10,
    },

    badgeText: {
        fontSize: 12,
        fontFamily: "Poppins_600SemiBold",
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 25,

        width: 65,
        height: 65,
        borderRadius: 32.5,

        backgroundColor: "#3046E6",

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        elevation: 8,
    },
    total: {
    marginTop: 4,
    color: "#3046E6",
    fontFamily: "Poppins_600SemiBold",
},
});