"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
        Your wiki, docs, & projects. Together.
      </h1>
      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        <span className="underline">Notifier</span> is the connected workspace
        where better, faster work happens.
      </h3>
      <Button>
        Enter Notifier
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
export default Heading;
