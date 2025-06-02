import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import React from "react";
import {
  DimensionValue,
  Image,
  ImageSourcePropType,
  ImageStyle,
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
  valuesPrintHorizontal?: boolean;
  image: ImageSourcePropType;
  size?: DimensionValue;
  joiner?: string;
  imageStyle?: ImageStyle | undefined;
};

const StatusCell = ({
  type,
  values,
  image,
  size = 150,
  joiner,
  valuesPrintHorizontal,
  imageStyle,
}: StatusCellProps) => {
  return (
    <View
      style={[styles.container, { width: size, height: size }, shadow.medium]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.type}>{type}</Text>
        {/* <FlatList
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
            <Text style={{ marginTop: 8, marginHorizontal: 2 }}>
              {joiner ?? "&"}
            </Text>
          )}
        /> */}
        <View
          style={{
            flexDirection: valuesPrintHorizontal === true ? "row" : "column",
          }}
        >
          {values.map((item, key) => {
            return (
              <Text key={`${item.unit}-${key}`}>
                <Text style={styles.value}>{item.value}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
                {valuesPrintHorizontal === true && key < values.length - 1 ? (
                  <Text style={{ ...fonts.bodySmall }}>{joiner}</Text>
                ) : undefined}
              </Text>
            );
          })}
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    marginBottom: 5,
    borderWidth: 0.2,
    borderColor: colors.tertiary2,
    paddingTop: 10,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  textContainer: {
    width: 120,
  },
  image: {
    height: 70,
    width: 80,
    marginTop: 10,
  },
  type: {
    ...fonts.labelLarge,
    marginBottom: 3,
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
