import { supabase } from "../../lib/supabase";
import { useEffect } from "react";

import React, { useState } from "react";
import {
  View,
  Text,
  Linking,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import AdminHeader from "../../components/AdminHeader";

export default function IzinScreen() {
  const [activeTab, setActiveTab] =
    useState("Menunggu");

  const [dataIzin, setDataIzin] =
    useState<any[]>([]);

  async function loadIzin() {
    const { data, error } =
      await supabase
        .from("izin")
        .select(`
        *,
        siswa (
          nama,
          foto_url
        )
      `)
        .eq("status", activeTab)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    console.log(
      JSON.stringify(data, null, 2)
    );

    setDataIzin(data || []);
  }

  useEffect(() => {
    loadIzin();
  }, [activeTab]);

  async function setujui(id: number) {
    await supabase
      .from("izin")
      .update({
        status: "Disetujui",
      })
      .eq("id", id);

    loadIzin();
  }

  async function tolak(id: number) {
    await supabase
      .from("izin")
      .update({
        status: "Ditolak",
      })
      .eq("id", id);

    loadIzin();
  }

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Persetujuan Izin" />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* TAB */}
        <View style={styles.tabContainer}>
          {[
            "Menunggu",
            "Disetujui",
            "Ditolak",
          ].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tabButton,
                activeTab === item &&
                styles.activeTab,
              ]}
              onPress={() =>
                setActiveTab(item)
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === item &&
                  styles.activeText,
                ]}
              >
                {item}
                {item === "Menunggu"
                  ? " "
                  : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CARD IZIN */}
        {dataIzin.length === 0 && (
          <View
            style={{
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <Text>
              Tidak ada data izin
            </Text>
          </View>
        )}

        {dataIzin.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <View
              style={styles.profileRow}
            >
              <Image
                source={{
                  uri: item.siswa?.foto_url
                }}
                style={styles.avatar}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 14,
                }}
              >
                <Text
                  style={styles.nama}
                >
                  {item.siswa?.nama}
                </Text>

                <Text
                  style={styles.kelas}
                >
                  Tidak ada data kelas
                </Text>
              </View>

              <View
                style={styles.badge}
              >
                <Text
                  style={styles.badgeText}
                >
                  {item.jenis}
                </Text>
              </View>
            </View>

            <View
              style={styles.dateRow}
            >
              <Text
                style={styles.date}
              >
                📅 {item.tanggal}
              </Text>
            </View>

            <Text
              style={styles.alasan}
            >
              {item.alasan}
            </Text>

            {item.lampiran_nama && (
              <Text
                style={{
                  marginTop: 8,
                  color: "#3046E6",
                  fontSize: 13,
                }}
              >
                📎 {item.lampiran_nama}
              </Text>
            )}

            <View
              style={{
                marginTop: 12,
                alignSelf: "flex-start",
                backgroundColor:
                  item.status === "Disetujui"
                    ? "#DCFCE7"
                    : item.status === "Ditolak"
                      ? "#FEE2E2"
                      : "#FEF3C7",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color:
                    item.status === "Disetujui"
                      ? "#16A34A"
                      : item.status === "Ditolak"
                        ? "#DC2626"
                        : "#D97706",
                  fontWeight: "600",
                }}
              >
                {item.status}
              </Text>
            </View>

            {item.lampiran_url &&
              (
                item.lampiran_url
                  .toLowerCase()
                  .match(/\.(jpg|jpeg|png|webp)$/)
              ) && (
                <Image
                  source={{
                    uri: item.lampiran_url,
                  }}
                  style={styles.lampiran}
                />
              )}
            {item.lampiran_url &&
              !item.lampiran_url
                .toLowerCase()
                .match(/\.(jpg|jpeg|png|webp)$/) && (
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={() =>
                    Linking.openURL(
                      item.lampiran_url
                    )
                  }
                >
                  <Text style={styles.fileText}>
                    📄 Buka Lampiran
                  </Text>
                </TouchableOpacity>
              )}

            {item.status === "Menunggu" && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => tolak(item.id)}
                >
                  <Text style={styles.rejectText}>
                    Tolak
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => setujui(item.id)}
                >
                  <Text style={styles.approveText}>
                    Setujui
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <View
          style={{ height: 120 }}
        />
      </ScrollView >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F3F8",
  },

  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 5,
    elevation: 3,
  },

  tabButton: {
    flex: 1,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: "#4C5DF4",
  },

  tabText: {
    color: "#555",
    fontFamily: "Poppins_500Medium",
  },

  activeText: {
    color: "#FFF",
  },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 22,
    padding: 18,
    elevation: 3,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 15,
  },

  nama: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
  },

  kelas: {
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },

  badge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },

  dateRow: {
    marginTop: 16,
  },

  date: {
    color: "#666",
    fontFamily: "Poppins_500Medium",
  },

  alasan: {
    marginTop: 12,
    color: "#444",
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
  },

  lampiran: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    marginTop: 15,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  rejectBtn: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 8,
  },

  rejectText: {
    color: "#DC2626",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  approveBtn: {
    flex: 2,
    height: 52,
    backgroundColor: "#16A34A",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  approveText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  fileButton: {
    marginTop: 15,

    height: 50,

    backgroundColor: "#EEF2FF",

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  fileText: {
    color: "#3046E6",
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
});