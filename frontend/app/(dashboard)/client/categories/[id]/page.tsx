"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useClientStore from "@/store/useClientStore";
import Link from "next/link";
import {
  Search,
  Heart,
  Plus,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function AllPlatsOfCategorie() {
  const { getAllDisponiblePlatsOfCategorie, plats, isLoading } =
    useClientStore();
  const params = useParams();
  const { id } = params as { id: string };

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch data
  useEffect(() => {
    getAllDisponiblePlatsOfCategorie(id);
  }, [getAllDisponiblePlatsOfCategorie, id]);

  // Apply filters
  const filteredPlats = plats.filter((plat) => {
    // Filter by name
    const nameMatch = plat.nom
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by price
    const priceMatch = plat.prix >= priceRange[0] && plat.prix <= priceRange[1];

    // Filter by date
    let dateMatch = true;
    if (dateRange.from && dateRange.to) {
      const platDate = new Date(plat.createdAt);
      dateMatch = platDate >= dateRange.from && platDate <= dateRange.to;
    }

    return nameMatch && priceMatch && dateMatch;
  });

  // Update active filters
  useEffect(() => {
    const newActiveFilters = [];
    if (searchQuery) newActiveFilters.push("search");
    if (priceRange[0] > 0 || priceRange[1] < 100)
      newActiveFilters.push("price");
    if (dateRange.from && dateRange.to) newActiveFilters.push("date");
    setActiveFilters(newActiveFilters);
  }, [searchQuery, priceRange, dateRange]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 100]);
    setDateRange({ from: undefined, to: undefined });
    setActiveFilters([]);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-2xl font-semibold mb-4">
        les plat de la categorie : {plats[0]?.categorie?.nom || "Category"}
      </div>
      {/* Search and filters bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="What do you want eat today..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 rounded-lg"
          />
        </div>

        <div className="flex gap-2">
          {/* View toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List size={20} />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid size={20} />
            </Button>
          </div>

          {/* Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal size={18} />
                Filters
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Apply filters to find exactly what you're looking for
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Price range filter */}
                <div className="space-y-4">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={1}
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      className="my-6"
                    />
                    <div className="flex justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Date range filter */}
                <div className="space-y-4">
                  <h3 className="font-medium">Date Added</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        {dateRange.from && dateRange.to
                          ? `${format(dateRange.from, "PP")} - ${format(
                              dateRange.to,
                              "PP"
                            )}`
                          : "Select date range"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => setDateRange(range as any)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <SheetFooter>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
                <SheetTrigger asChild>
                  <Button>Apply Filters</Button>
                </SheetTrigger>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {activeFilters.includes("search") && (
            <Badge variant="secondary" className="px-3 py-1">
              Search: {searchQuery}
              <button className="ml-2" onClick={() => setSearchQuery("")}>
                ×
              </button>
            </Badge>
          )}
          {activeFilters.includes("price") && (
            <Badge variant="secondary" className="px-3 py-1">
              Price: ${priceRange[0]} - ${priceRange[1]}
              <button className="ml-2" onClick={() => setPriceRange([0, 100])}>
                ×
              </button>
            </Badge>
          )}
          {activeFilters.includes("date") && dateRange.from && dateRange.to && (
            <Badge variant="secondary" className="px-3 py-1">
              Date: {format(dateRange.from, "PP")} -{" "}
              {format(dateRange.to, "PP")}
              <button
                className="ml-2"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
        {filteredPlats.length} {filteredPlats.length === 1 ? "item" : "items"}{" "}
        found
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Grid/List view */}
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredPlats.length > 0 ? (
              filteredPlats.map((plat) => (
                <Link
                  href={`/client/plats/${plat._id}`}
                  key={plat._id}
                  className="block"
                >
                  <Card
                    className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`${
                        viewMode === "list" ? "w-1/3" : "relative pt-[75%]"
                      }`}
                    >
                      <img
                        src={
                          process.env.NEXT_PUBLIC_APP_URL + plat.images[0] ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        alt={plat.nom}
                        className={`${
                          viewMode === "list"
                            ? "h-full w-full object-cover"
                            : "absolute inset-0 h-full w-full object-cover"
                        }`}
                      />
                      <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white">
                        <Heart size={18} className="text-gray-500" />
                      </button>
                    </div>

                    <CardContent
                      className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <div className="text-sm text-gray-500 mb-1">
                        {plat.categorie?.nom || "Category"}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{plat.nom}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <span className="text-amber-500">★</span> 5.0
                        </span>
                        <span>•</span>
                        <span>1k+ Reviews</span>
                        <span>•</span>
                        <span>2.97km</span>
                      </div>

                      {viewMode === "list" && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {plat.description}
                        </p>
                      )}
                    </CardContent>

                    <CardFooter
                      className={`p-4 pt-0 ${
                        viewMode === "list" ? "border-t border-gray-100" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="text-lg font-bold text-orange-500">
                          ${plat.prix.toFixed(2)}
                        </div>
                        <Button
                          size="icon"
                          className="rounded-full bg-orange-500 hover:bg-orange-600"
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-2">No items found</div>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
