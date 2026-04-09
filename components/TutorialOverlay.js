import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const TABS = [
  { index: 0, label: "Home", color: "#ff6b35", icon: "home", title: "Your Command Center", description: "See live stats, AI post suggestions, and your upcoming content queue. Tap Edit to customize which stats appear on your dashboard." },
  { index: 1, label: "Library", color: "#4ecdc4", icon: "images", title: "Content Library", description: "All your photos and videos are automatically grouped into thematic clusters. The AI detects your content pillars and surfaces forgotten content from past adventures." },
  { index: 2, label: "Create", color: "#a78bfa", icon: "add-circle", title: "AI Post Builder", description: "The AI selects your best photos, arranges them for maximum virality, writes captions in your voice, and prepares your post for Instagram and TikTok." },
  { index: 3, label: "Analytics", color: "#f9ca24", icon: "bar-chart", title: "Growth Intelligence", description: "Track weekly, monthly and annual growth. Set follower goals and see the exact posting strategy required to hit them with an estimated timeline." },
  { index: 4, label: "Settings", color: "#ff6b35", icon: "settings", title: "Your Brand DNA", description: "Connect Instagram, TikTok and your photo library. Define your content pillars, set your posting cadence, and manage your subscription." },
];

const TAB_WIDTH = width / 5;
const TAB_BAR_HEIGHT = 70;
const SPOTLIGHT_SIZE = 64;

export default function TutorialOverlay({ visible, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const tab = TABS[currentIndex];
  const isLast = currentIndex === TABS.length - 1;
  const tabCenterX = TAB_WIDTH * tab.index + TAB_WIDTH / 2;
  const spotlightLeft = tabCenterX - SPOTLIGHT_SIZE / 2;
  const spotlightTop = height - TAB_BAR_HEIGHT / 2 - SPOTLIGHT_SIZE / 2 - 8;
  const tooltipLeft = Math.min(Math.max(tabCenterX - 158, 16), width - 332);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>

        <View style={[styles.spotlightCutout, { left: spotlightLeft, top: spotlightTop, borderColor: tab.color }]}>
          <Ionicons name={tab.icon} size={28} color={tab.color} />
          <Text style={[styles.spotlightLabel, { color: tab.color }]}>{tab.label}</Text>
        </View>

        <View style={[styles.tooltipCard, { left: tooltipLeft, bottom: TAB_BAR_HEIGHT + 24, borderColor: tab.color + "60" }]}>
          <View style={[styles.tooltipDot, { backgroundColor: tab.color }]} />
          <Text style={styles.tooltipTitle}>{tab.title}</Text>
          <Text style={styles.tooltipDescription}>{tab.description}</Text>
          <View style={styles.tooltipFooter}>
            <Text style={styles.stepIndicator}>{currentIndex + 1} of {TABS.length}</Text>
            <View style={styles.tooltipButtons}>
              <TouchableOpacity onPress={onFinish}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, { backgroundColor: tab.color }]} onPress={() => isLast ? onFinish() : setCurrentIndex(currentIndex + 1)}>
                <Text style={styles.nextBtnText}>{isLast ? "Got it" : "Next"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dotsRow}>
            {TABS.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentIndex && { backgroundColor: tab.color, width: 20 }]} />
            ))}
          </View>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.88)" },
  spotlightCutout: {
    position: "absolute",
    width: SPOTLIGHT_SIZE,
    height: SPOTLIGHT_SIZE,
    borderRadius: SPOTLIGHT_SIZE / 2,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  spotlightLabel: { fontSize: 9, fontWeight: "800", marginTop: 2 },
  tooltipCard: { position: "absolute", width: 316, backgroundColor: "#1a1a2e", borderRadius: 20, padding: 20, borderWidth: 1 },
  tooltipDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 10 },
  tooltipTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  tooltipDescription: { color: "#aaa", fontSize: 14, lineHeight: 22, marginBottom: 20 },
  tooltipFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  stepIndicator: { color: "#555", fontSize: 12 },
  tooltipButtons: { flexDirection: "row", alignItems: "center", gap: 16 },
  skipText: { color: "#555", fontSize: 14 },
  nextBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  nextBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  dotsRow: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#333" },
});
