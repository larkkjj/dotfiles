import { Gtk, Astal } from "astal/gtk3";
import { Variable, bind } from "astal";
import { CpuWidget, DiskWidget, RamWidget } from "./Tools";
import { PrintWidget } from "./Tools";
import Tray from "gi://AstalTray";
import VolumeWidget from "./Volume";
import Brightness from "./custom/brightness";
import BrightnessWidget from "./Brightness";

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
          <button onClicked={(self) => m.activate(0, 0)}>
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
      <BrightnessWidget />
      <VolumeWidget />
      <DiskWidget />
      <RamWidget />
      <CpuWidget />
      <DateWidget />
    </box>
  );
}
