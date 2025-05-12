import Button from "@/components/button/Button";
import CustomInput from "@/components/form/CustomInput";
import { View, Text } from "react-native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import IconButton from "@/components/button/IconButton";
import RecordCard from "@/components/card/RecordCard";
import ScreenTitle from "@/components/screen/ScreenTitle";
import StatusCell from "@/components/card/StatusCell";
import TodayTargetCard from "@/components/card/TodayTargetCard";

export default function Login() {
  return (
    <View className="flex-1 justify-center items-center">
      <ScreenTitle
        title="Chi tiết sức khoẻ"
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color="white" />}
            onPress={() => {
              console.log("back");
            }}
          />
        }
        TrailingIconButton={
          <IconButton
            icon={<Ionicons name="ellipsis-vertical" size={20} color="white" />}
            onPress={() => console.log("More options")}
          />
        }
      />
      <StatusCell
        type="Heart Rate"
        values={[
          { value: "78", unit: "mp" },
          { value: "78", unit: "mp" },
        ]}
        image={require("../../assets/images/status-cell-img/running.png")}
      />

      <TodayTargetCard
        typeTarget="Bước chân"
        target="10000"
        todayValue="6400"
        unit="bước"
        image={require("../../assets/images/status-cell-img/running.png")}
      />

      <Text className="text-red-500">Đây là màn hình Đăng nhập</Text>
      <Button title="Hello" onPress={() => {}} />
      <CustomInput
        label="Name"
        value=""
        onChangeText={() => {}}
        placeholder="Enter your name"
        leadingIcon={<FontAwesome name="user" size={20} color="#333" />}
        helperText="Error"
        helperIcon={
          <FontAwesome name="exclamation-circle" size={14} color="red" />
        }
        disabled={true}
      />
      <IconButton
        icon={<Feather name="edit" size={20} color="white" />}
        onPress={() => console.log("Edit pressed")}
      />

      <RecordCard
        value="72 bpm"
        datetime="2025-05-11 08:30"
        recordType="Heart Rate"
      />
      <RecordCard
        value="98.6 °F"
        datetime="2025-05-11 08:45"
        recordType="Body Temperature"
      />
    </View>
  );
}
