import { Astal, Gtk } from "astal/gtk3";
import { Variable, bind } from "astal";
import AstalPowerProfiles from "gi://AstalPowerProfiles";
import Battery from "gi://AstalBattery";

const powerprofiles = AstalPowerProfiles.get_default();
const battery = Battery.get_default();
let rev_prof = Variable(false);

export default function BatteryWidget() {
  return (
    <eventbox
      onHover={() => rev_prof.set(true)}
      onHoverLost={() => rev_prof.set(false)}
    >
      <box>
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          revealChild={bind(rev_prof)}
        >
          <label
            label={bind(battery, "powerSupply").as((w) =>
              w === false ? "Direto da fontekkkj" : "Usando bateria",
            )}
          ></label>
        </revealer>
        <icon
          icon={bind(battery, "batteryLevel").as((b) =>
            b === 0 ? `battery-000-charging` : `battery-${b}-charging`,
          )}
        />
      </box>
    </eventbox>
  );
}
