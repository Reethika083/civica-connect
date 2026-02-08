import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  interpolate,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import CustomButton from "@/components/CustomButton";
import * as Haptics from "expo-haptics";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

interface ScenarioStep {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  title: string;
  location: string;
  description: string;
  details: string[];
  articles: string[];
  characters: { role: string; action: string }[];
}

const SCENARIOS: ScenarioStep[] = [
  {
    icon: "document-text",
    label: "SCENE 1",
    title: "FIR Registration",
    location: "Police Station - Reception Desk",
    description:
      "A citizen enters the police station to report a robbery. The duty officer must register the First Information Report immediately under Section 154 CrPC.",
    details: [
      "Citizen narrates the incident verbally or in writing",
      "Duty officer writes the FIR in the prescribed format",
      "FIR is read back to the informant for confirmation",
      "Informant signs / thumbprints the FIR",
      "Free copy of FIR is provided to the informant",
    ],
    articles: ["Section 154 CrPC", "Section 166A IPC"],
    characters: [
      { role: "Citizen", action: "Reports robbery with details of time, place & suspects" },
      { role: "Duty Officer", action: "Records the FIR in the station diary and assigns case number" },
    ],
  },
  {
    icon: "search",
    label: "SCENE 2",
    title: "Investigation Begins",
    location: "Crime Scene - Market Area",
    description:
      "The investigating officer visits the crime scene to collect evidence. Proper chain of custody must be maintained for all evidence collected.",
    details: [
      "IO reaches the scene and cordons off the area",
      "Photographs and videos of the crime scene are taken",
      "Physical evidence (fingerprints, CCTV footage) is collected",
      "Witness statements are recorded under Section 161 CrPC",
      "Panchnama (scene inspection report) is prepared with witnesses",
    ],
    articles: ["Section 157 CrPC", "Section 161 CrPC"],
    characters: [
      { role: "IO (Inspector)", action: "Inspects crime scene and collects forensic evidence" },
      { role: "Panch Witness", action: "Signs the panchnama as an independent observer" },
    ],
  },
  {
    icon: "hand-left",
    label: "SCENE 3",
    title: "Arrest of Suspect",
    location: "Suspect's Residence",
    description:
      "Based on evidence, the police proceed to arrest the suspect. Constitutional safeguards under Article 22 must be followed during arrest.",
    details: [
      "Officer identifies themselves and shows warrant (if applicable)",
      "Suspect is informed of the grounds of arrest",
      "Suspect is informed of their right to legal counsel",
      "No unnecessary force or handcuffing without justification",
      "Arrest memo is prepared with date, time & witness",
      "Family member or friend is notified of the arrest",
    ],
    articles: ["Article 22(1)", "Section 41 CrPC", "D.K. Basu Guidelines"],
    characters: [
      { role: "Arresting Officer", action: "Reads the grounds of arrest and rights to the suspect" },
      { role: "Suspect", action: "Exercises right to remain silent and requests a lawyer" },
    ],
  },
  {
    icon: "business",
    label: "SCENE 4",
    title: "Magistrate Production",
    location: "District Court - Magistrate Chamber",
    description:
      "The arrested person must be produced before the nearest magistrate within 24 hours of arrest (excluding travel time), as mandated by Article 22(2).",
    details: [
      "Accused is produced before the magistrate within 24 hours",
      "Magistrate verifies the legality of the arrest",
      "Magistrate checks for signs of torture or ill-treatment",
      "Police may request custody remand (max 15 days)",
      "Magistrate decides: police custody, judicial custody, or bail",
      "Accused's right to legal counsel is ensured",
    ],
    articles: ["Article 22(2)", "Section 167 CrPC"],
    characters: [
      { role: "Magistrate", action: "Examines arrest legality and applies judicial mind to remand" },
      { role: "Defense Lawyer", action: "Argues for bail and challenges custody necessity" },
    ],
  },
  {
    icon: "shield-checkmark",
    label: "SCENE 5",
    title: "Rights & Safeguards",
    location: "Legal Aid Office / Jail",
    description:
      "Throughout the process, the accused retains fundamental rights. The Constitution guarantees protections even after arrest and during custody.",
    details: [
      "Right against self-incrimination (Article 20(3))",
      "Right to free legal aid if unable to afford (Article 39A)",
      "Right to be treated with dignity (Article 21)",
      "Right to medical examination on request",
      "Right to meet family and lawyer during custody",
      "Right to default bail if chargesheet not filed on time",
    ],
    articles: ["Article 20(3)", "Article 21", "Article 39A", "Section 167(2) CrPC"],
    characters: [
      { role: "Legal Aid Lawyer", action: "Provides free legal representation to the accused" },
      { role: "Accused", action: "Exercises all constitutional rights during detention" },
    ],
  },
];

function ScanLine() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(SCREEN_H * 0.35, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.scanLine, animStyle]}>
      <LinearGradient
        colors={["transparent", "rgba(139, 92, 246, 0.5)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.scanLineGradient}
      />
    </Animated.View>
  );
}

function PulsingDot({ delay, color }: { delay: number; color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.4, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.4, { duration: 800 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulsingDot, { backgroundColor: color }, animStyle]} />
  );
}

function GridOverlay() {
  return (
    <View style={styles.gridOverlay}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.gridLine,
            styles.gridHorizontal,
            { top: `${(i + 1) * 20}%` },
          ]}
        />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.gridLine,
            styles.gridVertical,
            { left: `${(i + 1) * 25}%` },
          ]}
        />
      ))}
    </View>
  );
}

function ARHud({
  step,
  total,
  scenarioTitle,
}: {
  step: number;
  total: number;
  scenarioTitle: string;
}) {
  return (
    <View style={styles.hudContainer}>
      <View style={styles.hudRow}>
        <View style={styles.hudBadge}>
          <View style={styles.hudDotLive} />
          <Text style={styles.hudBadgeText}>SIM ACTIVE</Text>
        </View>
        <View style={styles.hudBadge}>
          <Ionicons name="locate" size={12} color={Colors.dark.accent} />
          <Text style={styles.hudBadgeText}>{scenarioTitle}</Text>
        </View>
      </View>
      <View style={styles.hudProgressRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.hudProgressDot,
              i <= step && styles.hudProgressDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function CornerBrackets() {
  return (
    <>
      <View style={[styles.cornerBracket, styles.cornerTL]} />
      <View style={[styles.cornerBracket, styles.cornerTR]} />
      <View style={[styles.cornerBracket, styles.cornerBL]} />
      <View style={[styles.cornerBracket, styles.cornerBR]} />
    </>
  );
}

function CharacterMarker({ character, index }: { character: { role: string; action: string }; index: number }) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withDelay(
      index * 300,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 1000 }),
          withTiming(4, { duration: 1000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <Animated.View style={[styles.characterMarker, animStyle]}>
      <View style={styles.characterDot}>
        <Ionicons name="person" size={14} color="#fff" />
      </View>
      <View style={styles.characterInfo}>
        <Text style={styles.characterRole}>{character.role}</Text>
        <Text style={styles.characterAction}>{character.action}</Text>
      </View>
    </Animated.View>
  );
}

export default function ARDemoScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const scenario = SCENARIOS[currentStep];

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowDetails(false);
    if (currentStep < SCENARIOS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowDetails(false);
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const toggleDetails = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowDetails((v) => !v);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#060610", "#0D0D1A", "#0A0A14"]}
        style={StyleSheet.absoluteFill}
      />

      <GridOverlay />
      <ScanLine />
      <CornerBrackets />

      <View style={styles.dotField}>
        <PulsingDot delay={0} color="rgba(139, 92, 246, 0.4)" />
        <PulsingDot delay={400} color="rgba(16, 185, 129, 0.3)" />
        <PulsingDot delay={800} color="rgba(59, 130, 246, 0.3)" />
      </View>

      <View
        style={[
          styles.topBar,
          {
            paddingTop:
              (Platform.OS === "web" ? webTopInset : insets.top) + 8,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.dark.text} />
        </Pressable>
        <View style={styles.topBarCenter}>
          <View style={styles.arModeBadge}>
            <MaterialCommunityIcons
              name="cube-scan"
              size={16}
              color={Colors.dark.success}
            />
            <Text style={styles.arModeText}>AR SIMULATION</Text>
          </View>
        </View>
        <Pressable onPress={toggleDetails} style={styles.infoBtn}>
          <Ionicons
            name={showDetails ? "chevron-down" : "list"}
            size={20}
            color={Colors.dark.text}
          />
        </Pressable>
      </View>

      <ARHud
        step={currentStep}
        total={SCENARIOS.length}
        scenarioTitle={scenario.location}
      />

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={[
          styles.mainScrollContent,
          {
            paddingBottom:
              (Platform.OS === "web" ? webBottomInset : insets.bottom) + 90,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)} key={`scene-${currentStep}`}>
          <View style={styles.sceneHeader}>
            <View style={styles.sceneLabelRow}>
              <Text style={styles.sceneLabel}>{scenario.label}</Text>
              <View style={styles.sceneDivider} />
              <Text style={styles.sceneLocation}>
                <Ionicons name="location" size={11} color={Colors.dark.textMuted} />{" "}
                {scenario.location}
              </Text>
            </View>

            <LinearGradient
              colors={["rgba(139, 92, 246, 0.12)", "rgba(139, 92, 246, 0.03)"]}
              style={styles.sceneTitleCard}
            >
              <LinearGradient
                colors={[Colors.dark.primaryDark, Colors.dark.primary]}
                style={styles.sceneIconBg}
              >
                <Ionicons name={scenario.icon} size={26} color="#fff" />
              </LinearGradient>
              <Text style={styles.sceneTitle}>{scenario.title}</Text>
              <Text style={styles.sceneDesc}>{scenario.description}</Text>
            </LinearGradient>
          </View>

          <View style={styles.characterSection}>
            <Text style={styles.characterSectionTitle}>
              <Ionicons name="people" size={14} color={Colors.dark.primary} />
              {"  "}Participants Detected
            </Text>
            {scenario.characters.map((char, i) => (
              <CharacterMarker key={i} character={char} index={i} />
            ))}
          </View>

          <View style={styles.stepsSection}>
            <Text style={styles.stepsSectionTitle}>
              <Ionicons name="git-branch" size={14} color={Colors.dark.success} />
              {"  "}Procedure Steps
            </Text>
            {scenario.details.map((detail, i) => (
              <Animated.View
                key={i}
                entering={SlideInRight.delay(200 + i * 80).duration(350)}
              >
                <View style={styles.detailRow}>
                  <View style={styles.detailNumberBg}>
                    <Text style={styles.detailNumber}>{i + 1}</Text>
                  </View>
                  <Text style={styles.detailText}>{detail}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={styles.articlesSection}>
            <Text style={styles.articlesSectionTitle}>
              <Ionicons name="bookmark" size={14} color={Colors.dark.warning} />
              {"  "}Legal References
            </Text>
            <View style={styles.articlesRow}>
              {scenario.articles.map((art, i) => (
                <View key={i} style={styles.articleChip}>
                  <Text style={styles.articleChipText}>{art}</Text>
                </View>
              ))}
            </View>
          </View>

          {showDetails && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <View style={styles.detailsExpanded}>
                <Text style={styles.detailsExpandedTitle}>
                  Full Scenario Details
                </Text>
                <Text style={styles.detailsExpandedText}>
                  {scenario.description}
                </Text>
                <View style={styles.detailsDivider} />
                <Text style={styles.detailsExpandedText}>
                  This scene demonstrates the critical legal procedure that must
                  be followed at this stage. Any deviation from the prescribed
                  procedure can result in violations of fundamental rights and may
                  render the entire process unlawful.
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom:
              (Platform.OS === "web" ? webBottomInset : insets.bottom) + 14,
          },
        ]}
      >
        <Pressable
          onPress={handlePrev}
          disabled={currentStep === 0}
          style={[
            styles.navBtn,
            currentStep === 0 && styles.navBtnDisabled,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={currentStep === 0 ? Colors.dark.textMuted : Colors.dark.text}
          />
        </Pressable>

        <View style={styles.navCenter}>
          <Text style={styles.navSceneNum}>
            Scene {currentStep + 1} of {SCENARIOS.length}
          </Text>
        </View>

        <Pressable onPress={handleNext} style={styles.navBtnNext}>
          <LinearGradient
            colors={[Colors.dark.primaryDark, Colors.dark.primary]}
            style={styles.navBtnNextGradient}
          >
            <Text style={styles.navBtnNextText}>
              {currentStep < SCENARIOS.length - 1 ? "Next" : "Replay"}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060610",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(139, 92, 246, 0.04)",
  },
  gridHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    zIndex: 1,
  },
  scanLineGradient: {
    flex: 1,
  },
  cornerBracket: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "rgba(139, 92, 246, 0.4)",
    zIndex: 2,
  },
  cornerTL: {
    top: 80,
    left: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 80,
    right: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 80,
    left: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 80,
    right: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  dotField: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 60,
    zIndex: 1,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
  },
  arModeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  arModeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: Colors.dark.success,
    letterSpacing: 1,
  },
  infoBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  hudContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    zIndex: 10,
  },
  hudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  hudBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  hudDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.success,
  },
  hudBadgeText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
    color: Colors.dark.textSecondary,
    letterSpacing: 0.5,
  },
  hudProgressRow: {
    flexDirection: "row",
    gap: 4,
  },
  hudProgressDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  hudProgressDotActive: {
    backgroundColor: Colors.dark.primary,
  },
  mainScroll: {
    flex: 1,
    zIndex: 10,
  },
  mainScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sceneHeader: {
    marginBottom: 20,
  },
  sceneLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sceneLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: Colors.dark.primary,
    letterSpacing: 1.5,
  },
  sceneDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.dark.cardBorder,
  },
  sceneLocation: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: Colors.dark.textMuted,
  },
  sceneTitleCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
    alignItems: "center",
  },
  sceneIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  sceneTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: Colors.dark.text,
    textAlign: "center",
  },
  sceneDesc: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  characterSection: {
    marginBottom: 20,
  },
  characterSectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: Colors.dark.text,
    marginBottom: 10,
  },
  characterMarker: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
    gap: 10,
  },
  characterDot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.dark.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  characterInfo: {
    flex: 1,
  },
  characterRole: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: Colors.dark.primary,
  },
  characterAction: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
  stepsSection: {
    marginBottom: 20,
  },
  stepsSectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: Colors.dark.text,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.08)",
  },
  detailNumberBg: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailNumber: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: Colors.dark.success,
  },
  detailText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  articlesSection: {
    marginBottom: 16,
  },
  articlesSectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: Colors.dark.text,
    marginBottom: 10,
  },
  articlesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  articleChip: {
    backgroundColor: Colors.dark.warningDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.15)",
  },
  articleChipText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    color: Colors.dark.warning,
  },
  detailsExpanded: {
    backgroundColor: "rgba(139, 92, 246, 0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
    padding: 16,
    marginBottom: 16,
  },
  detailsExpandedTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  detailsExpandedText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: Colors.dark.cardBorder,
    marginVertical: 12,
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "rgba(6, 6, 16, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 92, 246, 0.08)",
    zIndex: 10,
    gap: 10,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navCenter: {
    flex: 1,
    alignItems: "center",
  },
  navSceneNum: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  navBtnNext: {
    borderRadius: 14,
    overflow: "hidden",
  },
  navBtnNextGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  navBtnNextText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
