import { App } from "astal/gtk3";
import style from "./style.scss";
import Bar from "./widget/Bar";
import WifiWindow from "./widget/Wifi";

App.start({
  css: style,
  main() {
    WifiWindow();
    App.get_monitors().map(Bar);
  },
});
