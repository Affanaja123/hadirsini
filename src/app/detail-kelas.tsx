import { Alert } from "react-native";

import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";
import React, {
    useState,
    useEffect,
} from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

export default function DetailKelasScreen() {


    const [detailKelas, setDetailKelas] =
        useState<any>(null);
    const {
        id,
        kelas,
        jurusan,
    } = useLocalSearchParams();

    async function hapusKelas() {
        const { error } = await supabase
            .from("kelas")
            .delete()
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Gagal menghapus kelas");
            return;
        }

        alert("Kelas berhasil dihapus");

        router.replace("/(admin)/laporan");
    }

    function konfirmasiHapus() {
        Alert.alert(
            "Hapus Kelas",
            "Yakin ingin menghapus kelas ini?",
            [
                {
                    text: "Batal",
                    style: "cancel",
                },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: hapusKelas,
                },
            ]
        );
    }



    const [date, setDate] = useState(new Date());

    const [showPicker, setShowPicker] =
        useState(false);

    const formattedDate =
        date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const [siswa, setSiswa] =
        useState<any[]>([]);

    const getColor = (status: string) => {
        switch (status) {
            case "Hadir":
                return "#22C55E";

            case "Izin":
                return "#3B82F6";

            case "Terlambat":
                return "#F59E0B";

            default:
                return "#EF4444";
        }
    };

    useEffect(() => {
        getSiswa();
        getDetailKelas();
    }, [date]);

    async function getSiswa() {
        const tanggal =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

        const { data, error } =
            await supabase
                .from("siswa")
                .select(`
        *,
        kehadiran (
          status,
          tanggal
        ),
        izin (
          status,
          tanggal
        )
      `)
                .eq("kelas_id", id);

        if (error) {
            console.log(error);
            return;
        }

        const hasil =
            (data || []).map((siswa) => {
                let status = "Alfa";

                const hadirHariIni =
                    siswa.kehadiran?.find(
                        (k: any) =>
                            k.tanggal === tanggal
                    );

                const izinHariIni =
                    siswa.izin?.find(
                        (i: any) =>
                            i.tanggal === tanggal &&
                            i.status === "Disetujui"
                    );

                if (izinHariIni) {
                    status = "Izin";
                } else if (hadirHariIni) {
                    status = hadirHariIni.status;
                }

                return {
                    ...siswa,
                    statusHariIni: status,
                };
            });

        setSiswa(hasil);
    }

    async function getDetailKelas() {
        const { data, error } =
            await supabase
                .from("kelas")
                .select("*")
                .eq("id", id)
                .single();

        if (error) {
            console.log(error);
            return;
        }

        setDetailKelas(data);
    }

    useEffect(() => {
        getSiswa();
    }, [date]);



    async function exportExcel() {
        try {
            const tahun = date.getFullYear();
            const bulan = date.getMonth() + 1;

            const awalBulan =
                `${tahun}-${String(bulan).padStart(2, "0")}-01`;

            const akhirBulan = new Date(
                tahun,
                bulan,
                0
            )
                .toISOString()
                .split("T")[0];

            // ambil semua siswa kelas ini
            const { data: siswaKelas, error: siswaError } =
                await supabase
                    .from("siswa")
                    .select("*")
                    .eq("kelas_id", id);

            if (siswaError) {
                console.log(siswaError);
                alert("Gagal mengambil siswa");
                return;
            }

            const siswaIds =
                siswaKelas.map((s) => s.id);

            // ambil absensi bulan ini
            const {
                data: kehadiran,
                error: hadirError,
            } = await supabase
                .from("kehadiran")
                .select("*")
                .in("siswa_id", siswaIds)
                .gte("tanggal", awalBulan)
                .lte("tanggal", akhirBulan);

            if (hadirError) {
                console.log(hadirError);
                alert("Gagal mengambil absensi");
                return;
            }

            const jumlahHari = new Date(
                tahun,
                bulan,
                0
            ).getDate();

            // Header
            const header = ["Nama"];

            for (
                let hari = 1;
                hari <= jumlahHari;
                hari++
            ) {
                header.push(hari.toString());
            }

            const rows = siswaKelas.map(
                (siswa) => {
                    const row: any[] = [
                        siswa.nama,
                    ];

                    for (
                        let hari = 1;
                        hari <= jumlahHari;
                        hari++
                    ) {
                        const tanggalCari =
                            `${tahun}-${String(bulan).padStart(2, "0")}-${String(hari).padStart(2, "0")}`;

                        const absen =
                            kehadiran.find(
                                (k) =>
                                    k.siswa_id === siswa.id &&
                                    k.tanggal === tanggalCari
                            );

                        row.push(
                            absen?.status || "Alfa"
                        );
                    }

                    return row;
                }
            );

            const worksheet =
                XLSX.utils.aoa_to_sheet([
                    header,
                    ...rows,
                ]);

            const workbook =
                XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Kehadiran Bulanan"
            );

            const excelBinary =
                XLSX.write(workbook, {
                    type: "base64",
                    bookType: "xlsx",
                });

            const fileUri =
                FileSystem.cacheDirectory +
                `Kehadiran-${kelas}-${bulan}.xlsx`;

            await FileSystem.writeAsStringAsync(
                fileUri,
                excelBinary,
                {
                    encoding:
                        FileSystem.EncodingType.Base64,
                }
            );

            await Sharing.shareAsync(fileUri);
        } catch (err) {
            console.log(
                "EXPORT ERROR:",
                err
            );

            alert("Gagal export Excel");
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#3046E6"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Detail Kelas
                </Text>
            </View>

            {/* ACTION */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                        router.push({
                            pathname: "/edit-kelas",
                            params: {
                                id,
                            },
                        })
                    }
                >
                    <Ionicons
                        name="create-outline"
                        size={20}
                        color="#FFF"
                    />

                    <Text style={styles.actionText}>
                        Edit
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={konfirmasiHapus}
                ><Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FFF"
                    />

                    <Text style={styles.actionText}>
                        Hapus
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.card}>
                    <Text style={styles.kelas}>
                        Kelas {kelas}
                    </Text>

                    <Text style={styles.jurusan}>
                        Jurusan {jurusan}
                    </Text>

                    <View
                        style={{
                            alignSelf: "flex-start",
                            backgroundColor: "#EEF2FF",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20,
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: "#3046E6",
                                fontFamily: "Poppins_600SemiBold",
                            }}
                        >
                            {siswa.length} Siswa
                        </Text>
                    </View>

                    <View
                        style={styles.divider}
                    />

                    <Text style={styles.label}>
                        Wali Kelas
                    </Text>

                    <Text style={styles.wali}>
                        {detailKelas?.wali_kelas}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.dateCard}
                    onPress={() => setShowPicker(true)}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#3046E6"
                    />

                    <Text style={styles.dateText}>
                        {formattedDate}
                    </Text>
                </TouchableOpacity>

                {/* EXPORT */}
                <View style={styles.exportRow}>


                    <TouchableOpacity
                        style={styles.exportBtn}
                        onPress={exportExcel}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={24}
                            color="#22C55E"
                        />

                        <Text style={styles.exportText}>
                            Export Excel
                        </Text>
                    </TouchableOpacity>
                </View>




                <Text style={styles.section}>
                    Kehadiran Siswa
                </Text>

                {siswa.map(
                    (item, index) => (
                        <View
                            key={index}
                            style={styles.studentCard}
                        >
                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri:
                                                item.foto_url ||
                                                "https://i.pravatar.cc/150",
                                        }}
                                        style={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: 22.5,
                                            marginRight: 12,
                                        }}
                                    />

                                    <View>
                                        <Text style={styles.nama}>
                                            {item.nama}
                                        </Text>

                                        <Text
                                            style={{
                                                color: "#666",
                                                fontSize: 12,
                                            }}
                                        >
                                            NISN: {item.nisn}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.badge,
                                    {
                                        backgroundColor:
                                            getColor(item.statusHariIni),
                                    },
                                ]}
                            >
                                <Text
                                    style={
                                        styles.badgeText
                                    }
                                >
                                    {item.statusHariIni}
                                </Text>
                            </View>
                        </View>
                    )
                )}
            </ScrollView>

          {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(
                        event,
                        selectedDate
                    ) => {
                        setShowPicker(false);

                        if (selectedDate) {
                            setDate(selectedDate);
                        }
                    }}
                />
            )}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F3F8",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },

    headerTitle: {
        fontSize: 22,
        marginLeft: 12,
        fontFamily: "Poppins_700Bold",
    },

    card: {
        backgroundColor: "#FFF",
        margin: 20,
        borderRadius: 18,
        padding: 20,
    },

    kelas: {
        fontSize: 24,
        fontFamily: "Poppins_700Bold",
    },

    jurusan: {
        color: "#666",
        marginTop: 4,
    },

    divider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 15,
    },

    label: {
        color: "#666",
    },

    wali: {
        fontSize: 18,
        marginTop: 5,
        fontFamily: "Poppins_600SemiBold",
    },

    dateCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,

        flexDirection: "row",
        alignItems: "center",
    },

    dateText: {
        marginLeft: 10,
        fontFamily: "Poppins_500Medium",
    },

    section: {
        margin: 20,
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
    },

    studentCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    nama: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
    },

    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    badgeText: {
        color: "#FFF",
        fontFamily: "Poppins_600SemiBold",
    },
    exportRow: {
        marginHorizontal: 20,
        marginTop: 15,
    },

    exportBtn: {
        width: "100%",
        height: 60,

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

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",

        marginHorizontal: 20,
        marginTop: 15,
    },

    editBtn: {
        flex: 1,
        height: 50,

        backgroundColor: "#3046E6",

        borderRadius: 14,

        marginRight: 8,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    deleteBtn: {
        flex: 1,
        height: 50,

        backgroundColor: "#EF4444",

        borderRadius: 14,

        marginLeft: 8,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    actionText: {
        color: "#FFF",
        marginLeft: 6,
        fontFamily: "Poppins_600SemiBold",
    },

    jumlahSiswa: {
        marginTop: 10,
        fontSize: 14,
        color: "#3046E6",
        fontFamily: "Poppins_600SemiBold",
    },

});