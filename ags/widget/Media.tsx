import { Variable, bind } from "astal";
import { Gtk, Astal, hook } from "astal/gtk3";
import AstalMpris from "gi://AstalMpris";

const player = AstalMpris.get_default();
let showhelper = Variable(false);

export function MediaWidget({ player }: { player: AstalMpris.Player }) {
  return (
    <box spacing={2}>
      {bind(player, "coverArt").as((c) =>
        c != null ? (
          <button onClicked={() => showhelper.set(!showhelper.get())}>
            <box
              margin={4}
              setup={(self) => {
                self.css = `
                min-width: 22px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                background-image: url("file:///${c}");`;
              }}
            />
          </button>
        ) : (
          <button onClicked={() => showhelper.set(!showhelper.get())}>
            <box
              margin={4}
              setup={(self) => {
                self.css = `
                min-width: 30px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                background-color: white`;
              }}
            ></box>
          </button>
        ),
      )}
      <box valign={Gtk.Align.CENTER} vertical={true}>
        <button onClicked={() => showhelper.set(!showhelper.get())}>
          <box halign={Gtk.Align.CENTER}>
            <label
              css={"font-size: 12px;"}
              label={bind(player, "title").as((t) =>
                t.length > 0
                  ? `${t.substring(0, 30)}`
                  : `Algo está tocando de fundo...`,
              )}
            />
          </box>
        </button>
        <slider
          widthRequest={120}
          marginStart={10}
          marginEnd={10}
          min={0}
          max={1}
          className={"mediaslider"}
          onDragged={(self) => (player.position = self.value * player.length)}
          setup={(self) =>
            self.hook(
              player,
              "notify",
              (self) => (self.value = player.position / player.length),
            )
          }
        />
      </box>
      <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={bind(showhelper)}
      >
        <box marginLeft={5} spacing={20}>
          <button
            onClicked={() => player.previous()}
            label={bind(player, "canGoPrevious").as((p) =>
              p === 1 ? "󰒮" : "󰂭",
            )}
          />
          <button
            onClicked={() => player.play_pause()}
            label={bind(player, "playbackStatus").as((p) =>
              p === 1 ? "󰐊" : "󰏤",
            )}
          />
          <button
            onClicked={() => player.next()}
            label={bind(player, "canGoNext").as((p) => (p === 1 ? "󰒭" : "󰂭"))}
          />
        </box>
      </revealer>
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
            .map((p) => <MediaWidget player={p} />)
        ) : (
          <label label={"Nada tocando no momento"} />
        ),
      )}
    </box>
  );
}
