import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UbahProfilAdminScreen() {
  const [nama, setNama] = useState("");
  const [nisnLama, setNisnLama] = useState("");
  const [nisnBaru, setNisnBaru] = useState("");
  const [konfirmasiNisn, setKonfirmasiNisn] = useState("");

  useEffect(() => {
    getAdmin();
  }, []);

  async function getAdmin() {
    const { data, error } = await supabase
      .from("admin")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setNama(data.nama || "");
  }

  async function handleSave() {
    try {
      const { data: admin, error } =
        await supabase
          .from("admin")
          .select("*")
          .eq("id", 1)
          .single();

      console.log("ADMIN DATABASE =", admin);



      if (admin.nisn !== nisnLama) {
        Alert.alert(
          "Gagal",
          "NISN lama salah"
        );
        return;
      }

      if (nisnBaru !== konfirmasiNisn) {
        Alert.alert(
          "Gagal",
          "Konfirmasi NISN tidak cocok"
        );
        return;
      }

      console.log("DATA UPDATE");
      console.log("Nama =", nama);
      console.log("NISN Baru =", nisnBaru);

      const { data, error: updateError } =
        await supabase
          .from("admin")
          .update({
            nama: nama.trim(),
            nisn: nisnBaru.trim(),
          })
          .eq("id", admin.id)
          .select();

      console.log("UPDATE DATA =", data);
      console.log("UPDATE ERROR =", updateError);

      if (updateError) {
        Alert.alert(
          "Gagal",
          JSON.stringify(updateError)
        );
        return;
      }

      Alert.alert(
        "Berhasil",
        "Profil admin berhasil diperbarui"
      );

      router.back();

      Alert.alert(
        "Berhasil",
        "Profil admin berhasil diperbarui"
      );

      router.back();
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Gagal",
        "Terjadi kesalahan"
      );
    }
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
            Ubah Profil Admin
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Nama Admin
          </Text>

          <TextInput
            style={styles.input}
            value={nama}
            onChangeText={setNama}
            placeholder="Nama Admin"
          />

          <Text style={styles.label}>
            NISN Lama
          </Text>

          <TextInput
            style={styles.input}
            value={nisnLama}
            onChangeText={setNisnLama}
            placeholder="NISN"
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            NISN Baru
          </Text>

          <TextInput
            style={styles.input}
            value={nisnBaru}
            onChangeText={setNisnBaru}
            placeholder="Masukkan NISN baru"
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Konfirmasi NISN Baru
          </Text>

          <TextInput
            style={styles.input}
            value={konfirmasiNisn}
            onChangeText={setKonfirmasiNisn}
            placeholder="Ulangi NISN baru"
            keyboardType="numeric"
          />



          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons
              name="save-outline"
              size={20}
              color="#FFF"
            />

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
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },

  label: {
    marginBottom: 8,
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: "#FFF",
  },

  saveButton: {
    marginTop: 10,
    height: 55,
    backgroundColor: "#3046E6",
    borderRadius: 14,

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
});