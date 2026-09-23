import { supabase } from "../../lib/supabase";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import HeaderWave from "../../components/HeaderWave";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function HistoriScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);


  const [activeFilter, setActiveFilter] =
    useState("Semua");

  const [data, setData] = useState<any[]>([]);

  async function loadHistori() {
    const userString =
      await AsyncStorage.getItem("user");

    if (!userString) return;

    const user =
      JSON.parse(userString);

    const { data: izinData, error } =
      await supabase
        .from("izin")
        .select("*")
        .eq("siswa_id", user.id);

    if (error) {
      console.log(error);
      return;
    }

    const grouped: any = {};

    izinData?.forEach((item) => {
      const date = new Date(item.tanggal);

      const bulan =
        date.toLocaleDateString(
          "id-ID",
          {
            month: "long",
            year: "numeric",
          }
        );

      if (!grouped[bulan]) {
        grouped[bulan] = {
          bulan,
          total: 0,
          disetujui: 0,
          diproses: 0,
          ditolak: 0,
        };
      }

      grouped[bulan].total++;

      if (item.status === "Disetujui") {
        grouped[bulan].disetujui++;
      }

      if (item.status === "Menunggu") {
        grouped[bulan].diproses++;
      }

      if (item.status === "Ditolak") {
        grouped[bulan].ditolak++;
      }
    });

    setData(Object.values(grouped));
  }

  useEffect(() => {
    loadHistori();
  }, []);

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

        <HeaderWave />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Histori Izin
          </Text>


          <View style={styles.yearRow}>
            <Ionicons
              name="calendar"
              size={22}
              color="#2563EB"
            />

            <Text style={styles.yearText}>
              Tahun 2026
            </Text>
          </View>

          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/history-detail",
                  params: {
                    month: item.bulan,
                  },
                })
              }
            >
              <Ionicons
                name="calendar"
                size={42}
                color="#2563EB"
              />

              <View style={styles.cardContent}>
                <Text style={styles.month}>
                  {item.bulan}
                </Text>

                <Text style={styles.total}>
                  Total Izin{" "}
                  <Text
                    style={styles.badgeBlue}
                  >
                    {item.total}
                  </Text>
                </Text>

                <View style={styles.statsRow}>
                  <Text
                    style={styles.greenText}
                  >
                    ● Disetujui{" "}
                    {item.disetujui}
                  </Text>

                  <Text
                    style={styles.yellowText}
                  >
                    ● Diproses{" "}
                    {item.diproses}
                  </Text>

                  <Text
                    style={styles.redText}
                  >
                    ● Ditolak{" "}
                    {item.ditolak}
                  </Text>
                </View>
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
    backgroundColor: "#ECECEC",
  },

  header: {
    height: 190,
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
    fontFamily: "Poppins_400Regular",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    marginBottom: 18,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },

  filterBtn: {
    minWidth: 86,
    height: 38,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 19,
  },

  activeBlue: {
    backgroundColor: "#2563EB",
  },

  yellow: {
    backgroundColor: "#E6D9A6",
  },

  green: {
    backgroundColor: "#BED5C1",
  },

  red: {
    backgroundColor: "#E6C8BC",
  },

  activeText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  filterText: {
    color: "#1F2937",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  yearText: {
    marginLeft: 8,
    color: "#2563EB",
    fontFamily: "Poppins_600SemiBold",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 0,
    padding: 16,
    marginBottom: 18,
    flexDirection: "row",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 6,
  },

  cardContent: {
    marginLeft: 14,
    flex: 1,
  },

  month: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },

  total: {
    marginTop: 2,
    fontFamily: "Poppins_500Medium",
  },

  badgeBlue: {
    color: "#2563EB",
    fontFamily: "Poppins_700Bold",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  greenText: {
    color: "green",
    fontSize: 12,
  },

  yellowText: {
    color: "#EAB308",
    fontSize: 12,
  },

  redText: {
    color: "red",
    fontSize: 12,
  },


});