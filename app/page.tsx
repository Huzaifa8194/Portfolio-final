import { StarsBackgroundDemo } from "@/components/animate-ui/components/backgrounds/stars-background-demo";
import { AreasOfExpertise } from "@/components/experience/AreasOfExpertise";
import { BuiltApps } from "@/components/experience/BuiltApps";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { WhatIveBuilt } from "@/components/experience/WhatIveBuilt";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <StarsBackgroundDemo />

      {/* Hero + Expertise overlay stack */}
      <div className="relative isolate z-10">
        <div className="relative isolate z-10">
          <div className="relative z-10">
            <HomeExperience />
          </div>
        </div>
        <div className="relative isolate z-10 min-h-[100svh] scroll-mt-0">
          <div className="relative z-10">
            <AreasOfExpertise />
          </div>
        </div>
      </div>

      {/* Each block: full viewport rhythm + isolate so carousels / motion don’t stack over neighbors */}
      <div className="relative isolate z-10">
        <WhatIveBuilt />
      </div>
      <div className="relative isolate z-10 pb-16 md:pb-20">
        <BuiltApps />
      </div>
    </main>
  );
}
