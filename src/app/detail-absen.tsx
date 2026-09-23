import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLocalSearchParams, router } from "expo-router";

import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function DetailAbsenScreen() {
  const { id } = useLocalSearchParams();

  const [absen, setAbsen] =
    useState<any>(null);

  useEffect(() => {
    loadDetail();
  }, []);

  async function loadDetail() {
    const { data, error } =
      await supabase
        .from("kehadiran")
        .select(`
          *,
          siswa (
            nama,
            nisn,
            foto_url,
            kelas (
              kelas,
              jurusan
            )
          )
        `)
        .eq("id", id)
        .single();

    if (error) {
      console.log(error);
      return;
    }

    setAbsen(data);
  }

  if (!absen) {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            marginTop: 50,
          }}
        >
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

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
            Detail Absensi
          </Text>
        </View>

        <View style={styles.card}>
          <Image
            source={{
              uri:
                absen.siswa?.foto_url ||
                "https://i.pravatar.cc/300",
            }}
            style={styles.avatar}
          />

          <Text style={styles.nama}>
            {absen.siswa?.nama}
          </Text>

          <Text style={styles.nisn}>
            NISN: {absen.siswa?.nisn}
          </Text>

          <Text style={styles.kelas}>
            {absen.siswa?.kelas?.kelas}
            {" "}
            {absen.siswa?.kelas?.jurusan}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Tanggal
          </Text>

          <Text style={styles.value}>
            {absen.tanggal}
          </Text>

          <Text style={styles.label}>
            Jam Masuk
          </Text>

          <Text style={styles.value}>
            {absen.jam_masuk}
          </Text>

          <Text style={styles.label}>
            Status Kehadiran
          </Text>

          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor:
                absen.status === "Hadir"
                  ? "#DCFCE7"
                  : "#FEF3C7",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color:
                  absen.status === "Hadir"
                    ? "#16A34A"
                    : "#D97706",
                fontWeight: "600",
              }}
            >
              {absen.status}
            </Text>
          </View>
        </View>

        {absen.foto_url && (
          <View style={styles.card}>
            <Text style={styles.label}>
              Foto Absen
            </Text>

            <Image
              source={{
                uri: absen.foto_url,
              }}
              style={styles.fotoAbsen}
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>
            Latitude
          </Text>

          <Text style={styles.value}>
            {absen.latitude}
          </Text>

          <Text style={styles.label}>
            Longitude
          </Text>

          <Text style={styles.value}>
            {absen.longitude}
          </Text>
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
    paddingBottom: 20,
  },

  headerTitle: {
    marginLeft: 12,
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
  },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },

  nama: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
  },

  nisn: {
    textAlign: "center",
    color: "#666",
  },

  kelas: {
    textAlign: "center",
    color: "#3046E6",
    marginTop: 4,
  },

  label: {
    color: "#666",
    marginTop: 10,
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
  },

  fotoAbsen: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginTop: 10,
  },
});