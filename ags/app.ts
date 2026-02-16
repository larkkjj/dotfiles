import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import {
  wifiWindow,
  clipboardWindow,
  todoWindow,
  spawnWindowPlayer,
} from "./widget/Bar"
import Mpris from "gi://AstalMpris"
import { createBinding } from "gnim"

app.start({
  css: style,
  main() {
    Bar()
    todoWindow()
    wifiWindow()
    clipboardWindow()
    spawnWindowPlayer(createBinding(Mpris.get_default(), "players"))
  },
})
