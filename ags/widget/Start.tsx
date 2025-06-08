import { Variable, bind, exec } from "astal";
import { Gtk, Astal, hook } from "astal/gtk3";
import WorkspaceWidget from "./Workspace";

export default function StartWidget() {
  return (
    <box className={"insidebox"} halign={Gtk.Align.START}>
      <button
        onClicked={() => exec(`fuzzel`)}
        widthRequest={20}
        className={"insidebutton"}
      >
        <icon icon={`${exec(["uname", "-n"])}-symbolic`} />
      </button>
      <WorkspaceWidget />
    </box>
  );
}
