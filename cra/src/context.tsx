import { createContext } from "react";
// import Settings from "./Settings";

interface Settings {
    ghostOpacity: false;
    disableAnimation: false;
    dragFromAnywhere: true;
};
const SettingsCtx = createContext<{ settings: Settings | undefined, setSettings: any }>({ settings: undefined, setSettings: undefined })

export { SettingsCtx }
export type { Settings };