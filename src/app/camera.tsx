import React, {
  useRef,
  useState,
  useEffect,
} from "react";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { supabase } from "../lib/supabase";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import { router } from "expo-router";


function hitungJarak(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;

  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;

  const Δφ =
    (lat2 - lat1) * Math.PI / 180;

  const Δλ =
    (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(Δφ / 2) *
    Math.sin(Δφ / 2) +
    Math.cos(φ1) *
    Math.cos(φ2) *
    Math.sin(Δλ / 2) *
    Math.sin(Δλ / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

export default function CameraScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const cameraRef =
    useRef<any>(null);

  const [foto, setFoto] =
    useState<string | null>(null);

  const [absensiAktif, setAbsensiAktif] =
    useState(true);

  async function getProfilSekolah() {
    const { data } = await supabase
      .from("profil_sekolah")
      .select("absensi_aktif")
      .eq("id", 1)
      .single();

    if (data) {
      setAbsensiAktif(
        data.absensi_aktif
      );
    }
  }

  useEffect(() => {
    getProfilSekolah();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>
          Aplikasi membutuhkan izin kamera
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Izinkan Kamera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function ambilFoto() {
    if (!cameraRef.current) return;

    const photo =
      await cameraRef.current.takePictureAsync();

    setFoto(photo.uri);
  }

  async function simpanAbsen() {

    const { data: profil } = await supabase
      .from("profil_sekolah")
      .select("absensi_aktif")
      .eq("id", 1)
      .single();

    if (!profil?.absensi_aktif) {
      alert(
        "Absensi sedang dinonaktifkan oleh pihak sekolah"
      );
      return;
    }
    try {
      const userString =
        await AsyncStorage.getItem("user");

      if (!userString) {
        alert("User tidak ditemukan");
        return;
      }

      const user =
        JSON.parse(userString);

      console.log("USER LOGIN =", user);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Izin lokasi ditolak");
        return;
      }

      const lokasi =
        await Location.getCurrentPositionAsync({});

      const lat =
        lokasi.coords.latitude;

      const lng =
        lokasi.coords.longitude;

      const { data: sekolah, error: sekolahError } =
        await supabase
          .from("profil_sekolah")
          .select("*")
          .eq("id", 1)
          .single();

      console.log("SEKOLAH =", sekolah);
      console.log("SEKOLAH ERROR =", sekolahError);

      const jarak =
        hitungJarak(
          lat,
          lng,
          Number(sekolah.latitude),
          Number(sekolah.longitude)
        );

      if (jarak > Number(sekolah.radius)) {
        alert(
          `Anda berada ${Math.round(
            jarak
          )}m dari sekolah`
        );
        return;
      }

      const sekarang =
        new Date();

      const jamSekarang =
        sekarang.toTimeString().slice(0, 5);

      // if (jamSekarang < sekolah.jam_masuk) {
      //   alert(
      //     `Absensi dibuka pukul ${sekolah.jam_masuk}`
      //   );
      //   return;
      // }

      // console.log("JAM SEKARANG =", jamSekarang);
      // console.log("BATAS TERLAMBAT =", sekolah.batas_terlambat);
      // console.log("JAM MASUK =", sekolah.jam_masuk);

      const statusAbsen =
        jamSekarang <= sekolah.batas_terlambat
          ? "Hadir"
          : "Terlambat";

      const hariIni =
        sekarang.getFullYear() +
        "-" +
        String(sekarang.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(sekarang.getDate()).padStart(2, "0");

      const { data: sudahIzin } =
        await supabase
          .from("izin")
          .select("id")
          .eq("siswa_id", user.id)
          .eq("tanggal", hariIni)
          .in("status", [
            "Menunggu",
            "Disetujui",
          ])
          .maybeSingle();

      if (sudahIzin) {
        alert(
          "Anda sudah mengajukan izin untuk hari ini."
        );
        return;
      }


      const { data: sudahAbsen } =
        await supabase
          .from("kehadiran")
          .select("id")
          .eq("siswa_id", user.id)
          .eq("tanggal", hariIni)
          .maybeSingle();


      console.log("CEK TANGGAL =", hariIni);
      console.log("SUDAH ABSEN =", sudahAbsen);

      if (sudahAbsen) {
        alert(
          "Anda sudah melakukan absen hari ini"
        );
        return;
      }



      const fileName =
        `${Date.now()}.jpg`;



      const base64 =
        await FileSystem.readAsStringAsync(
          foto!,
          {
            encoding:
              FileSystem.EncodingType.Base64,
          }
        );

      console.log("FOTO URI =", foto);
      console.log("FILE NAME =", fileName);
      console.log("BASE64 LENGTH =", base64.length);

      const { error: uploadError } =
        await supabase.storage
          .from("kehadiran")
          .upload(
            fileName,
            decode(base64),
            {
              contentType: "image/jpeg",
            }
          );

      const { data: fotoData } =
        supabase.storage
          .from("kehadiran")
          .getPublicUrl(fileName);

      const fotoUrl =
        fotoData.publicUrl;
      const { error } =
        await supabase
          .from("kehadiran")
          .insert({
            siswa_id: user.id,
            tanggal: hariIni,
            jam_masuk: jamSekarang,
            status: statusAbsen,
            latitude: lat,
            longitude: lng,
            foto_url: fotoUrl,
          });

      if (error) {
        console.log("ERROR:", error);

        alert(
          error.message ||
          JSON.stringify(error)
        );

        return;
      }

      alert(
        `Absen berhasil (${statusAbsen})`
      );

      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("ERROR ABSEN =", err);
      alert(err?.message || JSON.stringify(err));
    }
  }




  return (
    <View style={{ flex: 1 }}>
      {foto ? (
        <>
          <Image
            source={{ uri: foto }}
            style={{ flex: 1 }}
          />

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setFoto(null)}
            >
              <Text style={styles.buttonText}>
                Ulangi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!absensiAktif}
              style={[
                styles.primaryBtn,
                !absensiAktif && {
                  backgroundColor: "#BDBDBD",
                },
              ]}
              onPress={simpanAbsen}
            >
              <Text style={styles.buttonText}>
                {absensiAktif
                  ? "Simpan Absen"
                  : "Absensi Ditutup"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="front"
          />

          <TouchableOpacity
            style={styles.captureBtn}
            onPress={ambilFoto}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>
              Tutup
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#3046E6",
    padding: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },

  captureBtn: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",

    width: 80,
    height: 80,

    borderRadius: 40,

    backgroundColor: "#FFF",

    borderWidth: 5,
    borderColor: "#3046E6",
  },

  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,

    backgroundColor: "#00000099",

    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 20,
  },

  bottomBar: {
    position: "absolute",

    bottom: 40,

    left: 20,
    right: 20,

    flexDirection: "row",
    gap: 10,
  },

  secondaryBtn: {
    flex: 1,

    height: 55,

    backgroundColor: "#666",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  primaryBtn: {
    flex: 1,

    height: 55,

    backgroundColor: "#3046E6",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },
});