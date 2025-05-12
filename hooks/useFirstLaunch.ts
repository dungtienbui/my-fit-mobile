import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HAS_LAUNCHED = "hasLaunched";

export default function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(HAS_LAUNCHED).then((value) => {
      if (value === null) {
        AsyncStorage.setItem(HAS_LAUNCHED, "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  return isFirstLaunch;
}
