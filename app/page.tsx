import { AreasOfExpertise } from "@/components/experience/AreasOfExpertise";
import { BuiltApps } from "@/components/experience/BuiltApps";
import { HeroExpertiseBackground } from "@/components/experience/HeroExpertiseBackground";
import { HomeExperience } from "@/components/experience/HomeExperience";
import { WhatIveBuilt } from "@/components/experience/WhatIveBuilt";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      {/* One shared shader backdrop for hero + first section (continuous, not duplicated per door) */}
      <div className="relative isolate z-10">
        <HeroExpertiseBackground />
        <div className="relative z-10">
          <HomeExperience />
        </div>
        <div className="relative z-10 min-h-[100svh] scroll-mt-0">
          <AreasOfExpertise />
        </div>
      </div>

      {/* Each block: full viewport rhythm + isolate so carousels / motion don’t stack over neighbors */}
      <div className="relative isolate z-0">
        <WhatIveBuilt />
      </div>
      <div className="relative isolate z-0 pb-16 md:pb-20">
        <BuiltApps />
      </div>
    </main>
  );
}
