"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { MdSkipNext } from "react-icons/md";

interface TourStep {
  title: string;
  description: string;
}

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to TourFlow!",
    description: "This is an interactive demo of our onboarding widget. Let's show you how it works!",
   
  },
  {
    title: "Create Interactive Tours",
    description: "Design step-by-step guides that help users understand your product features effortlessly.",
    
  },
  {
    title: "Progress Tracking",
    description: "The progress bar shows how far you've come. Users can resume where they left off!",
    
  },
  {
    title: "Customizable Design",
    description: "Match your brand with custom colors, fonts, and positioning options to create a seamless experience.",
    
  },
  {
    title: "You're All Set!",
    description: "Start creating amazing onboarding experiences for your users today. Ready to get started?",
    
  },
];

export default function DemoTourModal({ isOpen, onClose }: DemoTourModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const progressPercentage = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-md"
          >
            <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1 bg-gray-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-[#800080]"
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <span className="text-sm text-gray-400">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
                  aria-label="Close"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                     
                      {tourSteps[currentStep].title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {tourSteps[currentStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-[#141821]">
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <MdSkipNext className="w-5 h-5" />
                  Skip
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentStep === 0
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <HiOutlineChevronLeft className="w-5 h-5" />
                    Back
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-6 py-2 bg-[#800080]/80 hover:bg-[#800080] text-white rounded-lg text-sm font-medium transition-all"
                  >
                    {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
                    <HiOutlineChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import React from "react";
import { HiOutlineX } from "react-icons/hi";
