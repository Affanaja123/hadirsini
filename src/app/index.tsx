import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();

  const [showSplash, setShowSplash] = useState(true);
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const loginOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(loginOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => setShowSplash(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [loading, setLoading] =
    useState(false);

  async function login() {
    console.log("LOGIN DIKLIK");

    if (!nama || !nisn) {
      alert("Lengkapi data login");
      return;
    }

    console.log("Platform Login");
    console.log("Nama =", nama);
    console.log("NISN =", nisn);

    console.log(
      "NAMA INPUT =",
      JSON.stringify(nama)
    );

    console.log(
      "NISN INPUT =",
      JSON.stringify(nisn)
    );

    const { data: semuaAdmin } =
      await supabase
        .from("admin")
        .select("*");

    console.log("SEMUA ADMIN =", semuaAdmin);

    const admin = semuaAdmin?.find(
      (a: any) =>
        a.nama.trim().toLowerCase() ===
        nama.trim().toLowerCase() &&
        a.nisn.trim() === nisn.trim()
    );

    console.log("ADMIN COCOK =", admin);


    if (admin) {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(admin)
      );

      router.replace("/(admin)/dashboard");
      return;
    }

    console.log(
      "HASIL PERBANDINGAN",
      semuaAdmin?.map((a: any) => ({
        dbNama: a.nama,
        dbNisn: a.nisn,
        cocokNama:
          a.nama.trim().toLowerCase() ===
          nama.trim().toLowerCase(),
        cocokNisn:
          a.nisn.trim() === nisn.trim(),
      }))
    );

    const { data: siswa, error: siswaError } =
      await supabase
        .from("siswa")
        .select("*")
        .eq("nama", nama)
        .eq("nisn", nisn)
        .single();

    console.log("SISWA:", siswa);
    console.log("SISWA ERROR:", siswaError);

    if (siswa) {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(siswa)
      );

      console.log("MASUK SISWA");

      router.replace("/(tabs)/home");

      return;
    }

    alert("Nama atau NISN tidak ditemukan");
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.loginPage, { opacity: loginOpacity }]}>
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={styles.safe}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View
              style={[
                styles.container,
                {
                  width,
                  height,
                  paddingHorizontal: width * 0.09,
                },
              ]}
            >
              <LinearGradient
                colors={["#0000ff", "#5a6fa3", "#EEF1F8"]}
                locations={[0.10, 0.52, 1]}
                start={{ x: 0.05, y: 0 }}
                end={{ x: 0.95, y: 1 }}
                style={[
                  styles.gradientCircle,
                  {
                    width: width * 1.4,
                    height: width * 1.4,
                    borderRadius: width * 0.7,

                    top: -width * 0.9,
                    left: -width * 0.65,
                  },
                ]}
              />

              <View style={styles.header}>

                <View style={styles.header}>

                  <Text style={[styles.brand, { fontSize: width * 0.135 }]}>
                    Hadir<Text style={styles.blue}>Sini</Text>
                  </Text>

                  <Text style={styles.title}>Login</Text>
                  <Text style={styles.subtitle}>
                    Login now and mark your attendance!
                  </Text>

                  <View style={styles.formContainer}>
                  </View>

                  <Text style={styles.label}>
                    Nama Lengkap
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan Nama Lengkap"
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

                  <TouchableOpacity
                    style={styles.button}
                    onPress={login}
                  >
                    <Text style={styles.buttonText}>
                      Masuk
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style={styles.logoWrapper}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={styles.logoIcon}
                  resizeMode="contain"
                />

                <Text style={styles.logoText}>
                  Hadir<Text style={styles.logoTextBlue}>Sini</Text>
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View >

      {showSplash && (
        <Animated.View style={[styles.splashPage, { opacity: splashOpacity }]}>
          <LinearGradient
            colors={["#F2F2F2", "#8D9DC4", "#1B4FD1"]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.splashGradient}
          >
            <View style={styles.splashCircle}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.splashLogoIcon}
                resizeMode="contain"
              />

              <Text style={styles.splashLogoText}>
                Hadir<Text style={styles.splashLogoBlue}>Sini</Text>
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loginPage: {
    flex: 1,
  },

  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },

  gradientCircle: {
    position: "absolute",
  },

  header: {
    zIndex: 2,
    marginTop: 40,
  },

  formContainer: {
    marginTop: 40,
  },

  brand: {
    fontFamily: "Poppins_700Bold",
    color: "#111827",
    fontSize: 62,
    letterSpacing: -2,
  },

  blue: {
    color: "#0789C9",
  },

  title: {
    fontSize: 34,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 15,
    color: "#222",
    marginTop: 8,
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  form: {
    width: "100%",
  },

  label: {
    fontSize: 16,
    color: "#111",
    marginBottom: 10,
    marginTop: 25,
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 10,
    color: "#111",
    fontFamily: "Poppins_500Medium",
  },

  passwordContainer: {
    width: "100%",
    height: 42,
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 7,
    marginBottom: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  passwordInput: {
    flex: 1,
    height: 42,
    paddingHorizontal: 11,
    paddingVertical: 0,
    fontSize: 14,
    color: "#111",
    fontFamily: "Poppins_500Medium",
  },

  eyeButton: {
    width: 38,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    alignSelf: "center",

    width: 190,
    height: 48,

    backgroundColor: "#4D73F4",

    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 40,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },

  logoWrapper: {
    position: "absolute",

    bottom: 35,

    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoIcon: {
    width: 65,
    height: 65,
    marginRight: 6,
  },

  logoText: {
    fontSize: 26,
    color: "#111827",
    fontFamily: "Poppins_700Bold",
  },

  logoTextBlue: {
    color: "#0789C9",
  },

  splashPage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  splashGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  splashCircle: {
    width: 205,
    height: 205,
    borderRadius: 102.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    transform: [{ translateY: -30 }],
    paddingLeft: 18,
    paddingRight: 24,
  },

  splashLogoIcon: {
    width: 55,
    height: 55,
    marginRight: 6,
  },

  splashLogoText: {
    fontSize: 27,
    color: "#111827",
    fontFamily: "Poppins_700Bold",
  },

  splashLogoBlue: {
    color: "#0789C9",
  },

});