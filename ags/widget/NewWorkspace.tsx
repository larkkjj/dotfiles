import { Gtk, Astal } from "astal/gtk3";
import { Variable, bind, exec, execAsync } from "astal";

import Hyprland from "gi://AstalHyprland";
const divide = ([total, free]) => free / total;

const ram = Variable(0).poll(2000, "free", (mem_usage) =>
  divide(
    mem_usage
      .split("\n")
      .find((line) => line.includes("Mem.:"))
      .split(/\s+/)
      .splice(1, 2),
  ),
);

const hyprland = Hyprland.get_default();

/*{bind(w, "clients").as((c) =>
  c
    .filter((c) => c.workspace.id === w.id)
    .map((c) => (
      <icon
        hexpand={false}
        iconSize={8}
        setup={(self) =>
          c.class
            .split("\.")
            .splice(0, 2)
            .map(
              (c) =>
                (self.icon = `${c.toLowerCase()}-symbolic`),
            )
        }
      />
    )),
)}*/

export default function WorkspaceWidget() {
  return (
    <box halign={Gtk.Align.START} className={"insidebox"}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
        <button
          onClicked={() => hyprland.dispatch("workspace", `${i}`)}
          marginEnd={2}
          marginStart={2}
          valign={Gtk.Align.CENTER}
          child={
            <box>
              <box
                className={bind(hyprland, "focusedWorkspace").as((fw) =>
                  fw.id === i ? "active" : "inactive",
                )}
              ></box>
            </box>
          }
        />
      ))}
    </box>
  );
}

/* another piece of code that i didn't use
<box spacing={5} className={"separator"}></box>
{bind(hyprland, "focusedWorkspace").as((fw) =>
  fw.clients.length > 0 ? (
    fw.clients.map((fw) => (
      <button marginStart={5}>
        <box spacing={5}>
          <icon icon={fw.class} />
          <label
            label={bind(fw, "title").as((fw) =>
              fw.length < 10 ? fw : `${fw.substring(0, 10)}...`,
            )}
          />
          <box className={"separator"}></box>
        </box>
      </button>
    ))
  ) : (
    <label label={"Sem programas"} />
  ),
)}
</box>*/
