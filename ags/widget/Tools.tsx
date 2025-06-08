import { Gtk, Astal } from "astal/gtk3";
import { Variable, bind, exec, execAsync } from "astal";
const divide = ([total, free]) => free / total;

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
    <circularprogress
      tooltipText={bind(ram).as((r) => `ram usada: ${r.toPrecision(1) * 100}%`)}
      widthRequest={30}
      className={bind(ram).as((c) =>
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
      value={bind(ram)}
      child={<label css={"font-size: 16px"} label={""} />}
    />
  );
}

export function DiskWidget() {
  return (
    <circularprogress
      tooltipText={bind(disk).as(
        (d) => `disco usado: ${d.toPrecision(1) * 100}%`,
      )}
      widthRequest={30}
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
      child={<label css={"font-size: 16px"} label={"󱛟"} />}
    />
  );
}

export function CpuWidget() {
  return (
    <circularprogress
      tooltipText={bind(cpu).as((c) => `cpu usada: ${c.toPrecision(01) * 100}%`)}
      widthRequest={30}
      className={bind(cpu).as((c) =>
        c > 0.3
          ? c > 0.6
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
      child={<label css={"font-size: 16px"} label={""} />}
    />
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
