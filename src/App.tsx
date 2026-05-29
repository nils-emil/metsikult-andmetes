import { useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Story01Growth } from "./pages/lumberjack/Story01Growth";
import { Story02StandAges } from "./pages/lumberjack/Story02StandAges";
import { Story03Simulation } from "./pages/lumberjack/Story03Simulation";
import { Story04HotTopics } from "./pages/lumberjack/Story04HotTopics";
import { Story04Strategy } from "./pages/lumberjack/Story04Strategy";
import { StoryDock } from "./pages/lumberjack/StoryDock";
import { Story01Layers } from "./pages/loomad/Story01Layers";
import { Story02SpeciesAge } from "./pages/loomad/Story02SpeciesAge";
import { Story03Succession } from "./pages/loomad/Story03Succession";
import { Story04Conservation } from "./pages/loomad/Story04Conservation";
import { LoomadDock } from "./pages/loomad/LoomadDock";

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash || "#/");
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

function App() {
  const hash = useHashRoute();

  if (hash === "#/raidur" || hash === "#/raidur/1") {
    return (
      <>
        <Story01Growth />
        <StoryDock currentIndex={0} />
      </>
    );
  }
  if (hash === "#/raidur/2") {
    return (
      <>
        <Story02StandAges />
        <StoryDock currentIndex={1} />
      </>
    );
  }
  if (hash === "#/raidur/3") {
    return (
      <>
        <Story03Simulation />
        <StoryDock currentIndex={2} />
      </>
    );
  }
  if (hash === "#/raidur/4") {
    return (
      <>
        <Story04HotTopics />
        <Story04Strategy />
        <StoryDock currentIndex={3} />
      </>
    );
  }
  if (hash === "#/loomad" || hash === "#/loomad/1") {
    return (
      <>
        <Story01Layers />
        <LoomadDock currentIndex={0} />
      </>
    );
  }
  if (hash === "#/loomad/2") {
    return (
      <>
        <Story02SpeciesAge />
        <LoomadDock currentIndex={1} />
      </>
    );
  }
  if (hash === "#/loomad/3") {
    return (
      <>
        <Story03Succession />
        <LoomadDock currentIndex={2} />
      </>
    );
  }
  if (hash === "#/loomad/4") {
    return (
      <>
        <Story04Conservation />
        <LoomadDock currentIndex={3} />
      </>
    );
  }
  return <LandingPage />;
}

export default App;
