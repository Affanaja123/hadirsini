import React, {
  useState,
  useEffect,
} from "react";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { supabase } from "../lib/supabase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function EditKelasScreen() {
  const { id } = useLocalSearchParams();
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [waliKelas, setWaliKelas] = useState("");

  useEffect(() => {
  getKelas();
}, []);

async function getKelas() {
  const { data, error } = await supabase
    .from("kelas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  setKelas(data.kelas);
  setJurusan(data.jurusan);
  setWaliKelas(data.wali_kelas);
}

async function updateKelas() {
  const { error } = await supabase
    .from("kelas")
    .update({
      kelas,
      jurusan,
      wali_kelas: waliKelas,
    })
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Gagal memperbarui kelas");
    return;
  }

  alert("Kelas berhasil diperbarui");

  router.replace("/(admin)/laporan");
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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

          <Text style={styles.title}>
            Edit Kelas
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Kelas
          </Text>

          <TextInput
            style={styles.input}
            value={kelas}
            onChangeText={setKelas}
            placeholder="Contoh: 10"
          />

          <Text style={styles.label}>
            Jurusan
          </Text>

          <TextInput
            style={styles.input}
            value={jurusan}
            onChangeText={setJurusan}
            placeholder="Contoh: IPA A"
          />

          <Text style={styles.label}>
            Wali Kelas
          </Text>

          <TextInput
            style={styles.input}
            value={waliKelas}
            onChangeText={setWaliKelas}
            placeholder="Nama Wali Kelas"
          />

          <TouchableOpacity
  style={styles.saveBtn}
  onPress={updateKelas}
> 
            <Text style={styles.saveText}>
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
    backgroundColor: "#F4F3F8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },

  title: {
    fontSize: 22,
    marginLeft: 12,
    fontFamily: "Poppins_700Bold",
  },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 15,
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: "#FAFAFA",
  },

  saveBtn: {
    height: 55,
    backgroundColor: "#3046E6",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 25,
  },

  saveText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },

  deleteBtn: {
    height: 55,
    backgroundColor: "#EF4444",
    borderRadius: 14,

    marginTop: 12,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    color: "#FFF",
    marginLeft: 8,
    fontFamily: "Poppins_600SemiBold",
  },
});