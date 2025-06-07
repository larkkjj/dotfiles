import { bind } from "astal";
import { Gtk, Astal } from "astal/gtk3";
import AstalMpris from "gi://AstalMpris";

const player = AstalMpris.get_default();

export function MediaWidget({ player }: { player: AstalMpris.Player }) {
  return (
    <box halign={Gtk.Align.CENTER}>
      {bind(player, "title").as((t) => `- ${t} -`)}
    </box>
  );
}

export default function PlayerWidget() {
  return (
    <box halign={Gtk.Align.CENTER}>
      {bind(player, "players").as((p) =>
        p.length > 0 ? (
          p
            .sort((a, b) => a.busName - b.busName)
            .slice(0, 1)
            .filter((p) => p.title.length > 0)
            .map((p) => <MediaWidget player={p} />)
        ) : (
          <label label={"Nada tocando no momento"} />
        ),
      )}
    </box>
  );
}
