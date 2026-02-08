import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface ScoreCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  subtitle?: string;
}

export default function ScoreCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: ScoreCardProps) {
  const accentColor = color || Colors.dark.primary;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(139, 92, 246, 0.06)",
          "rgba(139, 92, 246, 0.01)",
        ]}
        style={styles.gradient}
      >
        <Ionicons
          name={icon}
          size={22}
          color={accentColor}
          style={styles.icon}
        />
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    overflow: "hidden",
  },
  gradient: {
    padding: 16,
    alignItems: "center",
  },
  icon: {
    marginBottom: 8,
  },
  value: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: Colors.dark.text,
  },
  title: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
});
