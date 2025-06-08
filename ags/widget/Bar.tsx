import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import StartWidget from "./Start";
import TrayWidget from "./Tray";
import PlayerWidget from "./Media";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT, LEFT } = Astal.WindowAnchor;

  return (
    <window
      marginTop={15}
      marginLeft={15}
      marginRight={15}
      className="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox
        startWidget={<StartWidget />}
        centerWidget={<PlayerWidget />}
        endWidget={<TrayWidget />}
      ></centerbox>
    </window>
  );
}
