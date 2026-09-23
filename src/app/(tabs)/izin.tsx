import React, {
  useState,
  useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../../lib/supabase";
import { decode } from "base64-arraybuffer";

import { router } from "expo-router";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import HeaderWave from "../../components/HeaderWave";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function IzinScreen() {
  const [izinTerakhir, setIzinTerakhir] =
    useState<any>(null);
  const [jenisIzin, setJenisIzin] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const tanggal = new Date()
    .toISOString()
    .split("T")[0];

  async function kirimIzin() {
    try {
      if (!jenisIzin || !keterangan) {
        alert("Lengkapi data izin");
        return;
      }

      const userString =
        await AsyncStorage.getItem("user");

      if (!userString) {
        alert("User tidak ditemukan");
        return;
      }

      const user =
        JSON.parse(userString);

      const { data: sudahAbsen } =
        await supabase
          .from("kehadiran")
          .select("id")
          .eq("siswa_id", user.id)
          .eq("tanggal", tanggal)
          .maybeSingle();

      if (sudahAbsen) {
        alert(
          "Anda sudah melakukan absen hari ini, sehingga tidak dapat mengajukan izin."
        );
        return;
      }

      let lampiranUrl = null;



      if (lampiran) {
        const fileName =
          `izin-${Date.now()}.jpg`;

        const base64 =
          await FileSystem.readAsStringAsync(
            lampiran,
            {
              encoding:
                FileSystem.EncodingType.Base64,
            }
          );

        const { error: uploadError } =
          await supabase.storage
            .from("izin")
            .upload(
              fileName,
              decode(base64),
              {
                contentType:
                  "image/jpeg",
              }
            );



        if (uploadError) {
          console.log(uploadError);
          alert(
            JSON.stringify(uploadError)
          );
          return;
        }

        lampiranUrl =
          supabase.storage
            .from("izin")
            .getPublicUrl(fileName)
            .data.publicUrl;
      }



      const { error } =
        await supabase
          .from("izin")
          .insert({
            siswa_id: user.id,
            tanggal,
            jenis: jenisIzin,
            alasan: keterangan,
            status: "Menunggu",
            lampiran_url: lampiranUrl,

          });



      if (error) {
        console.log(error);
        alert("Gagal mengirim izin");
        return;
      }

      alert("Izin berhasil dikirim");

      setJenisIzin("");
      setKeterangan("");
      setLampiran(null);

      loadIzinTerakhir();

} catch (err) {
  console.log(err);
  alert("Terjadi kesalahan");
}
}

async function loadIzinTerakhir() {
  const userString =
    await AsyncStorage.getItem("user");

  if (!userString) return;

  const user =
    JSON.parse(userString);

  const { data } =
    await supabase
      .from("izin")
      .select("*")
      .eq("siswa_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  setIzinTerakhir(data);
}

useEffect(() => {
  loadIzinTerakhir();
}, []);



const [lampiran, setLampiran] =
  useState<string | null>(null);

async function pilihLampiran() {
  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

  if (!result.canceled) {
    setLampiran(
      result.assets[0].uri
    );
  }
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
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
      {/* FORM */}
      <View style={[styles.card, styles.formCard]}>
        <Text style={styles.title}>
          Pengajuan Izin
        </Text>

        <Text style={styles.subtitle}>
          Ajukan izin ketidakhadiran Anda
        </Text>

        {/* JENIS IZIN */}
        <Text style={styles.label}>
          Jenis Izin
        </Text>

        <TextInput
          placeholder="Masukkan jenis izin"
          placeholderTextColor="#999"
          value={jenisIzin}
          onChangeText={setJenisIzin}
          style={styles.inputText}
        />

        {/* TANGGAL */}
        <Text style={styles.label}>
          Tanggal
        </Text>

        <View style={styles.input}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#111"
          />

          <Text style={styles.dateText}>
            {new Date().toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </Text>
        </View>

        {/* KETERANGAN */}
        <Text style={styles.label}>
          Keterangan
        </Text>

        <TextInput
          multiline
          placeholder="Jelaskan alasan izin anda..."
          style={styles.textArea}
          value={keterangan}
          onChangeText={setKeterangan}
        />

        {/* LAMPIRAN */}
        <Text style={styles.label}>
          Lampiran{" "}
          <Text
            style={{
              fontWeight: "400",
              color: "#666",
            }}
          >
            (Opsional)
          </Text>
        </Text>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pilihLampiran}
        >
          <Ionicons
  name="images-outline"
  size={40}
  color="#4D6BF3"
/>



          {lampiran && (
            <Image
              source={{ uri: lampiran }}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 12,
                marginTop: 10,
              }}
            />
          )}

          <Text style={styles.uploadTitle}>
            Upload Bukti 
          </Text>

          <Text style={styles.uploadSub}>
  Pilih gambar JPG atau PNG
</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Lampiran akan membantu mempercepat
          proses persetujuan izin.
        </Text>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={kirimIzin}
        >
          <Text style={styles.submitText}>
            Kirim Izin
          </Text>
        </TouchableOpacity>
      </View>

      {/* STATUS */}
      <View style={styles.card}>
        <Text style={styles.statusTitle}>
          Status Pengajuan Terakhir
        </Text>

        <View style={styles.statusBox}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  izinTerakhir?.status === "Disetujui"
                    ? "#22C55E"
                    : izinTerakhir?.status === "Ditolak"
                      ? "#EF4444"
                      : "#FFC107",
              },
            ]}
          />

          <View>
            <Text style={styles.statusText}>
              {izinTerakhir?.status ||
                "Belum ada pengajuan"}
            </Text>

            {izinTerakhir && (
              <Text style={styles.statusSub}>
                {izinTerakhir.jenis} •{" "}
                {izinTerakhir.tanggal}
              </Text>
            )}
          </View>
        </View>
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
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },

  card: {
    backgroundColor: "#FFFFFF",

    marginHorizontal: 24,
    marginTop: 18,

    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 22,
    lineHeight: 18,
    fontFamily: "Poppins_400Regular",
  },

  label: {
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 10,
    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
  },

  placeholder: {
    color: "#999",
  },

  dateText: {
    marginLeft: 10,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 10,
    minHeight: 90,
    textAlignVertical: "top",
    padding: 12,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 10,

    alignItems: "center",
    paddingVertical: 14,
  },

  uploadTitle: {
    fontWeight: "600",
  },

  uploadSub: {
    fontSize: 12,
    color: "#666",
  },

  helpText: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
  },

  submitBtn: {
    backgroundColor: "#4D6BF3",
    height: 48,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 16,
  },

  submitText: {
    color: "#FFF",
    fontWeight: "600",
  },

  statusTitle: {
    fontWeight: "700",
    marginBottom: 14,
  },

  statusBox: {
    borderWidth: 1,
    borderColor: "#F4C842",

    backgroundColor: "#FFFBE6",

    borderRadius: 12,
    padding: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFC107",
    marginRight: 12,
  },
  statusText: {
    fontWeight: "700",
  },

  statusSub: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  formCard: {
    marginTop: 20,
  },
  inputText: {
    height: 46,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 10,
    paddingHorizontal: 12,

    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },

  uploadIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,

    backgroundColor: "#EEF2FF",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,
  },

});