import { useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { TodoPage } from "./pages/TodoPage";
import { Story01Growth } from "./pages/lumberjack/Story01Growth";
import { Story02StandAges } from "./pages/lumberjack/Story02StandAges";
import { StoryDock } from "./pages/lumberjack/StoryDock";

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
        <CalculatorPage />
        <StoryDock currentIndex={2} />
      </>
    );
  }
  if (hash === "#/loomad") {
    return <TodoPage />;
  }
  return <LandingPage />;
}

export default App;
