import React from "react";
import Hero from "../../components/sections/Hero";
import Features from "../../components/sections/Features";
import CTA from "@/components/sections/CTA";
import HowItWorks from "@/components/sections/HowItWorks";

export default function Home() {
    return (
        <div className="">
            <Hero />
            <Features />
            <HowItWorks />
            <CTA />
        </div>
    );
}
