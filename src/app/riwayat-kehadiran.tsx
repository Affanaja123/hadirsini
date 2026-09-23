import React, {
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

export default function RiwayatKehadiranScreen() {
  const [riwayat, setRiwayat] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date().toLocaleDateString(
        "id-ID",
        {
          month: "long",
        }
      )
    );

  const [showMonth, setShowMonth] =
    useState(false);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  useEffect(() => {
    loadRiwayat();
  }, []);

  async function loadRiwayat() {
    const userString =
      await AsyncStorage.getItem("user");

    if (!userString) return;

    const user =
      JSON.parse(userString);

    const { data, error } =
      await supabase
        .from("kehadiran")
        .select("*")
        .eq("siswa_id", user.id)
        .order("tanggal", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    setRiwayat(data || []);
  }

  const filteredRiwayat =
    riwayat.filter((item) => {
      const bulanItem =
        new Date(item.tanggal)
          .toLocaleDateString(
            "id-ID",
            {
              month: "long",
            }
          );

      const cocokBulan =
        bulanItem.toLowerCase() ===
        selectedMonth.toLowerCase();

      const cocokSearch =
        search.trim() === ""
          ? true
          : item.tanggal
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.status
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.jam_masuk
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

      return (
        cocokBulan &&
        cocokSearch
      );
    });

  return (
    <SafeAreaView style={styles.container}>
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
            color="#111"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Riwayat Kehadiran
        </Text>
      </View>

      {/* SEARCH + FILTER */}
      <View style={styles.topMenu}>
        <View
          style={styles.searchContainer}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color="#9CA3AF"
          />

          <TextInput
            placeholder="Cari riwayat"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View>
          <TouchableOpacity
            style={styles.monthBtn}
            onPress={() =>
              setShowMonth(
                !showMonth
              )
            }
          >
            <Text
              style={styles.monthText}
            >
              {selectedMonth}
            </Text>

            <Ionicons
              name={
                showMonth
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={16}
              color="#3046E6"
            />
          </TouchableOpacity>

          {showMonth && (
            <View
              style={styles.dropdown}
            >
              <ScrollView
                nestedScrollEnabled
              >
                {months.map(
                  (month) => (
                    <TouchableOpacity
                      key={month}
                      style={
                        styles.dropdownItem
                      }
                      onPress={() => {
                        setSelectedMonth(
                          month
                        );

                        setShowMonth(
                          false
                        );
                      }}
                    >
                      <Text>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* LIST */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
        }}
      >
        {filteredRiwayat.length ===
        0 ? (
          <View
            style={
              styles.emptyContainer
            }
          >
            <Ionicons
              name="document-text-outline"
              size={70}
              color="#C7C7C7"
            />

            <Text
              style={styles.emptyTitle}
            >
              Belum ada riwayat
            </Text>

            <Text
              style={styles.emptyText}
            >
              Data absen akan
              muncul di sini
            </Text>
          </View>
        ) : (
          filteredRiwayat.map(
            (item) => (
              <View
                key={item.id}
                style={styles.card}
              >
                <Text
                  style={
                    styles.tanggal
                  }
                >
                  {item.tanggal}
                </Text>

                <Text
                  style={styles.jam}
                >
                  Jam Masuk :
                  {" "}
                  {
                    item.jam_masuk
                  }
                </Text>

                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        item.status ===
                        "Hadir"
                          ? "green"
                          : "orange",
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            )
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F4F3F8",
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

      fontFamily:
        "Poppins_700Bold",
    },

    topMenu: {
      flexDirection: "row",

      paddingHorizontal: 16,

      marginBottom: 10,
    },

    searchContainer: {
      flex: 1,

      flexDirection: "row",

      alignItems: "center",

      height: 48,

      backgroundColor:
        "#FFF",

      borderRadius: 14,

      paddingHorizontal: 14,

      marginRight: 10,
    },

    searchInput: {
      flex: 1,

      marginLeft: 8,
    },

    monthBtn: {
      height: 48,

      minWidth: 120,

      paddingHorizontal: 14,

      borderRadius: 14,

      backgroundColor:
        "#EEF2FF",

      borderWidth: 1,

      borderColor:
        "#C7D2FE",

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",
    },

    monthText: {
      color: "#3046E6",

      fontFamily:
        "Poppins_600SemiBold",
    },

    dropdown: {
      position: "absolute",

      top: 52,
      right: 0,

      width: 150,

      maxHeight: 220,

      backgroundColor:
        "#FFF",

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        "#E5E7EB",

      zIndex: 999,
    },

    dropdownItem: {
      padding: 12,

      borderBottomWidth: 0.5,

      borderBottomColor:
        "#E5E7EB",
    },

    card: {
      backgroundColor:
        "#FFF",

      borderRadius: 16,

      padding: 16,

      marginBottom: 12,
    },

    tanggal: {
      fontSize: 15,

      fontWeight: "700",
    },

    jam: {
      marginTop: 5,

      color: "#666",
    },

    status: {
      marginTop: 5,

      fontWeight: "700",
    },

    emptyContainer: {
      alignItems: "center",

      marginTop: 80,
    },

    emptyTitle: {
      marginTop: 12,

      fontSize: 16,

      fontFamily:
        "Poppins_600SemiBold",
    },

    emptyText: {
      color: "#666",

      marginTop: 6,

      textAlign: "center",
    },
  });