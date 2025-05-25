import { useMemo } from "react";

export function useTodayDate(): Date {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  return today;
}
