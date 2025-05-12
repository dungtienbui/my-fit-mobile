import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  DimensionValue,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type TodayTargetCardProps = {
  typeTarget: string;
  target: string;
  todayValue: string;
  unit: string;
  image: ImageSourcePropType;
  width?: DimensionValue;
};

const TodayTargetCard = ({
  typeTarget,
  target,
  todayValue,
  unit,
  image,
  width = "80%",
}: TodayTargetCardProps) => {
  const targetNum = parseFloat(target);
  const valueNum = parseFloat(todayValue);
  const progress =
    targetNum > 0 ? Math.min((valueNum / targetNum) * 100, 100) : 0;
  return (
    <View style={[styles.card, { width: width }, shadow.medium]}>
      <View style={styles.leftSection}>
        <Image source={image} style={styles.icon} />
        <View style={styles.textGroup}>
          <Text style={styles.type}>{typeTarget}</Text>
          <Text style={styles.value}>
            {todayValue} / {target} {unit}
          </Text>
        </View>
      </View>
      <View style={styles.progressWrapper}>
        <AnimatedCircularProgress
          size={60}
          width={5}
          fill={progress}
          tintColor="#4CAF50"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#eee"
          rotation={0}
        >
          {(fill: number) => <Text style={styles.progressText}>{fill}%</Text>}
        </AnimatedCircularProgress>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  textGroup: {
    flex: 1,
  },
  type: {
    ...fonts.titleMedium,
  },
  value: {
    ...fonts.bodyLarge,
    marginTop: 4,
  },
  progressWrapper: {
    // marginLeft: 12,
  },
  progressText: {
    ...fonts.bodyMedium,
    color: "#4CAF50",
  },
});

export default TodayTargetCard;
