import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import React from "react";
import {
  DimensionValue,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatusCellProps = {
  type: string;
  values: {
    value: string;
    unit: string;
  }[];
  image: ImageSourcePropType;
  size?: DimensionValue;
};

const StatusCell = ({ type, values, image, size = 150 }: StatusCellProps) => {
  return (
    <View
      style={[styles.container, { width: size, height: size }, shadow.medium]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.type}>{type}</Text>
        <FlatList
          data={values}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.unit}>{item.unit}</Text>
            </Text>
          )}
          horizontal={true}
          ItemSeparatorComponent={() => (
            <Text style={{ marginTop: 8, marginHorizontal: 2 }}>&</Text>
          )}
        />
      </View>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  textContainer: {
    width: "80%",
  },
  image: {
    height: "40%",
  },
  type: {
    ...fonts.labelLarge,
  },
  value: {
    ...fonts.titleLarge,
    color: colors.secondary2,
  },
  unit: {
    ...fonts.bodyMedium,
    color: colors.tertiary1,
  },
});

export default StatusCell;
