"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { HeroNames } from "@/components/hero-names";
import { AnimatedDate } from "@/components/animated-date";
import { LeftSilhouette, RightSilhouette } from "@/components/hero-silhouettes";
import { ScrollCue } from "@/components/scroll-cue";

export default function Home() {

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <LeftSilhouette />
        <RightSilhouette />

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-8 max-w-2xl mx-auto text-center">
          <HeroNames />
          <AnimatedDate />
        </div>

        <ScrollCue />
      </section>

      {/* RSVP Section */}
      <section
        id="rsvp-section"
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/motifs/sanddunes.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-background/60" />

        <motion.div
          className="relative z-10 flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl text-center text-foreground mb-4">
            Join Our Celebration
          </h2>

          <Link href="/rsvp">
            <Button
              size="lg"
              className="text-xl px-12 py-6 h-auto border-2 border-accent/30 hover:border-accent/60"
            >
              RSVP
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
