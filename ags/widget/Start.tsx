import { Variable, bind, execAsync } from "astal";
import { Gtk, Astal, hook } from "astal/gtk3";
import WorkspaceWidget from "./NewWorkspace";

export default function StartWidget() {
  return (
    <box className={"insidebox"} halign={Gtk.Align.START}>
      <button
        onClicked={() => execAsync(`fuzzel`)}
        widthRequest={20}
        className={"insidebutton"}
      >
        <icon icon={`archlinux-symbolic`} />
      </button>
      <WorkspaceWidget />
    </box>
  );
}
