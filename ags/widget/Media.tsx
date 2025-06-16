import { Variable, bind, exec, execAsync } from "astal";
import { Gtk, Astal, hook } from "astal/gtk3";
import AstalMpris from "gi://AstalMpris";

const player = AstalMpris.get_default();
let showhelper = Variable(false);

export function MediaWidget({ player }: { player: AstalMpris.Player }) {
  return (
    <eventbox
      onClick={() => showhelper.set(!showhelper.get())}
      onHoverLost={() => showhelper.set(false)}
    >
      <box spacing={2}>
        {bind(player, "coverArt").as((c) =>
          c != null ? (
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
          ) : (
            <box
              margin={4}
              setup={(self) => {
                self.css = `
                min-width: 22px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                background-color: white`;
              }}
            ></box>
          ),
        )}
        <box valign={Gtk.Align.CENTER} vertical={true}>
          <label
            css={"font-size: 12px;"}
            label={bind(player, "title").as((t) =>
              t.length > 0
                ? `${t.substring(0, 30)}`
                : `Algo está tocando de fundo...`,
            )}
          />
          <slider
            widthRequest={120}
            marginStart={10}
            marginEnd={10}
            min={0}
            max={1}
            className={"mediaslider"}
            onDragged={(self) => (player.position = self.value * player.length)}
            setup={(self) => {
              self.hook(
                player,
                "notify",
                () => (self.value = player.position / player.length),
              );
            }}
            /*setup={(self) =>
              self.hook(
                player,
                "notify",
                (self) => (self.value = player.position / player.length),
              )
              }*/
          />
        </box>
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
          revealChild={bind(showhelper)}
        >
          <box marginStart={5} spacing={20}>
            <button
              widthRequest={10}
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
              widthRequest={10}
              onClicked={() => player.next()}
              label={bind(player, "canGoNext").as((p) => (p === 1 ? "󰒭" : "󰂭"))}
            />
          </box>
        </revealer>
      </box>
    </eventbox>
  );
}

export function NothingPlaying() {
  return (
    <box>
      <button
        tooltipText={"Executar Gapless?"}
        onClicked={() => execAsync("g4music")}
        label={"Nada tocando no momento"}
      ></button>
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
          <NothingPlaying />
        ),
      )}
    </box>
  );
}
