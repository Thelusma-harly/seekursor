import { InfiniteGrid } from "./hero/InfiniteGrid";
import { HeroSection } from "./hero/HeroSection";
import { Globe } from "./hero/Globe";
import type { OpenAcquisition } from "../lib/acquisition";

export function Hero({ onAcquire }: { onAcquire: OpenAcquisition }) {
  return (
    <section
      id="accueil"
      className="relative isolate w-full overflow-hidden border-b border-line"
    >
      <InfiniteGrid>
        <HeroSection onAcquire={onAcquire} />
        <Globe />
      </InfiniteGrid>
    </section>
  );
}
export default Hero;
