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

export default function WorkspaceWidget() {
  return (
    <box halign={Gtk.Align.START} className={"insidebox"}>
      {bind(hyprland, "workspaces").as((w) =>
        w
          .sort((a, b) => a.id - b.id)
          .map((w) => (
            <box>
              <button
                onClicked={(self) =>
                  hyprland.dispatch("workspace", w.id.toString())
                }
              >
                <box
                  className={bind(hyprland, "focusedWorkspace").as((fw) =>
                    fw.id === w.id ? "activebox" : "inactivebox",
                  )}
                  spacing={5}
                >
                  <box
                    className={bind(hyprland, "focusedWorkspace").as((fw) =>
                      fw.id === w.id ? "active" : "inactive",
                    )}
                  />
                  {bind(w, "clients").as((c) =>
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
                  )}
                </box>
              </button>
              <box marginStart={5} marginEnd={5} className={"separator"}></box>
            </box>
          )),
      )}
    </box>
  );
}
