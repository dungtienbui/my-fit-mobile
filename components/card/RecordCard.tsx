// components/RecordCard.tsx
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import React from "react";
import {
  DimensionValue,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RecordCardProps = {
  value: string;
  datetime: string;
  recordType: string;
  width?: DimensionValue;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const RecordCard = ({
  value,
  datetime,
  recordType,
  width = "80%",
  onLongPress,
}: RecordCardProps) => {
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.65}
      style={[styles.card, { width: width }, shadow.shap]}
    >
      <View style={styles.leadingTextContainer}>
        <Text style={styles.type}>{recordType}</Text>
        <Text style={styles.datetime}>{datetime}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
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
    marginHorizontal: 5,
    marginVertical: 8,
  },
  leadingTextContainer: {
    gap: 5,
  },
  value: {
    ...fonts.titleMedium,
  },
  type: {
    ...fonts.titleMedium,
  },
  datetime: {
    ...fonts.bodyMedium,
  },
});

export default RecordCard;
