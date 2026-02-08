import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Colors from "@/constants/colors";
import CustomButton from "@/components/CustomButton";
import ScoreCard from "@/components/ScoreCard";
import { SimulationType } from "@/lib/services/decision_engine";
import { updateSimulationScore } from "@/lib/services/score_manager";
import * as Haptics from "expo-haptics";

export default function ResultsScreen() {
  const { type, finalCorrect, total } = useLocalSearchParams<{
    type: string;
    finalCorrect: string;
    total: string;
  }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const correct = parseInt(finalCorrect || "0");
  const totalQ = parseInt(total || "5");
  const incorrect = totalQ - correct;
  const percentage = Math.round((correct / totalQ) * 100);
  const xpEarned = correct * 20;
  const simType = (type || "fir") as SimulationType;

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveResults();
    if (Platform.OS !== "web") {
      if (percentage >= 80) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, []);

  const saveResults = async () => {
    await updateSimulationScore(simType, correct, totalQ);
    setSaved(true);
  };

  const getTitle = () => {
    switch (simType) {
      case "fir":
        return "FIR Simulation";
      case "arrest":
        return "Arrest Simulation";
      case "remand":
        return "Remand Simulation";
    }
  };

  const getGrade = () => {
    if (percentage >= 90) return { label: "Outstanding", color: Colors.dark.success, icon: "trophy" as const };
    if (percentage >= 70) return { label: "Great Work", color: Colors.dark.primary, icon: "ribbon" as const };
    if (percentage >= 50) return { label: "Good Effort", color: Colors.dark.warning, icon: "thumbs-up" as const };
    return { label: "Keep Learning", color: Colors.dark.error, icon: "book" as const };
  };

  const grade = getGrade();

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
            style={styles.heroCard}
          >
            <View style={[styles.gradeIcon, { backgroundColor: `${grade.color}20` }]}>
              <Ionicons name={grade.icon} size={36} color={grade.color} />
            </View>
            <Text style={styles.gradeLabel}>{grade.label}</Text>
            <Text style={styles.simTitle}>{getTitle()} Complete</Text>
            <View style={styles.percentCircle}>
              <Text style={styles.percentValue}>{percentage}%</Text>
              <Text style={styles.percentLabel}>Score</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.scoreRow}>
            <ScoreCard
              title="XP Earned"
              value={`+${xpEarned}`}
              icon="flash"
              color={Colors.dark.accent}
            />
            <View style={{ width: 12 }} />
            <ScoreCard
              title="Correct"
              value={correct}
              icon="checkmark-circle"
              color={Colors.dark.success}
            />
            <View style={{ width: 12 }} />
            <ScoreCard
              title="Incorrect"
              value={incorrect}
              icon="close-circle"
              color={Colors.dark.error}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(500)}>
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Performance Summary</Text>
            {percentage >= 80 ? (
              <View style={styles.feedbackItem}>
                <Ionicons name="star" size={16} color={Colors.dark.success} />
                <Text style={styles.feedbackText}>
                  Excellent understanding of {getTitle()?.toLowerCase()} procedures!
                </Text>
              </View>
            ) : percentage >= 50 ? (
              <View style={styles.feedbackItem}>
                <Ionicons name="bulb" size={16} color={Colors.dark.warning} />
                <Text style={styles.feedbackText}>
                  Good progress! Review the explanations for questions you missed to strengthen your knowledge.
                </Text>
              </View>
            ) : (
              <View style={styles.feedbackItem}>
                <Ionicons name="refresh" size={16} color={Colors.dark.info} />
                <Text style={styles.feedbackText}>
                  Consider retrying this simulation. Focus on the constitutional articles and CrPC sections mentioned.
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).duration(500)} style={styles.buttonGroup}>
          <CustomButton
            title="Try Again"
            onPress={() =>
              router.replace({
                pathname: "/simulation",
                params: { type: simType },
              })
            }
            variant="outline"
          />
          <View style={{ height: 12 }} />
          <CustomButton
            title="Back to Student Mode"
            onPress={() => router.replace("/student")}
          />
          <View style={{ height: 12 }} />
          <CustomButton
            title="Home"
            onPress={() => router.replace("/")}
            variant="secondary"
          />
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
  heroCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
  },
  gradeIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gradeLabel: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: Colors.dark.text,
  },
  simTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  percentCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
  percentValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: Colors.dark.primary,
  },
  percentLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: Colors.dark.textMuted,
  },
  scoreRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  feedbackSection: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    padding: 18,
    marginBottom: 24,
  },
  feedbackTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  feedbackText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  buttonGroup: {
    marginTop: 4,
  },
});
