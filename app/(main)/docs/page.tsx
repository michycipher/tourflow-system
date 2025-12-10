"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HiOutlineBookOpen, HiOutlineQrCode, HiOutlineBolt, HiOutlineCog, HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi2";
import { useState } from "react";
import { HiOutlineCode } from "react-icons/hi";

const installCode = `<!-- Add this script tag to your website -->
<script src="https://cdn.tourflow.io/widget.js"></script>

<!-- Initialize the tour -->
<script>
  TourFlow.init({
    tourId: 'your-tour-id',
    apiKey: 'your-api-key'
  });
</script>`;

const configCode = `TourFlow.init({
  tourId: 'your-tour-id',
  apiKey: 'your-api-key',
  
  // Optional configuration
  theme: 'dark', // 'light' or 'dark'
  position: 'bottom-right', // Widget position
  primaryColor: '#06b6d4', // Brand color
  
  // Callbacks
  onComplete: () => {
    console.log('Tour completed!');
  },
  onSkip: () => {
    console.log('Tour skipped');
  },
  onStepChange: (step) => {
    console.log('Step changed:', step);
  }
});`;

const apiCode = `// Start a specific tour
TourFlow.start('welcome-tour');

// Stop the current tour
TourFlow.stop();

// Go to a specific step
TourFlow.goToStep(2);

// Check if tour is active
const isActive = TourFlow.isActive();

// Get current step
const currentStep = TourFlow.getCurrentStep();`;

const Docs = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sections = [
    {
      id: "installation",
      icon: HiOutlineBolt,
      title: "Quick Start",
      content: "Get up and running in under 5 minutes.",
    },
    {
      id: "configuration",
      icon: HiOutlineCog,
      title: "Configuration",
      content: "Customize the widget to match your brand.",
    },
    {
      id: "api",
      icon: HiOutlineCode,
      title: "API Reference",
      content: "Control tours programmatically.",
    },
  ];

  return (
    <div>
      {/* Hero */}
  
        <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#080c1b]" />
        <div className="container mx-auto px-4 md:px-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
             <h1 className="text-white text-4xl md:text-5xl font-bold my-4">
              Developer <span className="text-[#800080]">Documentation</span> 
            </h1>
            <p className="text-lg text-white">
              Everything you need to integrate TourFlow into your website.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Docs Sections */}

      <section className="py-12 bg-[#080c1b]/99">
        <div className="container mx-auto px-4 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#800080]/25 transition-colors"
                  >
                    <section.icon className="w-4 h-4 md:w-6.5 md:h-6.5 text-[#800080]" />
                    <span className="text-sm md:text-base font-medium text-white">{section.title}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-16 ">
              {/* Installation */}
              <motion.section
                id="installation"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#800080] flex items-center justify-center">
                    <HiOutlineBolt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">Quick Start</h2>
                    <p className="text-white text-sm">
                      Add TourFlow to your website in minutes
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-white">
                    Adding TourFlow to your website is simple. Just add the script tag
                    to your HTML and initialize it with your tour ID.
                  </p>

                  <div className="relative">
                    <div className="absolute top-3 right-3">
                      <Button
                       
                        size="sm"
                        onClick={() => copyToClipboard(installCode, 0)}
                      >
                        {copiedIndex === 0 ? (
                          <HiOutlineCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <HiOutlineClipboard className="w-4 h-4 text-white hover:cursor-pointer" />
                        )}
                      </Button>
                    </div>
                    <pre className=" bg-secondary/4 border border-[#800080]/60 rounded-xl p-4 overflow-x-auto">
                      <code className="text-sm text-white/75">{installCode}</code>
                    </pre>
                  </div>

                  <div className="p-4 bg-secondary/4 border border-[#800080]/60 rounded-xl">
                    <p className="text-sm text-white">
                      <strong className="text-white">Note:</strong> You can find your tour
                      ID and API key in the Dashboard after creating a tour.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Configuration */}
              <motion.section
                id="configuration"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#800080] flex items-center justify-center">
                    <HiOutlineCog className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">Configuration</h2>
                    <p className="text-white text-sm">
                      Customize the widget to match your brand
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-white">
                    TourFlow is highly customizable. You can change colors, positions,
                    and add callbacks to track user interactions.
                  </p>

                  <div className="relative">
                    <div className="absolute top-3 right-3">
                      <Button
                       
                        size="sm"
                        onClick={() => copyToClipboard(configCode, 1)}
                      >
                        {copiedIndex === 1 ? (
                          <HiOutlineCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <HiOutlineClipboard className="w-4 h-4 text-white hover:cursor-pointer" />
                        )}
                      </Button>
                    </div>
                    <pre className="bg-secondary/4 border border-[#800080]/60 rounded-xl p-4 overflow-x-auto">
                      <code className="text-sm text-white/75">{configCode}</code>
                    </pre>
                  </div>
                        
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-secondary/4 border border-[#800080]/60 rounded-xl">
                      <h4 className="font-semibold mb-2 text-white">Theme Options</h4>
                      <ul className="text-sm text-white space-y-1">
                        <li><code className="text-white/75">light</code> - Light theme</li>
                        <li><code className="text-white/75">dark</code> - Dark theme</li>
                        <li><code className="text-white/75">auto</code> - System preference</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-secondary/4 border border-[#800080]/60 rounded-xl">
                      <h4 className="font-semibold mb-2 text-white">Position Options</h4>
                      <ul className="text-sm text-white space-y-1">
                        <li><code className="text-white/75">bottom-right</code></li>
                        <li><code className="text-white/75">bottom-left</code></li>
                        <li><code className="text-white/75">center</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* API Reference */}
              <motion.section
                id="api"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#800080] flex items-center justify-center">
                    <HiOutlineCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">API Reference</h2>
                    <p className="text-white text-sm">
                      Control tours programmatically
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-white">
                    Use the TourFlow API to control tours programmatically. Perfect for
                    triggering tours based on user actions.
                  </p>

                  <div className="relative">
                    <div className="absolute top-3 right-3">
                      <Button
                       
                        size="sm"
                        onClick={() => copyToClipboard(apiCode, 2)}
                      >
                        {copiedIndex === 2 ? (
                          <HiOutlineCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <HiOutlineClipboard className="w-4 h-4 text-white hover:cursor-pointer" />
                        )}
                      </Button>
                    </div>
                    <pre className="bg-secondary/4 border border-[#800080]/60 rounded-xl p-4 overflow-x-auto">
                      <code className="text-sm text-white/75">{apiCode}</code>
                    </pre>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;