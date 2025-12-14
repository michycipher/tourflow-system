"use client";
import React from "react";
// import { Button } from '../ui/Button';
import { motion } from "framer-motion";

import {
    HiOutlineSparkles,
    HiOutlineBolt,
    HiOutlineChartBar,
    HiOutlineSquares2X2,
    HiOutlineCursorArrowRays,
} from "react-icons/hi2";
import { FiCode } from "react-icons/fi";

const Features: React.FC = () => {
    const features = [
        {
            icon: HiOutlineCursorArrowRays,
            title: "Interactive Tours",
            description:
                "Guide users through your product with step-by-step interactive walkthroughs.",
        },
        {
            icon: FiCode,
            title: "Easy Integration",
            description:
                "Add a single script tag to any website. Works with React, Vue, or vanilla JS.",
        },
        {
            icon: HiOutlineChartBar,
            title: "Analytics Built-in",
            description:
                "Track completion rates, drop-offs, and user engagement in real-time.",
        },
        {
            icon: HiOutlineSquares2X2,
            title: "Customizable Design",
            description:
                "Match your brand with custom colors, fonts, and positioning options.",
        },
        {
            icon: HiOutlineBolt,
            title: "Lightning Fast",
            description:
                "Minimal bundle size ensures your page speed stays unaffected.",
        },
        {
            icon: HiOutlineSparkles,
            title: "Smart Targeting",
            description:
                "Show tours to the right users at the right time with targeting rules.",
        },
    ];

    return (
        <section id="features" className="py-24  bg-[#0A0F17] text-white">
            <div className="container mx-auto px-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl font-bold mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Powerful features to create engaging onboarding
                        experiences that convert.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 rounded-2xl bg-[#0A0F17]/95 border border-[#800080] hover:border-[#800080]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#800080]/5"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#800080]/20 flex items-center justify-center mb-4 
                            group-hover:bg-[#800080]/40 transition-colors">
                                <feature.icon className="w-6 h-6 text-[#800080]" />
                            </div>
                            <h3 className="font-display font-semibold text-lg mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Features;
