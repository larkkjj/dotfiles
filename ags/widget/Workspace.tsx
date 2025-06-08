import { Gtk, Astal } from "astal/gtk3";
import { bind } from "astal";

import Hyprland from "gi://AstalHyprland";

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
      {bind(hyprland, "workspaces").as((w) =>
        w
          .sort((a, b) => a.id - b.id)
          .map((w) => (
            <box>
              <button
                className={"insidebutton"}
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
                </box>
              </button>
            </box>
          )),
      )}
    </box>
  );
}
