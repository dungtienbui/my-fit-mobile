import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";

export default function Onboarding() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    router.replace("/(auth)/login");
  };

  return (
    <Swiper loop={false} showsPagination={true}>
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
          <Text style={styles.header}>Chào mừng đến với MyFIT</Text>
          <Text style={styles.headline}>
            Bắt đầu hành trình sống khỏe cùng MyFIT
          </Text>
          <Text style={styles.description}>
            Người bạn đồng hành tin cậy trong việc theo dõi sức khoẻ cá nhân của
            bạn.
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
          <Text style={styles.header}>Theo dõi sức khoẻ hàng ngày</Text>
          <Text style={styles.headline}>Sức khoẻ trong tầm tay</Text>
          <Text style={styles.description}>
            Ghi nhận số bước, thời gian ngủ, lượng calo tiêu thụ và cân nặng để
            bạn luôn nắm bắt tình trạng sức khoẻ mỗi ngày.
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
          <Text style={styles.header}>Đặt mục tiêu & Nhắc nhở</Text>
          <Text style={styles.headline}>Chinh phục mục tiêu</Text>
          <Text style={styles.description}>
            Đặt mục tiêu cá nhân và nhận thông báo nhắc nhở để duy trì động lực
            và hướng tới lối sống lành mạnh.
          </Text>
        </View>
        <Pressable
          onPressIn={() => setIsHovered(true)} // Sự kiện khi nhấn vào phần tử
          onPressOut={() => setIsHovered(false)} // Sự kiện khi nhả tay khỏi phần tử
          onPress={handleFinish}
          style={[styles.button, isHovered && styles.hovered]} // Áp dụng style khi hover hoặc nhấn
        >
          <Text style={styles.buttonText}>Bắt đầu ngay!</Text>
        </Pressable>
      </ImageBackground>
    </Swiper>
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
    marginTop: 10,
    marginBottom: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 23,
  },
  headline: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: "200",
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
