import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import WorkspaceWidget from "./Workspace";
import TrayWidget from "./Tray";
import { Variable } from "astal";
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
        startWidget={<WorkspaceWidget />}
        centerWidget={<PlayerWidget />}
        endWidget={<TrayWidget />}
      ></centerbox>
    </window>
  );
}
