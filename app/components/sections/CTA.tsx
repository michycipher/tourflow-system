    'use client';
import React from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { 
    HiOutlineArrowRight,
  
} from "react-icons/hi2";


const CTA: React.FC = () => {


return (
      <section className="py-24 bg-[#0A0F17] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your First Tour?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Join thousands of teams using TourFlow to create better user experiences.
            </p>
            <Link href="/login">
              <Button size="md" className="bg-[#800080] text-white py-3 md:py-4 flex gap-3 mx-auto">
               <span> Get Started Free</span> <HiOutlineArrowRight className="w-5 h-5" />
              </Button>
              
              
            </Link>
          </motion.div>
        </div>
      </section>
)
}
export default CTA;