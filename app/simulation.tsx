import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import Colors from "@/constants/colors";
import ChoiceCard from "@/components/ChoiceCard";
import CustomButton from "@/components/CustomButton";
import {
  getSimulationData,
  validateAnswer,
  SimulationType,
  ValidationResult,
} from "@/lib/services/decision_engine";
import * as Haptics from "expo-haptics";

export default function SimulationScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const simData = getSimulationData((type || "fir") as SimulationType);
  const questions = simData.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = useCallback(
    (optionId: string) => {
      if (revealed) return;
      setSelectedId(optionId);
    },
    [revealed]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedId || !currentQuestion) return;
    const validationResult = validateAnswer(currentQuestion, selectedId);
    setResult(validationResult);
    setRevealed(true);

    if (validationResult.isCorrect) {
      setCorrectCount((c) => c + 1);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      setIncorrectCount((c) => c + 1);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [selectedId, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setRevealed(false);
      setResult(null);
    } else {
      router.replace({
        pathname: "/results",
        params: {
          type: type || "fir",
          correct: (correctCount + (result?.isCorrect ? 0 : 0)).toString(),
          total: questions.length.toString(),
          finalCorrect: (
            correctCount + (result?.isCorrect ? 1 : 0)
          ).toString(),
        },
      });
    }
  }, [currentIndex, questions.length, type, correctCount, result]);

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const finalCorrectForNav =
    correctCount + (revealed && result?.isCorrect ? 1 : 0);

  const handleFinish = useCallback(() => {
    router.replace({
      pathname: "/results",
      params: {
        type: type || "fir",
        correct: finalCorrectForNav.toString(),
        total: questions.length.toString(),
        finalCorrect: finalCorrectForNav.toString(),
      },
    });
  }, [type, finalCorrectForNav, questions.length]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          { paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 10 },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={Colors.dark.text} />
        </Pressable>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>
            {currentIndex + 1} / {questions.length}
          </Text>
        </View>
        <View style={styles.xpBadge}>
          <Ionicons name="flash" size={14} color={Colors.dark.accent} />
          <Text style={styles.xpBadgeText}>
            {finalCorrectForNav * 20} XP
          </Text>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <LinearGradient
          colors={[Colors.dark.primaryDark, Colors.dark.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${progress}%` }]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)} key={currentIndex}>
          <View style={styles.simBadge}>
            <Ionicons name="book" size={14} color={Colors.dark.primary} />
            <Text style={styles.simBadgeText}>{simData.title}</Text>
          </View>

          <Text style={styles.scenarioText}>
            {currentQuestion.scenario || currentQuestion.question}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => {
              const optionLabel = option.id.toUpperCase();
              const isThisCorrect = option.correct;
              return (
                <ChoiceCard
                  key={option.id}
                  label={optionLabel}
                  text={option.text}
                  selected={selectedId === option.id}
                  isCorrect={revealed ? isThisCorrect : null}
                  isRevealed={revealed}
                  onPress={() => handleSelect(option.id)}
                  disabled={revealed}
                />
              );
            })}
          </View>

          {revealed && result && (
            <Animated.View entering={FadeIn.duration(400)}>
              <View
                style={[
                  styles.feedbackBox,
                  {
                    backgroundColor: result.isCorrect
                      ? Colors.dark.successDim
                      : Colors.dark.errorDim,
                    borderColor: result.isCorrect
                      ? Colors.dark.success
                      : Colors.dark.error,
                  },
                ]}
              >
                <View style={styles.feedbackHeader}>
                  <Ionicons
                    name={result.isCorrect ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={result.isCorrect ? Colors.dark.success : Colors.dark.error}
                  />
                  <Text
                    style={[
                      styles.feedbackTitle,
                      {
                        color: result.isCorrect
                          ? Colors.dark.success
                          : Colors.dark.error,
                      },
                    ]}
                  >
                    {result.isCorrect ? "Correct!" : "Incorrect"}
                  </Text>
                </View>
                <Text style={styles.feedbackExplanation}>
                  {result.explanation}
                </Text>
                {result.article && (
                  <View style={styles.articleTag}>
                    <Ionicons name="bookmark" size={12} color={Colors.dark.primary} />
                    <Text style={styles.articleText}>{result.article}</Text>
                  </View>
                )}
                {result.consequence && (
                  <View style={styles.consequenceBox}>
                    <Ionicons name="warning" size={14} color={Colors.dark.warning} />
                    <Text style={styles.consequenceText}>
                      {result.consequence}
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: (Platform.OS === "web" ? webBottomInset : insets.bottom) + 16,
          },
        ]}
      >
        {!revealed ? (
          <CustomButton
            title="Submit Answer"
            onPress={handleSubmit}
            disabled={!selectedId}
          />
        ) : currentIndex < questions.length - 1 ? (
          <CustomButton title="Next Question" onPress={handleNext} />
        ) : (
          <CustomButton title="View Results" onPress={handleFinish} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.dark.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  xpBadgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: Colors.dark.accent,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: Colors.dark.surfaceLight,
  },
  progressBarFill: {
    height: 3,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  simBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  simBadgeText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: Colors.dark.primary,
  },
  scenarioText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  feedbackBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  feedbackTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  feedbackExplanation: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  articleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.dark.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  articleText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    color: Colors.dark.primary,
  },
  consequenceBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.dark.warningDim,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  consequenceText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.cardBorder,
  },
});
