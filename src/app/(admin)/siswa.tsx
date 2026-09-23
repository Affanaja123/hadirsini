import {
    useState,
    useEffect,
} from "react";

import { supabase } from "../../lib/supabase";
import HeaderWave from "../../components/HeaderWave";
import AdminHeader from "../../components/AdminHeader";
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
    Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function SiswaScreen() {
    const [showDropdown, setShowDropdown] =
        useState(false);

    const [selectedKelas, setSelectedKelas] =
        useState("Semua Kelas");



    type Kelas = {
        id: number;
        kelas: string;
        jurusan: string;
    };

    const [kelasList, setKelasList] =
        useState<Kelas[]>([]);

    async function getKelas() {
        const { data, error } =
            await supabase
                .from("kelas")
                .select("*");

        if (error) {
            console.log(error);
            return;
        }

        setKelasList(data || []);
    }
    const [search, setSearch] = useState("");

    const [siswa, setSiswa] =
        useState<any[]>([]);

    useEffect(() => {
        getSiswa();
        getKelas();
    }, []);

    async function getSiswa() {
        const { data, error } =
            await supabase
                .from("siswa")
                .select(`
                *,
                kelas (
                    id,
                    kelas,
                    jurusan
                )
            `);

        if (error) {
            console.log(error);
            return;
        }

        setSiswa(data || []);
    }



    async function hapusSiswa(id: number, fotoUrl: string) {
        Alert.alert(
            "Hapus Siswa",
            "Yakin ingin menghapus siswa ini?",
            [
                {
                    text: "Batal",
                    style: "cancel",
                },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {

                        // Hapus foto dari Storage
                        if (fotoUrl) {
                            const fileName =
                                fotoUrl.split("/").pop();

                            if (fileName) {
                                await supabase.storage
                                    .from("siswa")
                                    .remove([fileName]);
                            }
                        }

                        // Hapus data siswa
                        const { error } =
                            await supabase
                                .from("siswa")
                                .delete()
                                .eq("id", id);

                        if (error) {
                            console.log(error);
                            alert("Gagal menghapus siswa");
                            return;
                        }

                        alert("Siswa berhasil dihapus");

                        getSiswa();
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <AdminHeader title="Manajemen Siswa" />

            {/* SEARCH */}
            <View style={styles.searchCard}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    color="#888"
                />

                <TextInput
                    placeholder="Cari nama atau NISN..."
                    placeholderTextColor="#888"
                    style={[
                        styles.searchInput,
                        {
                            outlineWidth: 0,
                        },
                    ]}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* FILTER */}

            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={styles.classBtn}
                    onPress={() =>
                        setShowDropdown(!showDropdown)
                    }
                >
                    <Text style={styles.classText}>
                        {selectedKelas}
                    </Text>

                    <Ionicons
                        name={
                            showDropdown
                                ? "chevron-up"
                                : "chevron-down"
                        }
                        size={18}
                        color="#666"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.filterBtn}
                >
                    <Ionicons
                        name="options-outline"
                        size={20}
                        color="#3046E6"
                    />
                </TouchableOpacity>
            </View>
            {showDropdown && (
                <View style={styles.dropdown}>
                    <ScrollView nestedScrollEnabled>
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSelectedKelas("Semua Kelas");
                                setShowDropdown(false);
                            }}
                        >
                            <Text>Semua Kelas</Text>
                        </TouchableOpacity>

                        {kelasList.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedKelas(
                                        `Kelas ${item.kelas} ${item.jurusan}`
                                    );
                                    setShowDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>
                                    Kelas {item.kelas} {item.jurusan}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* DATA SISWA */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >
                {siswa
                    .filter((item) => {
                        const cocokSearch =
                            item.nama
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            (item.nisn || "").includes(search);

                        const cocokKelas =
                            selectedKelas === "Semua Kelas" ||
                            selectedKelas ===
                            `Kelas ${item.kelas?.kelas} ${item.kelas?.jurusan}`;

                        return cocokSearch && cocokKelas;
                    })
                    .map((item) => (
                        <View
                            key={item.id}
                            style={styles.card}
                        >
                            <Image
                                source={{
                                    uri:
                                        item.foto_url ||
                                        "https://i.pravatar.cc/150",
                                }}
                                style={styles.avatar}
                            />

                            <View style={styles.info}>
                                <Text style={styles.nama}>
                                    {item.nama}
                                </Text>

                                <Text style={styles.nisn}>
                                    NISN: {item.nisn}
                                </Text>

                                <Text style={styles.kelas}>
                                    Kelas {item.kelas?.kelas} {item.kelas?.jurusan}
                                </Text>
                            </View>

                            <View
                                style={styles.actionWrap}
                            >
                                <View
                                    style={styles.badge}
                                >
                                    <Text
                                        style={styles.badgeText}
                                    >
                                        AKTIF
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({
                                            pathname: "/edit-siswa",
                                            params: {
                                                id: item.id,
                                            },
                                        })
                                    }
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={22}
                                        color="#777"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        hapusSiswa(
                                            item.id,
                                            item.foto_url
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={22}
                                        color="#EF4444"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                {/* <View
                        style={{ height: 100 }}
                    /> */}
            </ScrollView>

            {/* FLOATING BUTTON */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/tambah-siswa")}
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
        backgroundColor: "#F3F4F6",
    },

    header: {
        height: 190,
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },

    logoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },

    logoWrap: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
    },

    logoText: {
        color: "#FFF",
        fontSize: 20,
        marginLeft: 12,
        fontFamily: "Poppins_700Bold",
    },

    bell: {
        marginLeft: "auto",
    },

    headerTitle: {
        color: "#FFF",
        fontSize: 24,
        marginTop: 28,
        fontFamily: "Poppins_600SemiBold",
    },

    searchCard: {
        backgroundColor: "#FFF",

        marginHorizontal: 20,
        marginTop: -25,

        borderRadius: 16,
        height: 52,

        paddingHorizontal: 15,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#F1F1F1",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 3,
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,

        fontSize: 14,
        color: "#111",

        fontFamily: "Poppins_400Regular",

        borderWidth: 0,
    },

    filterRow: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 14,
        alignItems: "center",
    },

    classBtn: {
        flex: 1,
        height: 48,
        backgroundColor: "#FFF",
        borderRadius: 14,
        paddingHorizontal: 16,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        elevation: 2,
    },

    classText: {
        fontFamily: "Poppins_500Medium",
    },

    filterBtn: {
        width: 48,
        height: 48,
        marginLeft: 10,
        borderRadius: 14,
        backgroundColor: "#FFF",

        justifyContent: "center",
        alignItems: "center",

        elevation: 2,
    },

    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 20,
        padding: 16,

        flexDirection: "row",
        alignItems: "center",

        elevation: 3,
    },

    avatar: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
    },

    info: {
        flex: 1,
        marginLeft: 15,
    },

    nama: {
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
    },

    nisn: {
        color: "#777",
        fontFamily: "Poppins_400Regular",
    },

    kelas: {
        color: "#3046E6",
        fontFamily: "Poppins_500Medium",
    },

    actionWrap: {
        alignItems: "center",
        gap: 10,
    },

    badge: {
        backgroundColor: "#DCFCE7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    badgeText: {
        color: "#16A34A",
        fontSize: 11,
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

        elevation: 8,
    },
    dropdown: {
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginTop: 8,
        borderRadius: 14,

        maxHeight: 220,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,

        elevation: 4,
    },

    dropdownItem: {
        backgroundColor: "#FFF",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F1F1",
    },

    dropdownText: {
        fontFamily: "Poppins_400Regular",
    },
});