import { usePathname } from "next/navigation";
import { FORM_TABS, SPOT_TABS } from "../consts";
import { TABS } from "../types";

export const useSelectedFormTab = () => {
  const pathname = usePathname();
  return FORM_TABS.find((tab) => tab.path === pathname);
};


export const useIsSpotTab = () => {
    const selectedTab = useSelectedFormTab();
    return SPOT_TABS.includes(selectedTab?.value as TABS);
}