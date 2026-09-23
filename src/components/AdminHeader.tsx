import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import HeaderWave from "./HeaderWave";

type Props = {
  title: string;
};

export default function AdminHeader({
  title,
}: Props) {

  async function logout() {
    await AsyncStorage.removeItem("user");

    router.replace("/");
  }
  return (
    <LinearGradient
      colors={["#4657E8", "#5E72FF", "#728CFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.logoRow}>
        <View style={styles.logoLeft}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={28}
              color="#4657E8"
            />
          </View>

          <View>
            <Text style={styles.appTitle}>
              HadirSini
            </Text>


          </View>
        </View>

        <TouchableOpacity
          style={styles.notifButton}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>
        {title}
      </Text>

      <HeaderWave />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 220,

    paddingTop: 20,
    paddingHorizontal: 20,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    overflow: "hidden",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  logoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: "#FFF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  appTitle: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },

  schoolText: {
    color: "#E5E7EB",
    fontFamily: "Poppins_400Regular",
  },

  notifButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    marginLeft: "auto",

    backgroundColor:
      "rgba(255,255,255,0.15)",

    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    marginTop: 30,

    color: "#FFF",

    fontSize: 26,

    fontFamily: "Poppins_700Bold",
  },
});