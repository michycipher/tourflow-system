    'use client';
import React from 'react';
// import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const H: React.FC = () => {

const steps = [
  {
    number: "01",
    title: "Create Your Tour",
    description: "Use our visual editor to design engaging onboarding experiences.",
  },
  {
    number: "02",
    title: "Add Your Steps",
    description: "Define each step with titles, content, and target elements.",
  },
  {
    number: "03",
    title: "Embed Anywhere",
    description: "Copy the embed code and paste it into your website.",
  },
];

return (
      <section className="py-24 bg-[#0A0F17]/98 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in just three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-px 
                  bg-linear-to-r from-[#800080]/50 to-transparent" />
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24
                   rounded-2xl bg-linear-to-br from-[#800080]/20 to-[#800080]/50 border border-[#800080]/20 mb-6">
                    <span className="font-display text-3xl font-bold gradient-text">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

)
}
export default H;