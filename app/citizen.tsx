import React from "react";
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
import CustomButton from "@/components/CustomButton";
import { getCitizenRights, getDosAndDonts } from "@/lib/services/decision_engine";
import * as Haptics from "expo-haptics";

export default function CitizenScreen() {
  const insets = useSafeAreaInsets();
  const rights = getCitizenRights();
  const dosAndDonts = getDosAndDonts();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

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
              <Text style={styles.headerTitle}>Citizen Mode</Text>
              <Text style={styles.headerSubtitle}>
                Know Your Rights
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>Your Fundamental Rights</Text>
          {rights.map((right, index) => (
            <View key={right.id} style={styles.rightCard}>
              <LinearGradient
                colors={["rgba(139, 92, 246, 0.08)", "rgba(139, 92, 246, 0.02)"]}
                style={styles.rightGradient}
              >
                <View style={styles.rightHeader}>
                  <View style={styles.rightNumber}>
                    <Text style={styles.rightNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.articleBadge}>
                    <Text style={styles.articleBadgeText}>{right.article}</Text>
                  </View>
                </View>
                <Text style={styles.rightTitle}>{right.title}</Text>
                <Text style={styles.rightDescription}>{right.description}</Text>
              </LinearGradient>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionTitle}>Do's</Text>
          <View style={styles.listCard}>
            {dosAndDonts.dos.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={Colors.dark.success}
                />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.sectionTitle}>Don'ts</Text>
          <View style={styles.listCard}>
            {dosAndDonts.donts.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.dark.error}
                />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.quizSection}>
          <LinearGradient
            colors={[Colors.dark.primaryDark, Colors.dark.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.quizBanner}
          >
            <Ionicons name="help-circle" size={28} color="#fff" />
            <View style={styles.quizBannerText}>
              <Text style={styles.quizBannerTitle}>
                Test Your Knowledge
              </Text>
              <Text style={styles.quizBannerSubtitle}>
                5 questions to earn your citizen badge
              </Text>
            </View>
          </LinearGradient>
          <View style={{ height: 16 }} />
          <CustomButton
            title="Start Quiz"
            onPress={() => router.push("/citizen-quiz")}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 14,
    marginTop: 8,
  },
  rightCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    overflow: "hidden",
  },
  rightGradient: {
    padding: 16,
  },
  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rightNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.dark.accentDim,
    alignItems: "center",
    justifyContent: "center",
  },
  rightNumberText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.dark.primary,
  },
  articleBadge: {
    backgroundColor: Colors.dark.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  articleBadgeText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
    color: Colors.dark.primary,
  },
  rightTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  rightDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 19,
  },
  listCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  listText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 19,
  },
  quizSection: {
    marginTop: 8,
  },
  quizBanner: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  quizBannerText: {
    flex: 1,
  },
  quizBannerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  quizBannerSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});
