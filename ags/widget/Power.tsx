import { bind, exec, Variable } from "astal";
import { Gtk, Astal } from "astal/gtk3";

let rev_shutdown = Variable(false);

export function ShutdownWidget() {
  return (
    <eventbox
      marginEnd={5}
      css={"font-size: 16px;"}
      widthRequest={2}
      onHover={() => rev_shutdown.set(true)}
      onHoverLost={() => rev_shutdown.set(false)}
    >
      <box className={"insidebox"} spacing={5}>
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
          revealChild={bind(rev_shutdown)}
        >
          <box spacing={5}>
            <button
              tooltipText={"Reinciar"}
              onClicked={() => exec("reboot")}
              label={"󰜉"}
            />
            <button
              tooltipText={"Sair"}
              onClicked={() => exec("killall Hyprland")}
              label={"󰩈"}
            />
          </box>
        </revealer>
        <button
          tooltipText={"Desligar"}
          onClicked={() => exec("shutdown now")}
          label={"󰐥"}
        />
      </box>
    </eventbox>
  );
}

export default function PowerWidget() {
  return (
    <eventbox>
      <centerbox>
        <ShutdownWidget />
      </centerbox>
    </eventbox>
  );
}
