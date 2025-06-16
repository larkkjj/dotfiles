import { Variable, bind } from "astal";
import { Gtk, Astal, hook } from "astal/gtk3";
import Brightness from "./custom/brightness";

const bright = Brightness.get_default();
let showhelper = Variable(false);
let value = Variable("");

export default function BrightnessWidget() {
  return (
    <box valign={Gtk.Align.CENTER} spacing={2}>
      <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
        revealChild={bind(showhelper)}
      >
        <slider
          /*setup={(self) => {
            switch (bright?.screen) {
              case wireplumber?.defaultSpeaker.volume < 0.3:
                self.className = "reallylow_volume";
                break;
              case wireplumber?.defaultSpeaker.volume > 0.3:
                self.className = "low_volume";
                break;
              case wireplumber?.defaultSpeaker.volume > 0.7:
                self.className = "medium_volume";
                break;
              case wireplumber?.defaultSpeaker.volume > 1.3:
                self.className = "high_volume";
                break;
            }
            }}*/
          onDragged={(self) => (bright.screen = self.value)}
          inverted={true}
          marginEnd={5}
          widthRequest={50}
          min={0}
          max={1}
          value={bind(bright, "screen")}
          className={"volumeslider"}
        />
      </revealer>
      <button onClicked={() => showhelper.set(!showhelper.get())}>
        <box>
          <icon
            icon={`display-brightness-symbolic`}
            css={"font-size: 12px;"}
            tooltipText={bind(bright, "screen").as(
              (v) => `brilho: ${v.toPrecision(1) * 100}%`,
            )}
          />
        </box>
      </button>
    </box>
  );
}
