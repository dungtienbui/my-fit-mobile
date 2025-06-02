import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import React from "react";
import {
  DimensionValue,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type TodayTargetCardProps = {
  typeTarget: string;
  target: string;
  todayValue: string;
  unit: string;
  image: ImageSourcePropType;
  width?: DimensionValue;
  isGoalSet?: boolean;
};

const TodayTargetCard = ({
  typeTarget,
  target,
  todayValue,
  unit,
  image,
  width = "80%",
  isGoalSet,
}: TodayTargetCardProps) => {
  const targetNum = parseFloat(target);
  const valueNum = parseFloat(todayValue);
  const progress =
    targetNum > 0 ? Math.min(Math.round((valueNum / targetNum) * 100), 100) : 0;

  // console.warn("progress: ", progress);
  return (
    <View style={[styles.card, { width: width }, shadow.medium]}>
      <View style={styles.leftSection}>
        <Image source={image} style={styles.icon} />
        <View style={styles.textGroup}>
          <Text style={styles.type}>{typeTarget}</Text>
          <Text style={styles.value}>
            {isGoalSet === false ? (
              <Text>
                {todayValue} {unit}{" "}
                {
                  <Text
                    style={{ ...fonts.bodyMedium, color: colors.tertiary3 }}
                  >
                    {" "}
                    / No goal
                  </Text>
                }
              </Text>
            ) : (
              <Text>
                {todayValue} / {target} {unit}
              </Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.progressWrapper}>
        <AnimatedCircularProgress
          size={60}
          width={5}
          fill={progress}
          tintColor="#4CAF50"
          // onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#eee"
          rotation={0}
        >
          {(fill: number) => (
            <Text
              style={[
                styles.progressText,
                { color: isGoalSet == false ? "black" : "#4CAF50" },
              ]}
            >
              {isGoalSet === false ? "N/A" : `${fill.toFixed(1)}%`}
            </Text>
          )}
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
    width: 50,
    height: 50,
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
  },
});

export default TodayTargetCard;
