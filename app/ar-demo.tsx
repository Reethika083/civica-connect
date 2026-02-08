import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Colors from "@/constants/colors";
import CustomButton from "@/components/CustomButton";
import * as Haptics from "expo-haptics";

export default function ARDemoScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const steps = [
    {
      icon: "document-text" as const,
      title: "Step 1: FIR Filing",
      desc: "Citizen approaches police station to report a crime",
    },
    {
      icon: "hand-left" as const,
      title: "Step 2: Arrest Process",
      desc: "Officer informs grounds of arrest & rights",
    },
    {
      icon: "business" as const,
      title: "Step 3: Magistrate Hearing",
      desc: "Accused produced before magistrate within 24 hours",
    },
    {
      icon: "shield-checkmark" as const,
      title: "Step 4: Rights Exercised",
      desc: "Legal counsel accessed, family informed",
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 10 },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>AR Experience</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.centerContent}>
        <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.centerBlock}>
          <LinearGradient
            colors={["rgba(16, 185, 129, 0.15)", "rgba(16, 185, 129, 0.02)"]}
            style={styles.arIconContainer}
          >
            <Ionicons name="cube" size={48} color={Colors.dark.success} />
          </LinearGradient>
          <Text style={styles.arTitle}>AR Mode Coming Soon</Text>
          <Text style={styles.arSubtitle}>
            This demo shows simulated steps instead.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(400 + index * 100).duration(400)}
            >
              <View style={styles.stepCard}>
                <View style={styles.stepIconWrapper}>
                  <LinearGradient
                    colors={["rgba(139, 92, 246, 0.2)", "rgba(139, 92, 246, 0.05)"]}
                    style={styles.stepIcon}
                  >
                    <Ionicons name={step.icon} size={20} color={Colors.dark.primary} />
                  </LinearGradient>
                  {index < steps.length - 1 && (
                    <View style={styles.connector} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          style={[
            styles.bottomSection,
            {
              paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 20,
            },
          ]}
        >
          <View style={styles.noticeCard}>
            <Ionicons name="information-circle" size={18} color={Colors.dark.info} />
            <Text style={styles.noticeText}>
              The full AR experience will overlay these steps in an immersive 
              augmented reality environment on your device camera.
            </Text>
          </View>
          <View style={{ height: 16 }} />
          <CustomButton title="Back to Home" onPress={() => router.replace("/")} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: Colors.dark.text,
  },
  centerContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  arIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },
  arTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: Colors.dark.text,
  },
  arSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  stepsContainer: {
    flex: 1,
  },
  stepCard: {
    flexDirection: "row",
    marginBottom: 4,
  },
  stepIconWrapper: {
    alignItems: "center",
    marginRight: 14,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  connector: {
    width: 2,
    height: 28,
    backgroundColor: Colors.dark.cardBorder,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.dark.text,
  },
  stepDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  bottomSection: {
    paddingTop: 16,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.dark.infoDim,
    borderRadius: 14,
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
});
