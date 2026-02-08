import React from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import * as Haptics from "expo-haptics";

interface ChoiceCardProps {
  label: string;
  text: string;
  selected: boolean;
  isCorrect?: boolean | null;
  isRevealed: boolean;
  onPress: () => void;
  disabled: boolean;
}

export default function ChoiceCard({
  label,
  text,
  selected,
  isCorrect,
  isRevealed,
  onPress,
  disabled,
}: ChoiceCardProps) {
  const getBorderColor = () => {
    if (!isRevealed) {
      return selected ? Colors.dark.primary : Colors.dark.cardBorder;
    }
    if (isCorrect === true) return Colors.dark.success;
    if (selected && isCorrect === false) return Colors.dark.error;
    return Colors.dark.cardBorder;
  };

  const getBackgroundColor = () => {
    if (!isRevealed) {
      return selected
        ? "rgba(139, 92, 246, 0.1)"
        : Colors.dark.surface;
    }
    if (isCorrect === true) return Colors.dark.successDim;
    if (selected && isCorrect === false) return Colors.dark.errorDim;
    return Colors.dark.surface;
  };

  const getIconName = (): keyof typeof Ionicons.glyphMap | null => {
    if (!isRevealed) return null;
    if (isCorrect === true) return "checkmark-circle";
    if (selected && isCorrect === false) return "close-circle";
    return null;
  };

  const getIconColor = () => {
    if (isCorrect === true) return Colors.dark.success;
    return Colors.dark.error;
  };

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const iconName = getIconName();

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            {
              color: isRevealed
                ? isCorrect === true
                  ? Colors.dark.success
                  : selected && isCorrect === false
                    ? Colors.dark.error
                    : Colors.dark.textMuted
                : selected
                  ? Colors.dark.primary
                  : Colors.dark.textMuted,
            },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text style={styles.text}>{text}</Text>
      {iconName && (
        <Ionicons
          name={iconName}
          size={22}
          color={getIconColor()}
          style={styles.icon}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  labelContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  text: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 20,
  },
  icon: {
    marginLeft: 8,
  },
});
