import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    router.replace("/(auth)/login");
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Swiper
        loop={false}
        showsPagination={true}
        autoplay
        autoplayTimeout={3}
        activeDotColor={colors.primary1}
        paginationStyle={{ marginBottom: 30 }}
      >
        <ImageBackground
          source={require("../assets/images/background.png")}
          style={styles.container}
        >
          <Image
            source={require("../assets/images/Illustration1.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <View style={styles.DescriptionContainer}>
            <Text style={styles.header}>Welcome to MyFIT!</Text>
            <Text style={styles.headline}>
              Start your healthy living journey with MyFIT
            </Text>
            <Text style={styles.description}>
              Your trusted companion in tracking your personal health
            </Text>
          </View>
        </ImageBackground>

        <ImageBackground
          source={require("../assets/images/background.png")}
          style={styles.container}
        >
          <Image
            source={require("../assets/images/Illustration2.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <View style={styles.DescriptionContainer}>
            <Text style={styles.header}>Daily health tracking</Text>
            <Text style={styles.headline}>Health at your fingertips</Text>
            <Text style={styles.description}>
              Record your steps, sleep duration, calories burned, and weight to
              stay on top of your health every day
            </Text>
          </View>
        </ImageBackground>

        <ImageBackground
          source={require("../assets/images/background.png")}
          style={styles.container}
        >
          <Image
            source={require("../assets/images/Illustration3.png")}
            resizeMode="contain"
            style={styles.logo}
          />
          <View style={styles.DescriptionContainer}>
            <Text style={styles.header}>Set goals & get reminders</Text>
            <Text style={styles.headline}>Achieve your goals</Text>
            <Text style={styles.description}>
              Set personal goals and receive reminder notifications to stay
              motivated and work towards a healthy lifestyle
            </Text>
          </View>
          <Pressable
            onPressIn={() => setIsHovered(true)} // Sự kiện khi nhấn vào phần tử
            onPressOut={() => setIsHovered(false)} // Sự kiện khi nhả tay khỏi phần tử
            onPress={handleFinish}
            style={[styles.button, isHovered && styles.hovered]} // Áp dụng style khi hover hoặc nhấn
          >
            <Text style={styles.buttonText}>Start now!</Text>
          </Pressable>
        </ImageBackground>
      </Swiper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "25%",
  },
  logo: {
    width: 250,
    height: 250,
  },
  DescriptionContainer: {
    width: "80%",
    marginTop: 30,
    marginBottom: 20,
  },
  header: {
    ...fonts.titleLarge,
    fontFamily: "Roboto_500Medium",
    textAlign: "center",
    marginBottom: 10,
  },
  headline: {
    ...fonts.titleMedium,
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    ...fonts.bodyMedium,
    textAlign: "center",
  },
  button: {
    width: "80%",
    padding: 10,
    backgroundColor: "#38CE38",
    borderRadius: 999,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  hovered: {
    opacity: 0.5,
  },
});
