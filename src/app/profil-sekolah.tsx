import React, {
    useState,
    useEffect,
} from "react";
import { Switch } from "react-native";
import { supabase } from "../lib/supabase";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AdminHeader from "../components/AdminHeader";

export default function ProfilSekolahScreen() {
    const [latitude, setLatitude] =
        useState("-6.2088");

    const [longitude, setLongitude] =
        useState("106.8456");

    const [radius, setRadius] =
        useState("100");

    const [jamMasuk, setJamMasuk] =
        useState("07:00");

    const [batasTerlambat, setBatasTerlambat] =
        useState("07:15");



    const [absensiAktif, setAbsensiAktif] =
        useState(true);





    useFocusEffect(
        React.useCallback(() => {
            getProfilSekolah();
        }, [])
    );

    async function getProfilSekolah() {
        const { data, error } =
            await supabase
                .from("profil_sekolah")
                .select("*")
                .eq("id", 1)
                .single();

        if (error) {
            console.log(error);
            return;
        }

        setLatitude(data.latitude?.toString() || "");
        setLongitude(data.longitude?.toString() || "");
        setRadius(data.radius?.toString() || "");

        setJamMasuk(data.jam_masuk || "");
        setBatasTerlambat(data.batas_terlambat || "");


        setAbsensiAktif(data.absensi_aktif);
    }

    async function simpanProfil() {
        const { error } =
            await supabase
                .from("profil_sekolah")
                .update({
                    latitude,
                    longitude,
                    radius: Number(radius),

                    jam_masuk: jamMasuk,
                    batas_terlambat: batasTerlambat,


                    absensi_aktif: absensiAktif,

                    updated_at: new Date(),
                })
                .eq("id", 1);

        if (error) {
            console.log("ERROR SIMPAN =", error);

            alert(
                error.message ||
                JSON.stringify(error)
            );

            return;
        }

        alert("Pengaturan berhasil disimpan");
    }






    return (
        <SafeAreaView style={styles.container}>
            <AdminHeader title="Pengaturan Sekolah" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {/* TITIK KOORDINAT */}
                <Text
                    style={{
                        marginTop: 8,
                        color: "#666",
                        fontSize: 12,
                    }}
                >
                    Koordinat mengikuti lokasi yang dipilih pada peta
                </Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.label}>
                                Garis Lintang
                            </Text>

                            <TextInput
                                value={latitude}
                                editable={false}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.label}>
                                Garis Bujur
                            </Text>

                            <TextInput
                                value={longitude}
                                editable={false}
                                style={styles.input}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>
                        Radius Kehadiran (Meter)
                    </Text>

                    <View style={styles.radiusWrap}>
                        <TextInput
                            value={radius}
                            onChangeText={setRadius}
                            keyboardType="numeric"
                            style={styles.radiusInput}
                        />

                        <Text style={styles.meter}>
                            m
                        </Text>
                    </View>
                </View>


                {/* MAP */}
                <View style={styles.imageCard}>
                    <TouchableOpacity
                        style={styles.gpsContainer}
                        onPress={() =>
                            router.push("/pilih-lokasi")
                        }
                    >
                        <Ionicons
                            name="location"
                            size={70}
                            color="#3046E6"
                        />

                        <Text style={styles.gpsTitle}>
                            Pilih Lokasi Sekolah
                        </Text>

                        <Text style={styles.gpsDesc}>
                            Tekan untuk menentukan lokasi sekolah
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.radiusBadge}>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#111"
                        />

                        <Text style={styles.radiusText}>
                            Radius Aktif {radius}m
                        </Text>
                    </View>
                </View>
                {/* JADWAL */}
                <Text style={styles.sectionTitle}>
                    Jadwal Kehadiran
                </Text>

                <View style={styles.timeCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.timeLabel}>
                            Waktu Masuk
                        </Text>

                        <TextInput
                            value={jamMasuk}
                            onChangeText={setJamMasuk}
                            style={styles.timeInput}
                        />
                    </View>

                    <Ionicons
                        name="time-outline"
                        size={24}
                        color="#3046E6"
                    />
                </View>
                <View style={styles.timeCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.timeLabel}>
                            Batas Terlambat
                        </Text>

                        <TextInput
                            value={batasTerlambat}
                            onChangeText={setBatasTerlambat}
                            style={styles.timeInput}
                            placeholder="07:15"
                        />
                    </View>

                    <Ionicons
                        name="alarm-outline"
                        size={24}
                        color="#EF4444"
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    Pengaturan Absensi
                </Text>

                <View style={styles.card}>
                    <View style={styles.switchRow}>
                        <View>
                            <Text style={styles.switchTitle}>
                                Aktifkan Absensi
                            </Text>

                            <Text style={styles.switchDesc}>
                                Nonaktifkan saat hari libur
                            </Text>
                        </View>

                        <Switch
                            value={absensiAktif}
                            onValueChange={setAbsensiAktif}
                            trackColor={{
                                false: "#D1D5DB",
                                true: "#3046E6",
                            }}
                        />
                    </View>
                </View>

                {/* BUTTON */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={simpanProfil}
                >
                    <Ionicons
                        name="save-outline"
                        size={22}
                        color="#FFF"
                    />

                    <Text style={styles.saveText}>
                        Simpan Perubahan
                    </Text>
                </TouchableOpacity>

                <Text style={styles.updateText}>
                    Terakhir diperbarui:
                    {" "}24 Okt 2023, 14:20
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

    sectionTitle: {
        fontSize: 24,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
        fontFamily: "Poppins_700Bold",
    },

    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 16,
        elevation: 2,
    },

    row: {
        flexDirection: "row",
        gap: 10,
    },

    inputWrap: {
        flex: 1,
    },

    label: {
        marginBottom: 6,
        color: "#666",
    },

    input: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#F2F2FC",
        paddingHorizontal: 14,
    },

    radiusWrap: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#F2F2FC",
        marginTop: 8,
        paddingHorizontal: 14,

        flexDirection: "row",
        alignItems: "center",
    },

    radiusInput: {
        flex: 1,
    },

    meter: {
        color: "#666",
    },

    imageCard: {
        margin: 20,
        borderRadius: 20,
        overflow: "hidden",
        elevation: 5,
        zIndex: 999,
    },

    mapImage: {
        width: "100%",
        height: 220,
    },

    radiusBadge: {
        position: "absolute",
        bottom: 15,
        left: 15,

        backgroundColor: "#FFF",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,

        flexDirection: "row",
        alignItems: "center",
    },

    radiusText: {
        marginLeft: 5,
        fontFamily: "Poppins_500Medium",
    },

    timeCard: {
        backgroundColor: "#F2F2FC",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    timeLabel: {
        color: "#666",
    },

    timeValue: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
    },

    saveButton: {
        height: 58,
        backgroundColor: "#3046E6",
        marginHorizontal: 20,
        marginTop: 25,
        borderRadius: 16,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    saveText: {
        color: "#FFF",
        marginLeft: 8,
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },

    updateText: {
        textAlign: "center",
        color: "#999",
        marginTop: 20,
    },
    gpsContainer: {
        height: 220,

        backgroundColor: "#FFF",

        marginHorizontal: 20,
        marginVertical: 20,

        borderRadius: 20,

        justifyContent: "center",
        alignItems: "center",

        elevation: 3,
    },

    gpsTitle: {
        marginTop: 12,

        fontSize: 18,

        color: "#3046E6",

        fontFamily: "Poppins_700Bold",
    },

    gpsDesc: {
        marginTop: 6,

        color: "#666",

        textAlign: "center",

        paddingHorizontal: 40,
    },
    timeInput: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        color: "#111",
        marginTop: 5,
    },

    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    switchTitle: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },

    switchDesc: {
        color: "#666",
        marginTop: 4,
    },


});