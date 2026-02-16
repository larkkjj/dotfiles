import Adw from "gi://Adw?version=1"
import cairo from "gi://cairo"
import app from "ags/gtk4/app"
import GTop from "gi://GTop"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll, interval } from "ags/time"
import { createBinding, createState, For, onCleanup, With } from "ags"
import { Accessor } from "ags"
import Wp from "gi://AstalWp"
import Mpris from "gi://AstalMpris"
import AstalHyprland from "gi://AstalHyprland"
import { execAsync } from "ags/process"
import AstalNetwork from "gi://AstalNetwork"
import Gio from "gi://Gio?version=2.0"
import GDateTime from "gi://GLib"
import { readFile, readFileAsync, writeFile, writeFileAsync } from "ags/file"
import { signal } from "gnim/dbus"
import GLib from "gi://GLib?version=2.0"

const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor
const [revealTodo, changeTodo] = createState(false)
const [getWifiReveal, setWifiReveal] = createState(false)

function revealWidget(widget: Object) {
  const [canReveal, setReveal] = createState(false)

  return (
    <box
      halign={Gtk.Align.CENTER}
      hexpand={false}
      heightRequest={10}
      $={(self) => {
        const motion = Gtk.EventControllerMotion.new()
        self.add_controller(motion)
        motion.connect("enter", () => {
          console.log(canReveal)
          setReveal(true)
          motion.connect("leave", () => {
            console.log(canReveal)
            setReveal(false)
          })
        })
      }}
    >
      <revealer
        revealChild={canReveal}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      >
        {widget}
      </revealer>
    </box>
  )
}
function revealWidgetDouble(holder: Object, widget: Object) {
  const [canReveal, setReveal] = createState(false)

  return (
    <box
      halign={Gtk.Align.CENTER}
      hexpand={false}
      $={(self) => {
        const motion = Gtk.EventControllerMotion.new()
        self.add_controller(motion)

        motion.connect("enter", () => {
          console.log(canReveal)
          setReveal(true)
        })

        motion.connect("leave", () => {
          console.log(canReveal)
          setReveal(false)
        })
      }}
      orientation={Gtk.Orientation.VERTICAL}
      heightRequest={10}
    >
      <revealer
        revealChild={canReveal}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      >
        {widget}
      </revealer>
      {holder}
    </box>
  )
}

function revealHoverSlider(
  icon: string,
  mvalue: number,
  round: number,
  func: (value: number) => void,
  value: number,
) {
  const [getReveal, setReveal] = createState(false)

  return (
    <box vexpand={false} orientation={Gtk.Orientation.VERTICAL}>
      <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        $={(self) =>
          getReveal.subscribe(() => (self.revealChild = getReveal()))
        }
      >
        <slider
          value={value}
          vexpand={false}
          hexpand={false}
          $={(self) => {
            if (round == 0) {
              self.max = mvalue / 100
              self.min = 0
            } else {
              self.max = mvalue
              self.min = 0
            }
          }}
          inverted={true}
          heightRequest={100}
          orientation={Gtk.Orientation.VERTICAL}
          onValueChanged={(self) => {
            func(self.value)
          }}
        ></slider>
      </revealer>
      <Gtk.EventControllerMotion
        onLeave={() => {
          setReveal((v) => (v = false))
        }}
      />
      <button
        hexpand={false}
        vexpand={false}
        halign={Gtk.Align.BASELINE_CENTER}
        onClicked={(self) => {
          setReveal((r) => !r)
        }}
      >
        <image iconName={icon} />
      </button>
    </box>
  )
}

export function spawnWindowPlayer(players: Accessor<Mpris.Player[]>) {
  return (
    <window
      name="popupPlayer"
      application={app}
      marginStart={10}
      marginTop={10}
      marginBottom={10}
      visible={false}
      class="window"
      keymode={Astal.Keymode.ON_DEMAND}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={LEFT}
      onDestroy={(self) => {
        self.hide()
      }}
    >
      <box hexpand={false} class={"box"}>
        <For each={players}>
          {(player) => (
            <box
              css={`
                background-position: center;
                background-size: cover;
                background-image: ${player.coverArt};
              `}
              halign={Gtk.Align.CENTER}
              orientation={Gtk.Orientation.VERTICAL}
            >
              <Adw.Clamp heightRequest={100} maximumSize={100}>
                <Gtk.Picture
                  css={`
                    border-radius: 50px;
                    animation: spin 5s cubic-bezier(0.445, 0.05, 0.55, 0.95)
                      infinite;
                  `}
                  file={Gio.file_new_for_path(player.coverArt)}
                  contentFit={Gtk.ContentFit.COVER}
                  $={(self) => {
                    const background = createBinding(player, "coverArt")
                    const fallback =
                      "/home/lark/downloads/E6zAimaXIAYCjyA-removebg-preview.png"
                    player.connect("notify::cover-art", () => {
                      if (background() != "") {
                        self.file = Gio.file_new_for_path(background())
                      } else {
                        self.file = Gio.file_new_for_path(fallback)
                      }
                    })
                  }}
                />
              </Adw.Clamp>
              <slider
                value={0}
                halign={Gtk.Align.CENTER}
                hexpand={false}
                widthRequest={180}
                $={(self) => {
                  const length = createBinding(player, "length")

                  const getPosition = player.connect("notify::position", () => {
                    self.value = player.position / length()
                  })
                  onCleanup(() => player.disconnect(getPosition))
                }}
                onMoveSlider={(self) => (player.position = self.value)}
              />
              <label
                css={`
                  font-style: oblique;
                `}
                label={createBinding(
                  player,
                  "title",
                )((t) =>
                  t.length > 0
                    ? `${t.substring(0, 20)}`
                    : `musica não identificada..`,
                )}
              />
              <label
                css={`
                  font-size: 10px;
                `}
                label={createBinding(
                  player,
                  "artist",
                )((a) =>
                  a.length > 0
                    ? `${a.substring(0, 20)}`
                    : `artista desconhecido`,
                )}
                marginBottom={5}
              />
              <box
                halign={Gtk.Align.CENTER}
                orientation={Gtk.Orientation.HORIZONTAL}
              >
                <button
                  iconName={"media-playback-skip-backward"}
                  onClicked={() => player.previous()}
                />
                <button
                  iconName={
                    player.playbackStatus == 0
                      ? "media-playback-pause"
                      : "media-playback-start"
                  }
                  $={(self) => {
                    player.connect("notify::playback-status", (status) => {
                      switch (player.playback_status) {
                        case 0:
                          self.iconName = `media-playback-pause`
                          break

                        case 1:
                          self.iconName = `media-playback-start`
                          break
                      }
                    })
                  }}
                  onClicked={() => player.play_pause()}
                />
                <button
                  iconName={"media-playback-skip-forward"}
                  onClicked={() => player.next()}
                />
              </box>
            </box>
          )}
        </For>
      </box>
    </window>
  )
}

export function wifiWindow() {
  const network = AstalNetwork.get_default().wifi
  const access_pointers = createBinding(network, "accessPoints").as((ap) =>
    ap.sort((a, b) => b.strength - a.strength),
  )
  const [getSearch, setSearch] = createState("N")

  function content() {
    return (
      <revealer
        $={(self) => {
          network.get_access_points()

          getWifiReveal.subscribe(() => {
            self.revealChild = getWifiReveal()
          })
        }}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        transitionDuration={1500}
      >
        <box>
          <scrolledwindow>
            <box orientation={Gtk.Orientation.VERTICAL}>
              <box orientation={Gtk.Orientation.HORIZONTAL}>
                <togglebutton
                  onActivate={() => {
                    network.set_enabled(!network.get_enabled())
                  }}
                  active={createBinding(network, "enabled")}
                ></togglebutton>
                <button
                  label={"atualizar lista?"}
                  onClicked={() => {
                    network.scan()
                  }}
                  $={(self) =>
                    network.connect("notify::scanning", () => {
                      if (network.scanning) {
                        self.label = "...atualizando..."
                      } else {
                        self.label = "atualizar lista?"
                      }
                    })
                  }
                ></button>
              </box>
              <Gtk.Separator />
              {access_pointers().length > 0 ? (
                <For each={access_pointers}>
                  {(point) => (
                    <button hexpand={true}>
                      <box spacing={10}>
                        <image
                          iconName={"network-wireless-acquiring-symbolic"}
                          iconSize={Gtk.IconSize.NORMAL}
                          $={(self) => {
                            point.connect("notify::strength", () => {
                              print(point.iconName)
                              self.iconName = point.iconName
                            })
                          }}
                        />
                        <label
                          halign={Gtk.Align.START}
                          label={`${point.ssid} - ${point.strength}% `}
                          $={(self) => {
                            point.connect("notify", () => {
                              self.label = `${point.ssid} - ${point.strength}% `
                            })
                          }}
                        />
                        {network.activeAccessPoint.ssid === point.ssid ? (
                          <image iconName={"check-active-symbolic"}></image>
                        ) : (
                          ""
                        )}
                      </box>
                    </button>
                  )}
                </For>
              ) : (
                <label hexpand vexpand label={"nenhuma rede encontrada"} />
              )}
            </box>
          </scrolledwindow>
        </box>
      </revealer>
    )
  }

  return (
    <window
      defaultHeight={300}
      defaultWidth={300}
      name="wifiWindow"
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
      application={app}
      marginLeft={10}
      marginBottom={15}
    >
      {content()}
    </window>
  )
}

function wifiWidget() {
  const network = AstalNetwork.get_default().wifi

  return (
    <box orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.CENTER}>
      <button
        onClicked={() => {
          app.toggle_window("wifiWindow")
          setWifiReveal((s) => !s)
          console.log(getWifiReveal())
        }}
      >
        <image iconName={createBinding(network, "iconName")} />
      </button>
    </box>
  )
}

function clockWidget() {

  const [getDate, fetchDate] = createState(GLib.DateTime.new_now_local().format("%H\n%M\n%S"));

  return (
    <box halign={Gtk.Align.CENTER}>
      <label
        $={(self) => {
          interval(1000, () => {
            fetchDate(GLib.DateTime.new_now_local().format("%H\n%M\n%S"))

            print(getDate())
            self.label = getDate();
          });
        }} />
    </box>
  )
}

function WorkspaceWidget() {
  const hyprland = AstalHyprland.get_default()
  const hyprland_workspaces: Accessor<AstalHyprland.Workspace[]> =
    createBinding(hyprland, "workspaces").as((w) =>
      w.sort((a, b) => a.id - b.id),
    )

  return (
    <box
      halign={Gtk.Align.CENTER}
      hexpand={false}
      orientation={Gtk.Orientation.VERTICAL}
    >
      <For each={hyprland_workspaces}>
        {(workspace) => (
          <box halign={Gtk.Align.CENTER} hexpand={false}>
            <button
              cssClasses={["button, rotate"]}
              onClicked={(self) => {
                hyprland.dispatch("workspace", workspace.id.toString())
              }}
              $={() => {
                hyprland.connect("workspace-added", () => {
                  execAsync(
                    `notify-send -r 99 "novo workspace" ${hyprland.focusedWorkspace.id}`,
                  )
                })
              }}
            >
              <box hexpand={false} orientation={Gtk.Orientation.VERTICAL}>
                <label
                  css={`
                    background-color: transparent;
                  `}
                  label={createBinding(hyprland, "focusedWorkspace").as((fw) =>
                    fw.id === workspace.id ? "◈" : "◇",
                  )}
                />
              </box>
            </button>
          </box>
        )}
      </For>
    </box>
  )
}

function PlayerWidget() {
  const players: Accessor<Mpris.Player[]> = createBinding(
    Mpris.get_default(),
    "players",
  )

  return (
    <button
      halign={Gtk.Align.BASELINE_CENTER}
      hexpand={false}
      onClicked={(self) => {
        app.get_windows().map((p) => console.log(p.name))

        const p = players.peek()
        if (p.length > 0) {
          app.toggle_window("popupPlayer")
        } else
          execAsync([
            "notify-send",
            "AGS (Media Player)",
            "nada tocando no momento :/",
          ])
      }}
    >
      <box
        css={`
          min-width: 1px;
          min-height: 100px;
          background-color: white;
        `}
      />
    </button>
  )
}

function changeBrightness(value: number) {
  print(value)
  execAsync(["brightnessctl", "set", `${value}%`])
}

function changeVolume(value: number) {
  const wireplumber = Wp.get_default()
  wireplumber.defaultSpeaker.set_volume(value)
}

function circularProgress(value: Accessor<number>, time: number) {
  // const [cpu_value, cpu_set_value]: Accessor<Number> = createState()
  // cpu_set_value(0)

  interval(time, () => {
    value.subscribe(() => {})
  })

  return (
    <overlay hexpand={true} halign={Gtk.Align.CENTER}>
      <drawingarea
        widthRequest={32}
        heightRequest={32}
        hexpand={true}
        $={(self) => {
          interval(time, () => {
            self.queue_draw()
            console.log(value())
          })
          self.set_draw_func((area, context, width, height) => {
            width = self.get_allocated_width()
            height = self.get_allocated_height()

            context.setAntialias(cairo.Antialias.BEST)
            const center_x = width / 2
            const center_y = height / 2

            context.setSourceRGBA(1, 1, 1, 1)
            context.setLineWidth(2)
            context.arc(center_x, center_y, 13, 0, 2 * Math.PI)
            context.stroke()

            context.setSourceRGBA(0.2, 0.2, 0.1, 1)
            context.setLineWidth(3)
            context.arc(
              center_x,
              center_y,
              13,
              -Math.PI / 2,
              -Math.PI / 2 + value() * 2 * Math.PI,
            )
            context.stroke()
          })
        }}
      />
      <label
        $type="overlay"
        halign={Gtk.Align.CENTER}
        $={(self) => {
          value.subscribe(() => {
            self.label = value.as((v) => `${Math.abs(Math.round(v * 100))}%`)()
          })
        }}
      />
    </overlay>
  )
}

function menuWidget() {
  return (
    <box halign={Gtk.Align.CENTER}>
      <button
        onClicked={(self) => {
          execAsync("notify-send 'i use arch btw'")
        }}
      >
        <Gtk.EventControllerMotion />
        <image
          css={`
            color: white;
          `}
          iconName={"archlinux-logo-symbolic"}
        />
      </button>
    </box>
  )
}

export function todoWindow() {
  const [getTodo, setTodo] = createState(false)
  const [getText, setText] = createState("")

  function todoJson(note: string) {
    const data = JSON.parse(note)
    print(data.title)
    print(data.content)
    return (
      <box>
        <label label={data.title} />
        <label label={data.content} />
      </box>
    )
  }

  function todoContent() {
    let arrayWidget: Accessor<Array<any>> = createState("")

    return (
      <revealer
        transitionDuration={500}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        $={(self) => {
          getTodo.subscribe(() => (self.revealChild = getTodo()))
        }}
      >
        <box
          heightRequest={300}
          halign={Gtk.Align.CENTER}
          orientation={Gtk.Orientation.VERTICAL}
          hexpand={true}
        >
          <label
            css={`
              font-weight: bold;
            `}
            label={" - anotações - "}
          />
          <box>
            <button
              onClicked={() => {
                const text = readFile("notes.json")
                writeFileAsync(
                  "notes.json",
                  getText.as(
                    (t) =>
                      text + `\n${t.replaceAll("\n", "").replaceAll("\0", "")}`,
                  )(),
                )
                todoJson(text)
                setText((s) => (s = ""))
                execAsync("notify-send -n 99 'nota adicionada!'")
              }}
              label={`+`}
            />
            <Gtk.Entry
              $={(self) =>
                getText.subscribe(() => {
                  self.text = getText()
                  self.set_position(getText().length + 1)
                })
              }
              onNotifyText={({ text }) => {
                setText(text)
              }}
              placeholderText={"meta de hoje..."}
            />
          </box>
          <stack>
            <box></box>)
          </stack>
        </box>
      </revealer>
    )
  }

  return (
    <window
      keymode={Astal.Keymode.ON_DEMAND}
      name="todoWindow"
      visible={false}
      class="window"
      marginTop={15}
      marginBottom={15}
      anchor={Astal.WindowAnchor.LEFT | Astal.WindowAnchor.BOTTOM}
      exclusivity={Astal.Exclusivity.NORMAL}
      application={app}
      onNotifyVisible={(self) => {
        // getTodo() == 0 ? setTodo((s) => !s) : setTodo((s) => (s = false))
        setTodo((s) => self.visible) /* thank you gemini */
        console.log(getTodo())
      }}
    >
      {todoContent()}
    </window>
  )
}
function todoWidget() {
  return (
    <button
      hexpand={false}
      iconName={"sticky-notes"}
      onClicked={() => {
        app.toggle_window("todoWindow")
      }}
    />
  )
}

export function clipboardWindow() {
  function content() {
    return <box> teste </box>
  }

  return (
    <window
      name="clipboardWindow"
      exclusivity={Astal.Exclusivity.NORMAL}
      application={app}
    >
      {content()}
    </window>
  )
}

function clipboardWidget() {
  return (
    <button
      label={"C"}
      onClicked={() => app.toggle_window("clipboardWindow")}
    />
  )
}

function cpuWidget() {
  const cpu = new GTop.glibtop_cpu()

  const cpu_usage = createPoll(0, 1000, () => {
    GTop.glibtop_get_cpu(cpu)

    let old_total = 0
    let old_idle = 0
    let new_total = 0
    let new_idle = 0

    old_total = cpu.total
    old_idle = cpu.idle

    const deltaTotal = old_total - new_total
    const deltaIdle = old_idle - new_idle

    new_total = old_total
    new_idle = old_idle

    return (deltaTotal - deltaIdle) / deltaTotal
  })
  return <box> {circularProgress(cpu_usage, 1000)} </box>
}

function ramWidget() {
  const mem = new GTop.glibtop_mem()

  const mem_usage = createPoll(0, 1000, () => {
    GTop.glibtop_get_mem(mem)

    const used = mem.user
    const total = mem.total
    return used / total
  })
  return <box> {circularProgress(mem_usage, 1000)} </box>
}

function startWidgets() {
  return (
    <box hexpand={false} orientation={Gtk.Orientation.VERTICAL}>
      {menuWidget()}
      <Gtk.Separator />
      {WorkspaceWidget()}
    </box>
  )
}

function centerWidgets() {
  return (
    <box hexpand={true} orientation={Gtk.Orientation.VERTICAL}>
      {ramWidget()}
      {cpuWidget()}
    </box>
  )
}

function endWidgets() {
  const wp = Wp.get_default()?.defaultSpeaker
  const volume_icon = createBinding(wp, "volumeIcon")

  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      {PlayerWidget()}
      {todoWidget()}
      <Gtk.Separator />
      {revealHoverSlider(
        "display-brightness-symbolic",
        100,
        1,
        changeBrightness,
        0.5,
      )}
      {revealHoverSlider(
        volume_icon,
        150,
        0,
        changeVolume,
        createBinding(wp, "volume").as((v) => v),
      )}
      {wifiWidget()}
      <Gtk.Separator />
      {clockWidget()}
    </box>
  )
}

export default function Bar() {
  return (
    <window
      marginLeft={10}
      marginTop={15}
      marginBottom={15}
      visible
      name="bar"
      class="window"
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | BOTTOM}
      application={app}
    >
      <centerbox
        hexpand={false}
        startWidget={startWidgets()}
        centerWidget={centerWidgets()}
        endWidget={endWidgets()}
        orientation={Gtk.Orientation.VERTICAL}
      ></centerbox>
    </window>
  )
}
