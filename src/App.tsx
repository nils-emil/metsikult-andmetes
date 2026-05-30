import { useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { HarvestPlanStory } from "./pages/lumberjack/HarvestPlanStory";
import { Story01Growth } from "./pages/lumberjack/Story01Growth";
import { Story02StandAges } from "./pages/lumberjack/Story02StandAges";
import { Story03Simulation } from "./pages/lumberjack/Story03Simulation";
import { Story04Strategy } from "./pages/lumberjack/Story04Strategy";
import { StoryDock } from "./pages/lumberjack/StoryDock";
import { Story01Layers } from "./pages/loomad/Story01Layers";
import { Story02SpeciesAge } from "./pages/loomad/Story02SpeciesAge";
import { Story03Carbon } from "./pages/loomad/Story03Carbon";
import { LandUseStory } from "./pages/loomad/LandUseStory";
import { VegetationStory } from "./pages/loomad/VegetationStory";
import { LoomadDock } from "./pages/loomad/LoomadDock";
import { SynthesisPage } from "./pages/synthesis/SynthesisPage";
import { PitchPage } from "./pages/PitchPage";

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
        <HarvestPlanStory />
        <StoryDock currentIndex={0} />
      </>
    );
  }
  if (hash === "#/raidur/2") {
    return (
      <>
        <Story01Growth />
        <StoryDock currentIndex={1} />
      </>
    );
  }
  if (hash === "#/raidur/3") {
    return (
      <>
        <Story02StandAges />
        <StoryDock currentIndex={2} />
      </>
    );
  }
  if (hash === "#/raidur/4") {
    return (
      <>
        <Story03Simulation />
        <StoryDock currentIndex={3} />
      </>
    );
  }
  if (hash === "#/raidur/5") {
    return (
      <>
        <Story04Strategy />
        <StoryDock currentIndex={4} />
      </>
    );
  }
  if (hash === "#/keskkond" || hash === "#/keskkond/1") {
    return (
      <>
        <Story01Layers />
        <LoomadDock currentIndex={0} />
      </>
    );
  }
  if (hash === "#/keskkond/2") {
    return (
      <>
        <Story02SpeciesAge />
        <LoomadDock currentIndex={1} />
      </>
    );
  }
  if (hash === "#/keskkond/3") {
    return (
      <>
        <VegetationStory />
        <LoomadDock currentIndex={2} />
      </>
    );
  }
  if (hash === "#/keskkond/4") {
    return (
      <>
        <Story03Carbon />
        <LoomadDock currentIndex={3} />
      </>
    );
  }
  if (hash === "#/keskkond/5") {
    return (
      <>
        <LandUseStory />
        <LoomadDock currentIndex={4} />
      </>
    );
  }
  if (hash === "#/sild") {
    return <SynthesisPage />;
  }
  if (hash === "#/pitch") {
    return <PitchPage />;
  }
  return <LandingPage />;
}

export default App;
