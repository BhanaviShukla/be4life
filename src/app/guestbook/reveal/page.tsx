"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Share2,
  Heart,
  Sparkles,
  Lock,
} from "lucide-react";
import { supabase, GuestbookTile, GuestbookConfig, GuestbookBadge } from "@/lib/supabase";
import { useTheme } from "next-themes";

// Grid configuration
const GRID_ROWS = 10;
const GRID_COLS = 10;
const TILE_WIDTH = 300;
const TILE_HEIGHT = 200;

export default function RevealPage() {
  const { theme } = useTheme();
  const [isRevealed, setIsRevealed] = useState(false);
  const [tiles, setTiles] = useState<GuestbookTile[]>([]);
  const [badges, setBadges] = useState<GuestbookBadge[]>([]);
  const [selectedTile, setSelectedTile] = useState<GuestbookTile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRevealStatus();
    fetchBadges();
  }, []);

  const checkRevealStatus = async () => {
    try {
      // Check if canvas is revealed
      const { data: config } = await supabase
        .from("guestbook_config")
        .select("is_revealed, reveal_date")
        .eq("id", "main")
        .single();

      if (config) {
        const revealed = config.is_revealed || 
          (config.reveal_date && new Date(config.reveal_date) <= new Date());
        
        setIsRevealed(revealed);

        if (revealed) {
          fetchTiles();
        }
      }
    } catch (error) {
      console.error("Error checking reveal status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTiles = async () => {
    try {
      const { data } = await supabase
        .from("guestbook_tiles")
        .select("*")
        .eq("status", "approved")
        .order("tile_number");

      if (data) {
        setTiles(data);
      }
    } catch (error) {
      console.error("Error fetching tiles:", error);
    }
  };

  const fetchBadges = async () => {
    try {
      const { data } = await supabase
        .from("guestbook_badges")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (data) {
        setBadges(data);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const handleTileClick = (tile: GuestbookTile) => {
    setSelectedTile(tile);
  };

  const handleDownloadCanvas = async () => {
    // Implement full canvas download
    alert("Canvas download will be implemented soon!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Bhanvi & Eshlok's Wedding Canvas",
        text: "Check out the beautiful wedding canvas created by all the guests!",
        url: window.location.href,
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const filteredTiles = tiles.filter((tile) => {
    const matchesSearch = !searchQuery || 
      tile.guest_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBadge = !selectedBadgeFilter || 
      tile.badges?.includes(selectedBadgeFilter);

    return matchesSearch && matchesBadge;
  });

  // Calculate canvas dimensions
  const canvasWidth = GRID_COLS * TILE_WIDTH;
  const canvasHeight = GRID_ROWS * TILE_HEIGHT;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading canvas...</p>
        </div>
      </div>
    );
  }

  if (!isRevealed) {
    return (
      <div className="min-h-screen bg-background text-foreground hero-textured flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl text-accent mb-4">
            The Canvas is Still Hidden
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The full wedding canvas will be revealed during our celebration.
            Come back on the wedding day to see the beautiful masterpiece
            everyone created together!
          </p>
          <Link href="/guestbook">
            <Button className="mt-8" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Guestbook
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/guestbook">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Our Wedding Canvas - Complete!</h1>
              <p className="text-xs text-muted-foreground">
                {tiles.length} beautiful tiles from our loved ones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadCanvas}>
              <Download className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Find guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 h-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedBadgeFilter || ""}
              onChange={(e) => setSelectedBadgeFilter(e.target.value || null)}
              className="h-8 px-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="">All Badges</option>
              {badges.map((badge) => (
                <option key={badge.id} value={badge.id}>
                  {badge.emoji} {badge.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              disabled={zoom <= 25}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Display */}
      <div className="pt-28 p-8 overflow-auto">
        <div className="mx-auto" style={{ maxWidth: "90vw" }}>
          <div
            className="relative bg-white rounded-lg shadow-card mx-auto"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            {/* Render Grid */}
            <div className="absolute inset-0 grid grid-cols-10 gap-0">
              {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, index) => {
                const row = Math.floor(index / GRID_COLS) + 1;
                const col = (index % GRID_COLS) + 1;
                const tileNumber = index + 1;
                const tile = filteredTiles.find(t => t.tile_number === tileNumber);

                return (
                  <div
                    key={tileNumber}
                    className="relative border border-gray-200 cursor-pointer hover:z-10 transition-all"
                    style={{
                      width: `${TILE_WIDTH}px`,
                      height: `${TILE_HEIGHT}px`,
                    }}
                    onClick={() => tile && handleTileClick(tile)}
                  >
                    {tile ? (
                      <div className="relative w-full h-full group">
                        {tile.thumbnail_url ? (
                          <img
                            src={tile.thumbnail_url}
                            alt={`Tile by ${tile.guest_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                          <p className="font-semibold text-sm">{tile.guest_name}</p>
                          {tile.hover_message && (
                            <p className="text-xs mt-1 text-center">{tile.hover_message}</p>
                          )}
                          {tile.badges && tile.badges.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {tile.badges.slice(0, 3).map((badgeId) => {
                                const badge = badges.find(b => b.id === badgeId);
                                return badge ? (
                                  <span key={badgeId} title={badge.label}>
                                    {badge.emoji}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-50" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tile Modal */}
      {selectedTile && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedTile(null)}
        >
          <motion.div
            className="bg-background rounded-lg shadow-card max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedTile.guest_name}'s Tile</h3>
                <p className="text-sm text-muted-foreground">Tile #{selectedTile.tile_number}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTile(null)}
              >
                ✕
              </Button>
            </div>

            {selectedTile.image_url && (
              <img
                src={selectedTile.image_url}
                alt={`Tile by ${selectedTile.guest_name}`}
                className="w-full rounded-lg mb-4"
              />
            )}

            {selectedTile.hover_message && (
              <p className="text-lg italic mb-4">"{selectedTile.hover_message}"</p>
            )}

            {selectedTile.badges && selectedTile.badges.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedTile.badges.map((badgeId) => {
                  const badge = badges.find(b => b.id === badgeId);
                  return badge ? (
                    <span
                      key={badgeId}
                      className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1"
                    >
                      <span>{badge.emoji}</span>
                      <span>{badge.label}</span>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}