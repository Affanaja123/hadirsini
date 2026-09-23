import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";


import { supabase } from "../lib/supabase";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as Location from "expo-location";

import { router } from "expo-router";

export default function PilihLokasiScreen() {
  const [latitude, setLatitude] =
    useState(-6.2088);

  const [longitude, setLongitude] =
    useState(106.8456);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getLokasiSaatIni();
  }, []);

  async function getLokasiSaatIni() {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Izin Ditolak",
        "Aktifkan izin lokasi terlebih dahulu"
      );
      return;
    }

    const lokasi =
      await Location.getCurrentPositionAsync({});

    const lat =
      lokasi.coords.latitude;

    const lng =
      lokasi.coords.longitude;

    setLatitude(lat);
    setLongitude(lng);

    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }

  async function simpanLokasi() {
    const { error } =
      await supabase
        .from("profil_sekolah")
        .update({
          latitude,
          longitude,
        })
        .eq("id", 1);

    if (error) {
      console.log(error);

      Alert.alert(
        "Gagal",
        "Lokasi gagal disimpan"
      );

      return;
    }

    Alert.alert(
      "Berhasil",
      "Lokasi sekolah berhasil disimpan"
    );

    router.back();
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onPress={(e) => {
          setLatitude(
            e.nativeEvent.coordinate.latitude
          );

          setLongitude(
            e.nativeEvent.coordinate.longitude
          );
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          draggable
          onDragEnd={(e) => {
            setLatitude(
              e.nativeEvent.coordinate.latitude
            );

            setLongitude(
              e.nativeEvent.coordinate.longitude
            );
          }}
        />
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.label}>
          Latitude
        </Text>

        <Text style={styles.value}>
          {latitude.toFixed(6)}
        </Text>

        <Text style={styles.label}>
          Longitude
        </Text>

        <Text style={styles.value}>
          {longitude.toFixed(6)}
        </Text>

        <TouchableOpacity
          style={styles.locationBtn}
          onPress={getLokasiSaatIni}
        >
          <Text style={styles.locationText}>
            Gunakan Lokasi Saat Ini
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={simpanLokasi}
        >
          <Text style={styles.saveText}>
            Konfirmasi Lokasi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  infoCard: {
    position: "absolute",

    bottom: 20,
    left: 20,
    right: 20,

    backgroundColor: "#FFF",

    borderRadius: 20,

    padding: 20,

    elevation: 5,
  },

  label: {
    color: "#666",
    marginTop: 5,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  locationBtn: {
    height: 50,

    backgroundColor: "#F3F4F6",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },

  locationText: {
    color: "#3046E6",
    fontWeight: "600",
  },

  saveBtn: {
    height: 55,

    backgroundColor: "#3046E6",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 12,
  },

  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});