"use client";

import { motion } from "framer-motion";
import Link from "next/link";


import { 
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlinePlay
} from "react-icons/hi2";


import { Button } from "../ui/Button";



const Hero = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden mt-20 w-full ">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(222_47%_12%)_0%,hsl(222_47%_6%)_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#800080]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#800080]/50 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-white my-10 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
          

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Build Beautiful{" "}
              <span className="gradient-text">Product Tours</span>{" "}
              in Minutes
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Create interactive onboarding experiences that guide your users and boost
              engagement. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-[#800080] text-white py-3 md:py-4 flex gap-3 items-center">
                 <span>Start Building Free</span>
                  <HiOutlineArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
              <Button size="lg" className="border-2 md:border-4 border-[#800080]
               text-white py-3 md:py-4 flex gap-3 items-center">
                <HiOutlinePlay className="w-5 h-5 md:w-6 md:h-6" />
               <span>Try the Demo</span>
              </Button>
            </div>
          </motion.div>

          {/* Floating Widget Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="max-w-3xl mx-auto bg-[#0A101D]/80 border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-sm text-muted-foreground">yourwebsite.com</span>
              </div>
              <div className="p-8 bg-[#0A101D]/80 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#800080] flex items-center 
                  justify-center mx-auto mb-4 animate-pulse-glow">
                    <HiOutlineSparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-muted-foreground">Your website content here</p>
                </div>
              </div>
            </div>

            {/* Floating Tour Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 md:right-8 bg-[#0A101D]/80 border border-border rounded-xl p-4 shadow-xl max-w-xs"
            >
              <div className="flex items-center gap-3 mb-2  z-10">
                <div className="w-8 h-8 rounded-full bg-[#800080]/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">1</span>
                </div>
                <h4 className="font-semibold text-sm">Welcome!</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                This is how your tour will appear to users.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
     
      {/* How It Works */}
    

      {/* CTA Section */}
     
    </div>
  );
};

export default Hero;