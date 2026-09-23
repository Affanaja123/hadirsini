import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";

import { router } from "expo-router";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";



export default function ProfileScreen() {
  const [camera, setCamera] = useState(false);
  const [location, setLocation] = useState(false);
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

  


  async function requestCamera() {
    const result =
      await Camera.requestCameraPermissionsAsync();

    setCamera(
      result.status === "granted"
    );
  }

  async function requestLocation() {
    const result =
      await Location.requestForegroundPermissionsAsync();

    setLocation(
      result.status === "granted"
    );
  }

  useEffect(() => {
    loadUser();

    checkPermissions();
  }, []);

  async function checkPermissions() {
    const cam =
      await Camera.getCameraPermissionsAsync();

    const loc =
      await Location.getForegroundPermissionsAsync();

    setCamera(
      cam.status === "granted"
    );

    setLocation(
      loc.status === "granted"
    );
  }

  async function logout() {
    await AsyncStorage.removeItem("user");

    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#2563EB"
          />

          <Text style={styles.backText}>
            Kembali
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOTO */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri:
              user?.foto_url ||
              "https://i.pravatar.cc/300"
          }}
          style={styles.avatar}
        />


      </View>

      {/* INFO */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>
          {user?.nama}
        </Text>

        <Text style={styles.classText}>
          {user?.kelas?.kelas}
          {" "}
          {user?.kelas?.jurusan}
          {" • "}
          NISN:
          {" "}
          {user?.nisn}
        </Text>
      </View>

      {/* IZIN */}
      <Text style={styles.sectionTitle}>
        IZIN APLIKASI
      </Text>

      <View style={styles.permissionCard}>
        {/* CAMERA */}
        <View style={styles.permissionItem}>
          <View style={styles.left}>
            <View style={styles.iconBox}>
              <Ionicons
                name="camera"
                size={24}
                color="#2563EB"
              />
            </View>

            <View>
              <Text style={styles.permissionTitle}>
                Izinkan Kamera
              </Text>

              <Text style={styles.permissionDesc}>
                Digunakan untuk scan Wajah
              </Text>
            </View>
          </View>

          <Switch
            value={camera}
            onValueChange={requestCamera}
          />
        </View>

        {/* LOCATION */}
        <View style={styles.permissionItem}>
          <View style={styles.left}>
            <View style={styles.iconBox}>
              <Ionicons
                name="location"
                size={24}
                color="#2563EB"
              />
            </View>

            <View>
              <Text style={styles.permissionTitle}>
                Izinkan Lokasi/GPS
              </Text>

              <Text style={styles.permissionDesc}>
                Verifikasi presensi di area sekolah
              </Text>
            </View>
          </View>

          <Switch
            value={location}
            onValueChange={requestLocation}
          />
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >
        <MaterialCommunityIcons
          name="logout"
          size={22}
          color="#DC2626"
        />

        <Text style={styles.logoutText}>
          Keluar
        </Text>
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
    height: 90,
    backgroundColor: "#FFF",

    justifyContent: "flex-end",

    paddingHorizontal: 20,
    paddingBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 4,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    marginLeft: 8,
    color: "#2563EB",
    fontFamily: "Poppins_600SemiBold",
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 28,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: "#D9DDFE",
  },

  cameraBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    bottom: 0,
    right: "34%",
  },

  infoCard: {
    alignSelf: "center",

    backgroundColor: "#FFF",

    marginTop: 16,

    borderRadius: 16,

    paddingHorizontal: 24,
    paddingVertical: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 5,
  },

  name: {
    fontSize: 32,
    color: "#1E293B",
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },

  classText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    fontFamily: "Poppins_400Regular",
  },

  sectionTitle: {
    marginTop: 36,
    marginHorizontal: 24,

    color: "#2563EB",

    fontFamily: "Poppins_700Bold",
  },

  permissionCard: {
    backgroundColor: "#FFF",

    marginHorizontal: 16,
    marginTop: 16,

    borderRadius: 18,

    overflow: "hidden",

    elevation: 3,
  },

  permissionItem: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    padding: 16,

    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#E0E7FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  permissionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },

  permissionDesc: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },

  logoutBtn: {
    marginTop: 35,

    marginHorizontal: 16,

    height: 56,

    borderWidth: 2,
    borderColor: "#DC2626",

    borderRadius: 16,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#DC2626",
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});