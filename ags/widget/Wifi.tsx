import { App, Astal, Gtk } from "astal/gtk3";
import { Variable, bind, timeout } from "astal";
import AstalNetwork from "gi://AstalNetwork";

const network = AstalNetwork.get_default()?.wifi;
let rev_network = Variable(false);

export function WifiWindow() {
  const { TOP, RIGHT, LEFT } = Astal.WindowAnchor;

  return (
    <window
      name={"WifiWindow"}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | RIGHT | LEFT}
      margin={5}
      visible={true}
      application={App}
    >
      <box className={"insidebox"}>
        {bind(network, "accessPoints").as((ap) =>
          ap
            .sort((a, b) => a.strength - b.strength)
            .map((ap) => (
              <box>
                <icon iconName={ap.iconName} />
                <label label={bind(ap, "ssid")} />
                <label label={bind(ap, "strength").as((s) => `${s}%`)} />
              </box>
            )),
        )}
      </box>
    </window>
  );
}

export default function NetworkWidget() {
  return (
    <eventbox
      onHover={() => rev_network.set(true)}
      onHoverLost={() => rev_network.set(false)}
    >
      <button onClicked={() => App.toggle_window("WifiWindow")}>
        <box>
          <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
            revealChild={bind(rev_network)}
          >
            <box>
              <label
                setup={(self) =>
                  bind(network, "ssid").as((si) =>
                    bind(network, "strength").as(
                      (sn) => (self.label = `${si} - ${sn}%`),
                    ),
                  )
                }
              />
            </box>
          </revealer>
          <icon icon={bind(network, "iconName")} />
        </box>
      </button>
    </eventbox>
  );
}
