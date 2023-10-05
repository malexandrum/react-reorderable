import { useContext } from "react";
import { SettingsCtx } from "./context";

export default function Settings() {
    const { settings, setSettings } = useContext(SettingsCtx)
    return <>
        <label>
            <input type='checkbox' checked={settings?.ghostOpacity || false} onChange={() => setSettings({ ...settings, ghostOpacity: !settings?.ghostOpacity })} />
            Show Ghost
        </label>
        <br />
        <label>
            <input type='checkbox' checked={settings?.disableAnimation || false} onChange={() => setSettings({ ...settings, disableAnimation: !settings?.disableAnimation })} />
            Disable Animation
        </label>
        <br />
        <label>
            <input type='checkbox' checked={settings?.dragFromAnywhere || false} onChange={() => setSettings({ ...settings, dragFromAnywhere: !settings?.dragFromAnywhere })} />
            Drag From Anywhere (when disabled, can only drag from handle)
        </label>
        <br />
        <br />
    </>

}