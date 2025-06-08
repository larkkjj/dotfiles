import { Variable, bind } from "astal";
import { Gtk, Astal } from "astal/gtk3";
import AstalWp from "gi://AstalWp";
import Brightness from "./custom/brightness";

const bright = Brightness.get_default();
let showhelper = Variable(false);

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
          marginRight={5}
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
            icon={`display-brightness-medium-symbolic`}
            css={"font-size: 12px;"}
            tooltipText={bind(bright, "screen").as(
              (v) => `brilho: ${v.toPrecision(1) * 100}%`,
            )}
            setup={(self) => {
              bind(bright, "screen").as((s) => {
                switch (s) {
                  case 0.3:
                    self.icon = `display-brightness-low-symbolic`;
                    break;
                  case 0.5:
                    self.icon = `display-brightness-medium-symbolic`;
                    break;
                  case 0.7:
                    self.icon = `display-brightness-high-symbolic`;
                    break;
                  case 1.3:
                    self.icon = `display-brightness-overamplified-symbolic`;
                    break;
                }
              });
            }}
          />
        </box>
      </button>
    </box>
  );
}
