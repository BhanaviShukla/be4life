"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Palette, Users } from "lucide-react";
import { supabase, GuestbookConfig, setGuestEmail } from "@/lib/supabase";
import { useTheme } from "next-themes";

export default function GuestbookPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [tileCount, setTileCount] = useState(0);
  const [maxTiles, setMaxTiles] = useState(100);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<GuestbookConfig | null>(null);

  useEffect(() => {
    fetchGuestbookData();
  }, []);

  const fetchGuestbookData = async () => {
    try {
      // Fetch config
      const { data: configData } = await supabase
        .from("guestbook_config")
        .select("*")
        .eq("id", "main")
        .single();

      if (configData) {
        setConfig(configData);
        setMaxTiles(configData.max_tiles);
      }

      // Fetch tile count
      const { count } = await supabase
        .from("guestbook_tiles")
        .select("*", { count: "exact", head: true })
        .neq("status", "rejected");

      if (count !== null) {
        setTileCount(count);
      }
    } catch (error) {
      console.error("Error fetching guestbook data:", error);
    }
  };

  const handleClaimTile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      // Save guest email if provided
      if (guestEmail) {
        setGuestEmail(guestEmail);
      }

      // Check if guest already has a tile
      if (guestEmail) {
        const { data: existingTile } = await supabase
          .from("guestbook_tiles")
          .select("tile_number")
          .eq("guest_email", guestEmail)
          .single();

        if (existingTile) {
          // Guest already has a tile, redirect to editor
          router.push(`/guestbook/create?tile=${existingTile.tile_number}`);
          return;
        }
      }

      // Navigate to create page with guest info
      const params = new URLSearchParams({
        name: guestName,
        ...(guestEmail && { email: guestEmail }),
      });
      router.push(`/guestbook/create?${params.toString()}`);
    } catch (error) {
      console.error("Error claiming tile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGuestbookFull = tileCount >= maxTiles;
  const tilesRemaining = maxTiles - tileCount;
  const percentComplete = Math.round((tileCount / maxTiles) * 100);

  return (
    <div className="relative min-h-screen bg-background text-foreground hero-textured">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <Palette className="w-16 h-16 text-accent mx-auto" />
            </motion.div>

            <motion.h1
              className="font-serif text-5xl md:text-6xl text-accent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Leave Your Mark on Our Story
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-lg mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create your personal tile on our digital wedding canvas – a keepsake
              we'll reveal during the celebration
            </motion.p>

            {/* Tile Counter */}
            <motion.div
              className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-2xl font-serif text-accent">
                  {tileCount} of {maxTiles} tiles created
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentComplete}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>

              {!isGuestbookFull && tilesRemaining <= 20 && (
                <p className="text-sm text-muted-foreground mt-3">
                  Only {tilesRemaining} tiles remaining! Claim yours before they're gone.
                </p>
              )}
            </motion.div>
          </div>

          {/* Entry Form or Full Message */}
          {!isGuestbookFull ? (
            <motion.div
              className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-6">
                <Sparkles className="w-8 h-8 text-accent mx-auto mb-3" />
                <h2 className="text-2xl font-serif text-accent">
                  Claim Your Tile
                </h2>
              </div>

              <form onSubmit={handleClaimTile} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-foreground">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide your email to save your progress and receive updates
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Preparing your canvas..."
                  ) : (
                    <>
                      <Palette className="w-5 h-5 mr-2" />
                      Start Creating
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Your contribution is part of something bigger. The full canvas
                  will be revealed at the wedding. You can share your personal
                  creation anytime!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-serif text-accent mb-3">
                Canvas Complete! 🎉
              </h2>
              <p className="text-lg text-muted-foreground">
                All {maxTiles} tiles have been claimed. The full masterpiece will
                be revealed at the wedding celebration.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: theme === "his"
              ? "linear-gradient(to top, hsl(var(--bg)) 0%, transparent 100%)"
              : "linear-gradient(to top, hsl(var(--bg)) 0%, transparent 100%)",
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
}