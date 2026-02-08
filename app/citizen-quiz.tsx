import React, { useState, useCallback } from "react";
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
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import Colors from "@/constants/colors";
import ChoiceCard from "@/components/ChoiceCard";
import CustomButton from "@/components/CustomButton";
import { getCitizenQuiz, Question } from "@/lib/services/decision_engine";
import * as Haptics from "expo-haptics";

export default function CitizenQuizScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;
  const questions = getCitizenQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

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
    const correctOption = currentQuestion.options.find((o) => o.correct);
    const correct = selectedId === correctOption?.id;
    setIsCorrectAnswer(correct);
    setExplanation(currentQuestion.explanation);
    setRevealed(true);

    if (correct) {
      setCorrectCount((c) => c + 1);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [selectedId, currentQuestion]);

  const currentCorrect = correctCount + (revealed && isCorrectAnswer ? 1 : 0);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      if (isCorrectAnswer && revealed) {
        setCorrectCount((c) => c);
      }
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setRevealed(false);
      setIsCorrectAnswer(false);
      setExplanation("");
    }
  }, [currentIndex, questions.length, isCorrectAnswer, revealed]);

  const handleFinish = useCallback(() => {
    const finalCorrect = correctCount + (isCorrectAnswer ? 1 : 0);
    router.replace({
      pathname: "/citizen-results",
      params: {
        correct: finalCorrect.toString(),
        total: questions.length.toString(),
      },
    });
  }, [correctCount, isCorrectAnswer, questions.length]);

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

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
          <Ionicons name="people" size={14} color={Colors.dark.info} />
          <Text style={[styles.xpBadgeText, { color: Colors.dark.info }]}>
            Citizen Quiz
          </Text>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <LinearGradient
          colors={["#2563EB", "#3B82F6"]}
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
          <Text style={styles.questionText}>
            {currentQuestion.question || currentQuestion.scenario}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => {
              const optionLabel = option.id.toUpperCase();
              return (
                <ChoiceCard
                  key={option.id}
                  label={optionLabel}
                  text={option.text}
                  selected={selectedId === option.id}
                  isCorrect={revealed ? option.correct : null}
                  isRevealed={revealed}
                  onPress={() => handleSelect(option.id)}
                  disabled={revealed}
                />
              );
            })}
          </View>

          {revealed && (
            <Animated.View entering={FadeIn.duration(400)}>
              <View
                style={[
                  styles.feedbackBox,
                  {
                    backgroundColor: isCorrectAnswer
                      ? Colors.dark.successDim
                      : Colors.dark.errorDim,
                    borderColor: isCorrectAnswer
                      ? Colors.dark.success
                      : Colors.dark.error,
                  },
                ]}
              >
                <View style={styles.feedbackHeader}>
                  <Ionicons
                    name={isCorrectAnswer ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={isCorrectAnswer ? Colors.dark.success : Colors.dark.error}
                  />
                  <Text
                    style={[
                      styles.feedbackTitle,
                      {
                        color: isCorrectAnswer
                          ? Colors.dark.success
                          : Colors.dark.error,
                      },
                    ]}
                  >
                    {isCorrectAnswer ? "Correct!" : "Incorrect"}
                  </Text>
                </View>
                <Text style={styles.feedbackExplanation}>{explanation}</Text>
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
          <CustomButton title="See Your Badge" onPress={handleFinish} />
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
    backgroundColor: Colors.dark.infoDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  xpBadgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
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
  questionText: {
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
