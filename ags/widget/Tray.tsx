import { Gtk, Astal } from "astal/gtk3";
import { Variable, bind } from "astal";
import { CpuWidget, DiskWidget, RamWidget } from "./Tools";
import Tray from "gi://AstalTray";
import VolumeWidget from "./Volume";
import BrightnessWidget from "./Brightness";
import NetworkWidget from "./Wifi";
import PowerWidget from "./Power";
import BatteryWidget from "./Battery";
const tray = Tray.get_default();
const time = Variable("").poll(1000, "date +%H:%M:%S");

export function DateWidget() {
  return (
    <box className={"insidebox"}>
      <label label={bind(time)} />
    </box>
  );
}

export function TrayItems() {
  return (
    <box className={"insidebox"}>
      {bind(tray, "items").as((m) =>
        m.map((m) => (
          <button onClicked={(self) => m.activate()}>
            <box>
              <icon icon={m.iconName} />
            </box>
          </button>
        )),
      )}
    </box>
  );
}

export default function TrayWidget() {
  return (
    <box className={"insidebox"} halign={Gtk.Align.END} spacing={5}>
      <TrayItems />
      <box marginTop={4} marginBottom={4} className={"separator"} />
      <BatteryWidget />
      <NetworkWidget />
      <BrightnessWidget />
      <VolumeWidget />
      <box marginTop={4} marginBottom={4} className={"separator"} />
      <DiskWidget />
      <RamWidget />
      <CpuWidget />

      <DateWidget />
      <PowerWidget />
    </box>
  );
}
