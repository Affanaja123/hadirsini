import React, {
  useState,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TambahSiswaScreen() {
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const [kelasId, setKelasId] =
    useState<number | null>(null);

  const [selectedKelas, setSelectedKelas] =
    useState("Pilih Kelas");

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [kelasList, setKelasList] =
    useState<any[]>([]);
  const [foto, setFoto] =
    useState<string | null>(null);



  useEffect(() => {
    getKelas();
  }, []);

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

  async function simpanSiswa() {
    console.log("Mulai simpan");

    const fotoUrl = await uploadFoto();

    console.log("Foto URL:", fotoUrl);

    const { data, error } =
      await supabase
        .from("siswa")
        .insert([
          {
            nama,
            nisn,
            kelas_id: kelasId,
            foto_url: fotoUrl,
          },
        ]);

    if (error) {
      alert("Gagal menambah siswa");
      return;
    }

    alert("Siswa berhasil ditambahkan");

    router.replace("/(admin)/siswa");
  }

  async function pilihFoto() {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }
  


  async function uploadFoto() {
    if (!foto) return null;

    const base64 =
      await FileSystem.readAsStringAsync(
        foto,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

    const fileName =
      `${Date.now()}.jpg`;

    const { error } =
      await supabase.storage
        .from("siswa")
        .upload(
          fileName,
          decode(base64),
          {
            contentType: "image/jpeg",
          }
        );

    if (error) {
      console.log(error);
      return null;
    }

    const { data } =
      supabase.storage
        .from("siswa")
        .getPublicUrl(fileName);

    return data.publicUrl;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
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
            Tambah Siswa
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Nama Lengkap
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Masukkan nama siswa"
            value={nama}
            onChangeText={setNama}
          />

          <Text style={styles.label}>
            NISN
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Masukkan NISN"
            keyboardType="numeric"
            value={nisn}
            onChangeText={setNisn}
          />

          <Text style={styles.label}>
            Kelas
          </Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() =>
              setShowDropdown(!showDropdown)
            }
          >
            <Text>
              {selectedKelas}
            </Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              {kelasList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedKelas(
                      `Kelas ${item.kelas} ${item.jurusan}`
                    );

                    setKelasId(item.id);

                    setShowDropdown(false);
                  }}
                >
                  <Text>
                    Kelas {item.kelas} {item.jurusan}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>
            Foto Siswa
          </Text>

          <TouchableOpacity
            style={styles.photoButton}
            onPress={pilihFoto}
          >
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={styles.previewFoto}
              />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color="#3046E6"
                />

                <Text style={styles.photoText}>
                  Pilih Foto
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={simpanSiswa}
          >
            <Text style={styles.saveText}>
              Simpan Siswa
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },

  headerTitle: {
    marginLeft: 12,
    fontSize: 22,
    color: "#3046E6",
    fontFamily: "Poppins_700Bold",
  },

  card: {
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 20,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  label: {
    marginBottom: 8,
    marginTop: 15,
    fontSize: 14,
    color: "#111",
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    fontFamily: "Poppins_400Regular",
  },

  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    textAlignVertical: "top",
    fontFamily: "Poppins_400Regular",
  },

  saveButton: {
    height: 52,
    backgroundColor: "#3046E6",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 30,
  },

  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  photoButton: {
    height: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3046E6",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  photoText: {
    marginTop: 8,
    color: "#3046E6",
    fontFamily: "Poppins_500Medium",
  },
  dropdown: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginTop: 5,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  previewFoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
});