import { Variable, bind } from "astal";
import { Gtk, Astal } from "astal/gtk3";
import AstalWp from "gi://AstalWp";

let showhelper = Variable(false);

const wireplumber = AstalWp.get_default();

export default function VolumeWidget() {
  return (
    <box valign={Gtk.Align.CENTER} spacing={2}>
      <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
        revealChild={bind(showhelper)}
      >
        <slider
          setup={(self) => {
            bind(wireplumber?.defaultSpeaker, "volume").as((v) => {
              switch (v) {
                case v < 0.3:
                  self.className = "reallylow_volume";
                  break;
                case v > 0.3:
                  self.className = "low_volume";
                  break;
                case v > 0.7:
                  self.className = "medium_volume";
                  break;
                case v > 1.3:
                  self.className = "high_volume";
                  break;
              }
            });
          }}
          onDragged={(self) =>
            wireplumber?.defaultSpeaker.set_volume(self.value)
          }
          inverted={true}
          marginRight={5}
          widthRequest={50}
          min={0}
          max={1.5}
          value={bind(wireplumber?.defaultSpeaker, "volume")}
          className={"volumeslider"}
        />
      </revealer>
      <button onClicked={() => showhelper.set(!showhelper.get())}>
        <box>
          <icon
            css={"font-size: 12px;"}
            tooltipText={bind(wireplumber?.defaultSpeaker, "volume").as(
              (v) => `volume: ${v.toPrecision(1) * 100}%`,
            )}
            icon={bind(wireplumber?.defaultSpeaker, "volumeIcon")}
          />
        </box>
      </button>
    </box>
  );
}
