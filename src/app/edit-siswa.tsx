import { supabase } from "../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { Image } from "react-native";
import React, {
  useState,
  useEffect,
} from "react";

import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditSiswaScreen() {
  const { id } = useLocalSearchParams();
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  const [kelasId, setKelasId] =
    useState<number | null>(null);

  useEffect(() => {
    getSiswa();
  }, []);

  async function getSiswa() {
    const { data, error } =
      await supabase
        .from("siswa")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      console.log(error);
      return;
    }

    setNama(data.nama);
    setNisn(data.nisn);
    setFoto(data.foto_url);
    setKelasId(data.kelas_id);
  }

  async function updateSiswa() {
    console.log("FOTO:", foto);
    let fotoUrl = foto;

    if (
      foto &&
      !foto.startsWith("http")
    ) {
      fotoUrl =
        await uploadFoto();
    }

    const { error } =
      await supabase
        .from("siswa")
        .update({
          nama,
          nisn,
          kelas_id: kelasId,
          foto_url: fotoUrl || foto,
        })
        .eq("id", id);

    if (error) {
      console.log(error);
      alert("Gagal update siswa");
      return;
    }

    alert("Data siswa berhasil diubah");

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
      console.log(
        "Foto baru:",
        result.assets[0].uri
      );

      setFoto(result.assets[0].uri);
    }
  }

  async function uploadFoto() {
    if (!foto) return null;

    console.log("URI FOTO:", foto);

    if (foto.startsWith("http")) {
      return foto;
    }

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

    console.log("UPLOAD ERROR:", error);

    if (error) {
      return null;
    }

    const { data } =
      supabase.storage
        .from("siswa")
        .getPublicUrl(fileName);

    console.log(
      "PUBLIC URL:",
      data.publicUrl
    );

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
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#3046E6"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Edit Siswa
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Nama Lengkap
          </Text>

          <TextInput
            style={styles.input}
            value={nama}
            onChangeText={setNama}
          />

          <Text style={styles.label}>
            NISN
          </Text>

          <TextInput
            style={styles.input}
            value={nisn}
            onChangeText={setNisn}
          />


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
            onPress={updateSiswa}
          >
            <Text
              style={styles.saveText}
            >
              Simpan Perubahan
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
    backgroundColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },

  headerTitle: {
    fontSize: 20,
    marginLeft: 12,
    color: "#3046E6",
    fontFamily: "Poppins_700Bold",
  },

  card: {
    backgroundColor: "#FFF",
    margin: 20,
    padding: 20,
    borderRadius: 20,

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
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 15,

    fontFamily: "Poppins_400Regular",
    backgroundColor: "#FFF",
  },

  saveButton: {
    backgroundColor: "#3046E6",
    height: 54,
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 30,
  },

  saveText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  photoButton: {
    height: 120,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3046E6",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },

  photoText: {
    marginTop: 8,
    color: "#3046E6",
  },

  previewFoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});