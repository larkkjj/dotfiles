import { bind } from "astal";
import Cava from "gi://AstalCava";

const cava = Cava.get_default();

export function CavaWidget() {
  for (let i; i < cava.bars; i += 1) {
    for (let j; j < cava?.values; j += 1) {
      let k = Array.from({ length: i }, (_, i) => {
        <box
          css={`
            color: white;
            min-height: ${j};
          `}
        >
          teste
        </box>;
        return k;
      });
    }
  }
}
