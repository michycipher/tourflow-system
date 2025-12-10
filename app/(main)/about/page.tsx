"use client";

import { motion } from "framer-motion";
import { HiOutlineUsers, HiOutlineHeart } from "react-icons/hi2";
import { IoAtOutline, IoRocketOutline } from "react-icons/io5";

const team = [
  { name: "BigJesus", role: "Founder & CEO", avatar: "BJ" },
  { name: "TechGirl", role: "Lead Designer", avatar: "TG" },
  { name: "Michy", role: "Software Engineer", avatar: "MI" },
  { name: "Page", role: "Head of Engineering", avatar: "PG" },
];

const values = [
  {
    icon: HiOutlineUsers,
    title: "User First",
    description: "We build products that prioritize user experience above all else.",
  },
  {
    icon: IoAtOutline,
    title: "Simplicity",
    description: "Complex problems deserve simple, elegant solutions.",
  },
  {
    icon: IoRocketOutline,
    title: "Innovation",
    description: "We continuously push boundaries to deliver cutting-edge features.",
  },
  {
    icon: HiOutlineHeart,
    title: "Passion",
    description: "We're passionate about helping businesses succeed.",
  },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0A101D] " />
        <div className="container mx-auto px-4 md:px-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-white text-5xl font-bold my-6">
              About <span className="text-[#800080]">TourFlow</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We&apos;re on a mission to help businesses create better onboarding
              experiences that convert visitors into engaged users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-[#0A0F17]/98">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-white text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  TourFlow was born out of frustration. As developers and product
                  managers, we saw countless users drop off during onboarding
                  because they couldn&apos;t understand how to use the product.
                </p>
                <p>
                  We knew there had to be a better way. So we built TourFlow – a
                  simple, powerful tool that lets anyone create beautiful product
                  tours without writing a single line of code.
                </p>
                <p>
                  Today, thousands of companies use TourFlow to guide their users
                  through their products, reducing churn and increasing engagement.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className=" bg-[#0A0F17]/98 border border-[#800080] rounded-2xl p-6 text-center">
                <div className="text-white text-4xl font-bold gradient-text mb-2">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">Active Tours</div>
              </div>
              <div className=" bg-[#0A0F17]/98 border border-[#800080] rounded-2xl p-6 text-center">
                <div className="text-white text-4xl font-bold gradient-text mb-2">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className=" bg-[#0A0F17]/98 border border-[#800080] rounded-2xl p-6 text-center">
                <div className="text-white text-4xl font-bold gradient-text mb-2">
                  2M+
                </div>
                <div className="text-sm text-muted-foreground">Users Guided</div>
              </div>
              <div className=" bg-[#0A0F17]/98 border border-[#800080] rounded-2xl p-6 text-center">
                <div className="text-white text-4xl font-bold gradient-text mb-2">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0A0F17]">
        <div className="container mx-auto px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[#0A0F17]/98 border border-[#800080] text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#800080]/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-[#800080]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#0A0F17]/99">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind TourFlow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#800080]/20 to-[#800080]/50 border border-[#800080]/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl ">
                    {member.avatar}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-white/90">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;