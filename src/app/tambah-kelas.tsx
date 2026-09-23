import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TambahKelasScreen() {
const [kelas, setKelas] = useState("");
const [jurusan, setJurusan] = useState("");
const [waliKelas, setWaliKelas] = useState("");

async function simpanKelas() {
  if (
    !kelas ||
    !jurusan ||
    !waliKelas
  ) {
    alert("Semua field wajib diisi");
    return;
  }

  const { error } =
    await supabase
      .from("kelas")
      .insert([
        {
          kelas,
          jurusan,
          wali_kelas: waliKelas,
          jumlah_siswa: 0,
        },
      ]);

  if (error) {
  console.log("SUPABASE ERROR:", error);
  alert(error.message);
  return;
}

  alert("Kelas berhasil ditambahkan");

  router.replace("/(admin)/laporan");
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

        <Text style={styles.title}>
          Tambah Kelas
        </Text>
      </View>

      <View style={styles.card}>
  <Text style={styles.label}>
    Kelas
  </Text>

  <TextInput
    style={styles.input}
    placeholder="Contoh: 10"
    value={kelas}
    onChangeText={setKelas}
    keyboardType="numeric"
  />

  <Text style={styles.label}>
    Jurusan
  </Text>

  <TextInput
    style={styles.input}
    placeholder="Contoh: IPA A"
    value={jurusan}
    onChangeText={setJurusan}
  />

  <Text style={styles.label}>
    Wali Kelas
  </Text>

  <TextInput
    style={styles.input}
    placeholder="Nama wali kelas"
    value={waliKelas}
    onChangeText={setWaliKelas}
  />

  <TouchableOpacity
  style={styles.button}
  onPress={simpanKelas}
>
    <Text style={styles.buttonText}>
      Simpan Kelas
    </Text>
  </TouchableOpacity>
</View>
    </SafeAreaView>
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
    paddingTop: 50,
  },

  title: {
    marginLeft: 10,
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
  },

  card: {
    backgroundColor: "#FFF",
    margin: 20,
    padding: 20,
    borderRadius: 18,
  },

  label: {
    marginBottom: 8,
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#3046E6",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontFamily: "Poppins_600SemiBold",
  },
});