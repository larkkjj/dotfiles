import { Gtk, Astal } from "astal/gtk3";
import { Variable, bind, exec, execAsync } from "astal";
const divide = ([total, free]) => free / total;

let rev_ram = Variable(false),
  rev_disk = Variable(false),
  rev_cpu = Variable(false);

const cpu = Variable(0).poll(2000, "top -b -n 1", (out) =>
  divide([
    100,
    out
      .split("\n")
      .find((line) => line.includes("Cpu(s)"))
      .split(/\s+/)[1]
      .replace(",", "."),
  ]),
);

const ram = Variable(0).poll(2000, "free", (mem_usage) =>
  divide(
    mem_usage
      .split("\n")
      .find((line) => line.includes("Mem:"))
      .split(/\s+/)
      .splice(1, 2),
  ),
);

const disk = Variable(0).poll(2000, "df", (disk_usage) =>
  divide(
    disk_usage
      .split("\n")
      .find((line) => line.includes("/dev/nvme0n1p2"))
      .split(/\s+/)
      .splice(1, 2),
  ),
);

export function RamWidget() {
  return (
    <eventbox
      onHover={() => rev_ram.set(true)}
      onHoverLost={() => rev_ram.set(false)}
      child={<label css={"font-size: 16px"} label={""} />}
    >
      <box spacing={5}>
        <circularprogress
          tooltipText={bind(ram).as(
            (r) => `ram usada: ${r.toPrecision(1) * 100}%`,
          )}
          className={bind(ram).as((r) =>
            r > 0.5
              ? r > 0.8
                ? "high_usage"
                : "medium_usage"
              : r < 0.2
                ? "reallylow_usage"
                : "low_usage",
          )}
          startAt={0}
          endAt={1.0}
          rounded={true}
          value={bind(ram)}
          child={<label css={"font-size: 16px"} label={""} />}
        />
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
          revealChild={bind(rev_ram)}
        >
          <label label={bind(ram).as((r) => `${r.toPrecision(1) * 100}%`)} />
        </revealer>
      </box>
    </eventbox>
  );
}

export function DiskWidget() {
  return (
    <eventbox
      onHover={() => rev_disk.set(true)}
      onHoverLost={() => rev_disk.set(false)}
      child={<label css={"font-size: 16px"} label={""} />}
    >
      <box spacing={5}>
        <circularprogress
          tooltipText={bind(disk).as(
            (d) => `disco usado: ${d.toPrecision(1) * 100}%`,
          )}
          className={bind(disk).as((c) =>
            c > 0.5
              ? c > 0.8
                ? "high_usage"
                : "medium_usage"
              : c < 0.2
                ? "reallylow_usage"
                : "low_usage",
          )}
          startAt={0}
          endAt={1.0}
          rounded={true}
          value={bind(disk)}
          child={<label css={"font-size: 16px"} label={""} />}
        />
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
          revealChild={bind(rev_disk)}
        >
          <label label={bind(disk).as((d) => `${d.toPrecision(1) * 100}%`)} />
        </revealer>
      </box>
    </eventbox>
  );
}

export function CpuWidget() {
  return (
    <eventbox
      onHover={() => rev_cpu.set(true)}
      onHoverLost={() => rev_cpu.set(false)}
      child={<label css={"font-size: 16px"} label={""} />}
    >
      <box spacing={5}>
        <circularprogress
          tooltipText={bind(cpu).as(
            (c) => `cpu usada: ${c.toPrecision(1) * 100}%`,
          )}
          className={bind(cpu).as((c) =>
            c > 0.5
              ? c > 0.8
                ? "high_usage"
                : "medium_usage"
              : c < 0.2
                ? "reallylow_usage"
                : "low_usage",
          )}
          startAt={0}
          endAt={1.0}
          rounded={true}
          value={bind(cpu)}
          child={<label css={"font-size: 16px"} label={""} />}
        />
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
          revealChild={bind(rev_cpu)}
        >
          <label label={bind(cpu).as((c) => `${c.toPrecision(1) * 100}%`)} />
        </revealer>
      </box>
    </eventbox>
  );
}

export function PrintWidget() {
  return (
    <button
      className={"insidebutton"}
      label={""}
      onClicked={() => {
        execAsync("slurp", (out) =>
          execAsync(
            `grim -g ${out} -`,
            (out_again) => `wl-copy ${out - again}`,
          ),
        );
      }}
    />
  );
}
