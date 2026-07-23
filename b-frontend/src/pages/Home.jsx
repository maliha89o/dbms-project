import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/Logo";

const features = {
  academic: [
    { name: "Attendance Tracking", status: "Real-time", tag: "Automated" },
    { name: "Grade Book & Report Cards", status: "Auto-generated", tag: null },
    { name: "Timetable Scheduling", status: "Conflict-free", tag: "Popular" },
    { name: "Exam Management", status: "Online & Offline", tag: null },
  ],
  administrative: [
    { name: "Fee Management", status: "Bank Integrated", tag: "Secure" },
    { name: "Admission & Enrollment", status: "Paperless", tag: null },
    { name: "Staff & Payroll", status: "Automated", tag: "New" },
    { name: "Library Management", status: "Digital Catalog", tag: null },
  ],
};

const FeatureCard = ({ feature, index, itemVariants }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ x: 4 }}
    className="group flex items-center justify-between gap-4 border-b border-border py-4"
  >
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs text-muted-foreground/70">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h4 className="text-sm font-medium text-foreground transition-colors sm:text-base">
          {feature.name}
        </h4>
        {feature.tag && (
          <Badge variant="outline" className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {feature.tag}
          </Badge>
        )}
      </div>
    </div>
    <span className="shrink-0 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm">
      {feature.status}
    </span>
  </motion.div>
);

const CategorySection = ({ title, subtitle, features, containerVariants, itemVariants, fadeUp }) => (
  <motion.div variants={fadeUp} className="w-full md:w-1/2">
    <div className="mb-6">
      <p className="text-xs font-medium tracking-[0.2em] text-brand uppercase">{subtitle}</p>
      <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h3>
      <div className="mt-3 h-px w-10 bg-border" />
    </div>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {features.map((feature, i) => (
        <FeatureCard key={feature.name} feature={feature} index={i} itemVariants={itemVariants} />
      ))}
    </motion.div>
  </motion.div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  const dur = (value) => (shouldReduceMotion ? 0 : value);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08, delayChildren: shouldReduceMotion ? 0 : 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: dur(0.5), ease: "easeOut" } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.6), delay: dur(i * 0.08), ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "academic", label: "Academic" },
    { id: "administrative", label: "Administrative" },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-24">
        {/* Background decorative elements */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: dur(1.4), ease: "easeOut" }}
          className="pointer-events-none absolute h-[420px] w-[420px] rounded-full border border-border sm:h-[560px] sm:w-[560px]"
          aria-hidden="true"
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: dur(1.6), ease: "easeOut", delay: dur(0.15) }}
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full border border-border/60 sm:h-[780px] sm:w-[780px]"
          aria-hidden="true"
        />

        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <Badge variant="outline" className="mb-6 px-3 py-1 text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Student Management System
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl text-center font-heading text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl md:text-7xl"
        >
          Manage students,
          <br />
          <span className="text-brand">effortlessly</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="relative mt-6 max-w-md text-center text-base text-muted-foreground"
        >
          From admissions to grades — one platform to track every student&apos;s journey with ease and accuracy.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="relative mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button size="lg" className="gap-1.5 px-6" nativeButton={false} render={<a href="#features" />}>
            Explore Features
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="ghost" nativeButton={false} render={<Link to="/signup" />}>
            Get a Demo
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: dur(1.2) }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Scroll</span>
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-8 w-px bg-border"
          />
        </motion.div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-brand uppercase">What We Offer</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-5xl">
            Core Features
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          role="tablist"
          aria-label="Feature category"
          className="mb-16 flex justify-center gap-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-3 -bottom-px left-3 h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <div className="flex flex-col gap-12 md:flex-row md:gap-16">
          {(activeTab === "all" || activeTab === "academic") && (
            <CategorySection
              title="Academic"
              subtitle="Academic Management"
              features={features.academic}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              fadeUp={fadeUp}
            />
          )}
          {(activeTab === "all" || activeTab === "administrative") && (
            <CategorySection
              title="Administrative"
              subtitle="Administrative Tools"
              features={features.administrative}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              fadeUp={fadeUp}
            />
          )}
        </div>
      </section>

      {/* ─── Divider Marquee ─── */}
      <div className="overflow-hidden border-y border-border py-4" aria-hidden="true">
        <motion.div
          animate={shouldReduceMotion ? {} : { x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className="flex flex-nowrap gap-12 whitespace-nowrap"
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-xs tracking-[0.2em] text-muted-foreground/60 uppercase">
              <span>Attendance Tracking</span>
              <span className="size-1 rounded-full bg-muted-foreground/30" />
              <span>Grade Book & Report Cards</span>
              <span className="size-1 rounded-full bg-muted-foreground/30" />
              <span>Fee Management</span>
              <span className="size-1 rounded-full bg-muted-foreground/30" />
              <span>Timetable Scheduling</span>
              <span className="size-1 rounded-full bg-muted-foreground/30" />
              <span>Admission & Enrollment</span>
              <span className="size-1 rounded-full bg-muted-foreground/30" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ─── CTA Section ─── */}
      <section className="px-6 py-24 md:py-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.25em] text-brand uppercase">Get Started</p>
          <h2 className="font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Simplify your school&apos;s operations
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            Join hundreds of institutions using SDS to manage students, staff, and academics — all in one place.
          </p>
          <Button size="lg" className="mt-10 gap-1.5 px-8" nativeButton={false} render={<Link to="/signup" />}>
            Request a Demo
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-6" />
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">SDS</span>
          </div>
          <p className="text-xs tracking-wide text-muted-foreground/70">
            © 2026 SDS. Empowering Education, Simplifying Management.
          </p>
        </div>
      </footer>
    </div>
  );
}
