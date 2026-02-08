import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";
import GlowCard from "@/components/GlowCard";
import { getScores, UserScore } from "@/lib/services/score_manager";
import * as Haptics from "expo-haptics";

export default function StudentScreen() {
  const insets = useSafeAreaInsets();
  const [scores, setScores] = useState<UserScore | null>(null);
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    const s = await getScores();
    setScores(s);
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 10,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Colors.dark.text} />
            </Pressable>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Student Mode</Text>
              <Text style={styles.headerSubtitle}>
                Academic Legal Simulations
              </Text>
            </View>
          </View>
        </Animated.View>

        {scores && scores.totalXP > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <LinearGradient
              colors={["rgba(139, 92, 246, 0.12)", "rgba(139, 92, 246, 0.03)"]}
              style={styles.statsBar}
            >
              <View style={styles.statItem}>
                <Ionicons name="flash" size={16} color={Colors.dark.accent} />
                <Text style={styles.statValue}>{scores.totalXP}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.dark.success} />
                <Text style={styles.statValue}>{scores.totalCorrect}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="close-circle" size={16} color={Colors.dark.error} />
                <Text style={styles.statValue}>{scores.totalIncorrect}</Text>
                <Text style={styles.statLabel}>Incorrect</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionTitle}>Simulations</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(500)}>
          <GlowCard
            title="FIR Registration"
            subtitle="Learn how to properly register a First Information Report under CrPC"
            icon="document-text"
            onPress={() =>
              router.push({ pathname: "/simulation", params: { type: "fir" } })
            }
            gradient={["#7C3AED", "#A855F7"]}
            badge={scores?.firCompleted ? `${scores.firScore}%` : "5 Qs"}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <GlowCard
            title="Arrest Procedure"
            subtitle="Understand constitutional rights during arrest under Articles 21 & 22"
            icon="hand-left"
            onPress={() =>
              router.push({ pathname: "/simulation", params: { type: "arrest" } })
            }
            gradient={["#2563EB", "#3B82F6"]}
            badge={scores?.arrestCompleted ? `${scores.arrestScore}%` : "5 Qs"}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(500)}>
          <GlowCard
            title="Magistrate Remand"
            subtitle="Navigate remand procedures, custody limits, and bail rights under Section 167"
            icon="business"
            onPress={() =>
              router.push({ pathname: "/simulation", params: { type: "remand" } })
            }
            gradient={["#059669", "#10B981"]}
            badge={scores?.remandCompleted ? `${scores.remandScore}%` : "5 Qs"}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.infoBox}>
            <Ionicons name="bulb" size={18} color={Colors.dark.warning} />
            <Text style={styles.infoText}>
              Each simulation awards 20 XP per correct answer. Complete all three 
              to master criminal procedure law!
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: Colors.dark.text,
  },
  headerSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.dark.text,
  },
  statLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.dark.cardBorder,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.dark.warningDim,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 19,
  },
});
