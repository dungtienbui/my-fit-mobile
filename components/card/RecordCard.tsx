// components/RecordCard.tsx
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import React from "react";
import { View, Text, StyleSheet, DimensionValue } from "react-native";

type RecordCardProps = {
  value: string;
  datetime: string;
  recordType: string;
  width?: DimensionValue;
};

const RecordCard = ({
  value,
  datetime,
  recordType,
  width = "80%",
}: RecordCardProps) => {
  return (
    <View style={[styles.card, { width: width }, shadow.medium]}>
      <View style={styles.leadingTextContainer}>
        <Text style={styles.type}>{recordType}</Text>
        <Text style={styles.datetime}>{datetime}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    margin: 5,
  },
  leadingTextContainer: {
    gap: 5,
  },
  value: {
    ...fonts.titleLarge,
  },
  type: {
    ...fonts.titleMedium,
  },
  datetime: {
    ...fonts.bodyMedium,
  },
});

export default RecordCard;
