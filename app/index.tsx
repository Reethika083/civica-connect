import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import GlowCard from "@/components/GlowCard";
import { getScores, getCompletionPercent, UserScore } from "@/lib/services/score_manager";

export default function HomeScreen() {
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

  const completionPercent = scores ? getCompletionPercent(scores) : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 20,
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(600)}>
          <LinearGradient
            colors={["rgba(139, 92, 246, 0.15)", "rgba(139, 92, 246, 0.02)"]}
            style={styles.headerGradient}
          >
            <View style={styles.logoRow}>
              <LinearGradient
                colors={[Colors.dark.primaryDark, Colors.dark.primary]}
                style={styles.logoIcon}
              >
                <Ionicons name="shield-checkmark" size={28} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.appTitle}>Civica Connect</Text>
            <Text style={styles.appSubtitle}>
              Interactive Legal Awareness & Simulation
            </Text>

            {scores && scores.totalXP > 0 && (
              <View style={styles.xpRow}>
                <Ionicons name="flash" size={16} color={Colors.dark.accent} />
                <Text style={styles.xpText}>{scores.totalXP} XP</Text>
                <View style={styles.xpDot} />
                <Ionicons name="pie-chart" size={14} color={Colors.dark.textSecondary} />
                <Text style={styles.xpText}>{completionPercent}% Complete</Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={styles.sectionTitle}>Choose Your Mode</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <GlowCard
            title="Student Mode"
            subtitle="Academic simulations of FIR, Arrest & Remand procedures with scoring"
            icon="school"
            onPress={() => router.push("/student")}
            gradient={[Colors.dark.primaryDark, "#9333EA"]}
            badge="Advanced"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <GlowCard
            title="Citizen Mode"
            subtitle="Learn your basic rights, do's & don'ts, and test your legal knowledge"
            icon="people"
            onPress={() => router.push("/citizen")}
            gradient={["#2563EB", "#3B82F6"]}
            badge="Beginner"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <GlowCard
            title="AR Experience"
            subtitle="Augmented reality simulation of legal procedures (Coming Soon)"
            icon="cube"
            onPress={() => router.push("/ar-demo")}
            gradient={["#059669", "#10B981"]}
            badge="Preview"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <View style={styles.aboutSection}>
            <View style={styles.aboutHeader}>
              <Ionicons name="information-circle" size={20} color={Colors.dark.primary} />
              <Text style={styles.aboutTitle}>About Civica Connect</Text>
            </View>
            <Text style={styles.aboutText}>
              Civica Connect is an interactive legal awareness application designed to educate 
              students and citizens about their fundamental rights, criminal procedures, and the 
              justice system. Through gamified simulations and quizzes, users gain practical 
              knowledge about FIR registration, arrest procedures, and magistrate remand processes.
            </Text>
            <View style={styles.aboutStats}>
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatValue}>15+</Text>
                <Text style={styles.aboutStatLabel}>Scenarios</Text>
              </View>
              <View style={styles.aboutStatDivider} />
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatValue}>6</Text>
                <Text style={styles.aboutStatLabel}>Rights</Text>
              </View>
              <View style={styles.aboutStatDivider} />
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatValue}>3</Text>
                <Text style={styles.aboutStatLabel}>Simulations</Text>
              </View>
            </View>
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
  headerGradient: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
  },
  logoRow: {
    marginBottom: 16,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: Colors.dark.text,
    textAlign: "center",
  },
  appSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  xpText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  xpDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.textMuted,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  aboutSection: {
    marginTop: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    backgroundColor: Colors.dark.surface,
    padding: 20,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  aboutTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.dark.text,
  },
  aboutText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(139, 92, 246, 0.06)",
    borderRadius: 14,
    paddingVertical: 14,
  },
  aboutStat: {
    alignItems: "center",
  },
  aboutStatValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: Colors.dark.primary,
  },
  aboutStatLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  aboutStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.dark.cardBorder,
  },
});
