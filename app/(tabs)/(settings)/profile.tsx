import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { setUserInfo } from "@/store/features/user/userSlice";
import {
  useEditUserMutation,
  useGetUserQuery,
} from "@/store/services/apis/userApi";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch();
  const [isFocusInput, setIsFocusInput] = useState(false);
  const { data: userInfo, error, isLoading } = useGetUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      error: updateUserError,
      isLoading: updateUserIsLoading,
    },
  ] = useEditUserMutation();

  const [userInput, setUserInput] = useState<{
    email?: string;
    name?: string;
    age?: string;
    address?: string;
    gender?: string;
    height?: string;
    weight?: string;
  }>({});

  useEffect(() => {
    if (userInfo) {
      setUserInput({
        ...userInfo,
        age: userInfo.age?.toString(),
        height: userInfo.height?.toString(),
        weight: userInfo.weight?.toString(),
      });

      dispatch(
        setUserInfo({
          ...userInfo,
        })
      );
    }
  }, [userInfo]);

  useEffect(() => {
    if (updateUserError) {
      Toast.show({
        text1: "Update error!",
        text2: "Sorry. Some thing wrong!",
        type: "error",
      });
    }
  }, [updateUserError]);

  useEffect(() => {
    if (updateUserData) {
      Toast.show({
        text1: "Success",
        text2: "Your profile has been updated successfully.",
        type: "success",
      });
      console.log("updateUserData: ", updateUserData);

      router.back();
    }
  }, [updateUserData]);

  useEffect(() => {
    if (error) {
      Toast.show({
        text1: "Ooh!",
        text2: "Can't load your profile. Please logout and login again!",
        type: "error",
      });
    }
  }, [error]);

  const handleSave = async () => {
    const data = {
      ...userInput,
      age: userInput.age ? parseInt(userInput.age) : undefined,
      height: userInput.height ? parseInt(userInput.height) : undefined,
      weight: userInput.weight ? parseInt(userInput.weight) : undefined,
    };

    await updateUser({
      name: data.name,
      age: data.age,
      address: data.address,
      gender: data.gender,
      height: userInfo?.height ? undefined : data.height,
      weight: userInfo?.weight ? undefined : data.weight,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScreenTitle
        title="Your Profile"
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
        TrailingIconButton={
          isFocusInput ? (
            <Text
              style={{
                ...fonts.titleMedium,
                color: colors.primary1,
                marginRight: 10,
              }}
              onPress={() => {
                setIsFocusInput(false);
                Keyboard.dismiss();
              }}
            >
              Done
            </Text>
          ) : undefined
        }
      />
      {isLoading && <ActivityIndicator size="large" color={colors.primary2} />}
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            onChangeText={(value) => {
              setUserInput({
                ...userInput,
                name: value,
              });
            }}
            style={styles.uneditableValueText}
            value={userInput.email}
            placeholder="Enter your email..."
            editable={false}
            inputMode="email"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.labelText}>Full name</Text>
          <TextInput
            onChangeText={(value) => {
              setUserInput({
                ...userInput,
                name: value,
              });
            }}
            style={[
              styles.valueText,
              {
                height: 30,
                borderBottomWidth: 1,
                borderColor: colors.tertiary3,
              },
            ]}
            value={userInput.name}
            placeholder="Enter your name..."
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.labelText}>Address</Text>
          <TextInput
            onChangeText={(value) => {
              setUserInput({
                ...userInput,
                address: value,
              });
            }}
            style={[
              styles.valueText,
              {
                height: 30,
                borderBottomWidth: 1,
                borderColor: colors.tertiary3,
              },
            ]}
            value={userInput.address}
            placeholder="Enter your address..."
          />
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.halfinfoContainer}>
            <Text style={styles.labelText}>Gender</Text>
            <Dropdown
              onChange={(item) => {
                setUserInput({
                  ...userInput,
                  gender: item.value,
                });
              }}
              data={genderOptions}
              value={userInput.gender}
              labelField="label"
              valueField="value"
              style={{
                width: "100%",
                height: 25,
              }}
              maxHeight={300}
            />
          </View>
          <View style={styles.halfinfoContainer}>
            <Text style={styles.labelText}>Age</Text>
            <Dropdown
              onChange={(item) => {
                setUserInput({
                  ...userInput,
                  age: item.value,
                });
              }}
              data={ageOptions}
              value={userInput.age}
              labelField="label"
              valueField="value"
              style={{
                width: "100%",
                height: 25,
              }}
              maxHeight={300}
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.halfinfoContainer}>
            <Text style={styles.labelText}>Height</Text>
            <TextInput
              onChangeText={(value) => {
                setUserInput({
                  ...userInput,
                  height: value,
                });
              }}
              style={styles.uneditableValueText}
              value={userInput.height}
              placeholder="Enter your height..."
              editable={!userInfo?.height}
              keyboardType="number-pad"
              onFocus={() => {
                setIsFocusInput(true);
              }}
            />
          </View>
          <View style={styles.halfinfoContainer}>
            <Text style={styles.labelText}>Weight</Text>
            <TextInput
              onChangeText={(value) => {
                setUserInput({
                  ...userInput,
                  weight: value,
                });
              }}
              style={styles.uneditableValueText}
              value={userInput.weight}
              placeholder="Enter your weight..."
              editable={!userInfo?.weight}
              keyboardType="number-pad"
              onFocus={() => {
                setIsFocusInput(true);
              }}
            />
          </View>
        </View>

        <CustomButton
          style={{ marginTop: 20 }}
          title="Save"
          onPress={() => {
            handleSave();
          }}
          leadingIcon={
            updateUserIsLoading && <ActivityIndicator color="#fff" />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 30,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F3F8FF",
    borderWidth: 1,
    borderColor: colors.tertiary3,
    borderRadius: 8,
    gap: 2,
  },
  halfinfoContainer: {
    width: "49%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F3F8FF",
    borderWidth: 1,
    borderColor: colors.tertiary3,
    borderRadius: 8,
    gap: 2,
  },
  labelText: {
    ...fonts.labelSmall,
    color: colors.tertiary2,
  },
  valueText: {
    ...fonts.bodyMedium,
    lineHeight: 16,
    height: 25,
    paddingVertical: 3,
  },
  uneditableValueText: {
    ...fonts.bodyLarge,
    lineHeight: 18,
    height: 25,
    paddingVertical: 3,
    color: colors.tertiary4,
  },
});

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const ageOptions = ageOptionsFunc();

function ageOptionsFunc() {
  const res = [];
  for (let index = 0; index < 200; index++) {
    const value = index.toString();
    res.push({
      label: value,
      value: value,
    });
  }
  return res;
}
