import React, { useEffect } from "react";
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
import { updateCitizenScore } from "@/lib/services/score_manager";
import * as Haptics from "expo-haptics";

export default function CitizenResultsScreen() {
  const { correct, total } = useLocalSearchParams<{
    correct: string;
    total: string;
  }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const correctNum = parseInt(correct || "0");
  const totalNum = parseInt(total || "5");
  const incorrect = totalNum - correctNum;
  const percentage = Math.round((correctNum / totalNum) * 100);
  const xpEarned = correctNum * 15;

  const getBadge = () => {
    if (percentage >= 80)
      return { name: "Legal Eagle", icon: "shield-checkmark" as const, color: Colors.dark.success };
    if (percentage >= 60)
      return { name: "Aware Citizen", icon: "people" as const, color: Colors.dark.info };
    return { name: "Learner", icon: "book" as const, color: Colors.dark.warning };
  };

  const badge = getBadge();

  useEffect(() => {
    saveResults();
    if (Platform.OS !== "web" && percentage >= 60) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const saveResults = async () => {
    await updateCitizenScore(correctNum, totalNum);
  };

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
            <View
              style={[
                styles.badgeIcon,
                { backgroundColor: `${badge.color}20` },
              ]}
            >
              <Ionicons name={badge.icon} size={40} color={badge.color} />
            </View>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeSubtitle}>Badge Earned!</Text>
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
              value={correctNum}
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
          <View style={styles.messageCard}>
            <Ionicons name="bulb" size={20} color={Colors.dark.warning} />
            <Text style={styles.messageText}>
              {percentage >= 80
                ? "Outstanding! You have excellent awareness of your legal rights. Share this knowledge with others!"
                : percentage >= 60
                  ? "Good work! You have a solid understanding. Review the areas you missed to become even more informed."
                  : "Keep learning! Understanding your rights is crucial. Try again to improve your score."}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).duration(500)} style={styles.buttonGroup}>
          <CustomButton
            title="Try Again"
            onPress={() => router.replace("/citizen-quiz")}
            variant="outline"
          />
          <View style={{ height: 12 }} />
          <CustomButton
            title="Back to Citizen Mode"
            onPress={() => router.replace("/citizen")}
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
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  badgeName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: Colors.dark.text,
  },
  badgeSubtitle: {
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
    borderColor: Colors.dark.info,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.infoDim,
  },
  percentValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: Colors.dark.info,
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
  messageCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    padding: 18,
    marginBottom: 24,
  },
  messageText: {
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
