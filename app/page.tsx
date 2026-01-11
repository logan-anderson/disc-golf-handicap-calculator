"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { courses, Course } from "@/lib/courses";
import { calculateHandicap } from "@/lib/handicap";

export default function Home() {
  // Handicap Calculator Tab State
  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null
  );
  const [udiscRating, setUdiscRating] = React.useState("");
  const [handicap, setHandicap] = React.useState<number | null>(null);
  const [lastCourseName, setLastCourseName] = React.useState<string>("");
  const [manualEntry, setManualEntry] = React.useState(false);
  const [manualParRating, setManualParRating] = React.useState("");
  const [manualHoles, setManualHoles] = React.useState("");
  const [manualCourseName, setManualCourseName] = React.useState("");

  // Stroke Difference Tab State
  const [strokeDiffOpen, setStrokeDiffOpen] = React.useState(false);
  const [strokeDiffSelectedCourse, setStrokeDiffSelectedCourse] = React.useState<Course | null>(null);
  const [strokeDiffManualEntry, setStrokeDiffManualEntry] = React.useState(false);
  const [strokeDiffManualParRating, setStrokeDiffManualParRating] = React.useState("");
  const [strokeDiffManualHoles, setStrokeDiffManualHoles] = React.useState("");
  const [strokeDiffManualCourseName, setStrokeDiffManualCourseName] = React.useState("");
  const [personOneRating, setPersonOneRating] = React.useState("");
  const [personTwoRating, setPersonTwoRating] = React.useState("");
  const [strokePercentage, setStrokePercentage] = React.useState(80);
  const [strokeDifferenceResult, setStrokeDifferenceResult] = React.useState<string | null>(null);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = React.useState(false);

  const handleCalculate = () => {
    if (!udiscRating) {
      return;
    }

    const rating = parseFloat(udiscRating);
    if (isNaN(rating)) {
      return;
    }

    let course: Course;
    if (manualEntry) {
      const parRating = parseFloat(manualParRating);
      const holes = parseInt(manualHoles);
      if (isNaN(parRating) || isNaN(holes) || holes <= 0) {
        return;
      }
      course = {
        name: manualCourseName || "Custom Course",
        parRating,
        holes,
      };
    } else {
      if (!selectedCourse) {
        return;
      }
      course = selectedCourse;
    }

    const result = calculateHandicap(course, rating);
    setHandicap(result);
    setLastCourseName(course.name);
  };

  const handleStrokeDifferenceCalculate = () => {
    if (!personOneRating || !personTwoRating) {
      return;
    }

    const rating1 = parseFloat(personOneRating);
    const rating2 = parseFloat(personTwoRating);
    
    if (isNaN(rating1) || isNaN(rating2)) {
      return;
    }

    let course: Course;
    if (strokeDiffManualEntry) {
      const parRating = parseFloat(strokeDiffManualParRating);
      const holes = parseInt(strokeDiffManualHoles);
      if (isNaN(parRating) || isNaN(holes) || holes <= 0) {
        return;
      }
      course = {
        name: strokeDiffManualCourseName || "Custom Course",
        parRating,
        holes,
      };
    } else {
      if (!strokeDiffSelectedCourse) {
        return;
      }
      course = strokeDiffSelectedCourse;
    }

    const handicap1 = calculateHandicap(course, rating1);
    const handicap2 = calculateHandicap(course, rating2);
    
    const difference = Math.abs(handicap1 - handicap2);
    const strokePercentageDecimal = strokePercentage / 100;
    const adjustedDifference = Math.floor(difference * strokePercentageDecimal);
    
    // Determine which person has the lower handicap (better player)
    const lowerHandicap = Math.min(handicap1, handicap2);
    const higherHandicap = Math.max(handicap1, handicap2);
    
    let result: string;
    if (adjustedDifference === 0) {
      result = "No strokes given. Both players have equal handicaps.";
    } else if (handicap1 < handicap2) {
      // Person one has lower handicap (better player)
      result = `Person two gets ${adjustedDifference} stroke${adjustedDifference !== 1 ? 's' : ''} to be chosen on any holes. Holes must be predetermined before the match starts by person two.`;
    } else {
      // Person two has lower handicap (better player)
      result = `Person one gets ${adjustedDifference} stroke${adjustedDifference !== 1 ? 's' : ''} to be chosen on any holes. Holes must be predetermined before the match starts by person one.`;
    }
    
    setStrokeDifferenceResult(result);
  };

  const isFormValid = manualEntry
    ? udiscRating &&
      !isNaN(parseFloat(udiscRating)) &&
      manualParRating &&
      !isNaN(parseFloat(manualParRating)) &&
      manualHoles &&
      !isNaN(parseInt(manualHoles)) &&
      parseInt(manualHoles) > 0
    : selectedCourse && udiscRating && !isNaN(parseFloat(udiscRating));

  const isStrokeDiffFormValid = strokeDiffManualEntry
    ? personOneRating &&
      !isNaN(parseFloat(personOneRating)) &&
      personTwoRating &&
      !isNaN(parseFloat(personTwoRating)) &&
      strokeDiffManualParRating &&
      !isNaN(parseFloat(strokeDiffManualParRating)) &&
      strokeDiffManualHoles &&
      !isNaN(parseInt(strokeDiffManualHoles)) &&
      parseInt(strokeDiffManualHoles) > 0
    : strokeDiffSelectedCourse && 
      personOneRating && 
      !isNaN(parseFloat(personOneRating)) &&
      personTwoRating && 
      !isNaN(parseFloat(personTwoRating));

  return (
    <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Disc Golf Handicap Calculator</CardTitle>
          <CardDescription>
            Calculate handicaps and stroke differences for disc golf matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stroke-difference" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stroke-difference">Stroke Difference</TabsTrigger>
              <TabsTrigger value="handicap-calculator">Handicap Calculator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stroke-difference" className="space-y-6 mt-6">
              {/* Toggle between Course Selection and Manual Entry */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!strokeDiffManualEntry ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setStrokeDiffManualEntry(false);
                    setStrokeDifferenceResult(null);
                  }}
                >
                  Select Course
                </Button>
                <Button
                  type="button"
                  variant={strokeDiffManualEntry ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setStrokeDiffManualEntry(true);
                    setStrokeDiffSelectedCourse(null);
                    setStrokeDiffOpen(false);
                    setStrokeDifferenceResult(null);
                  }}
                >
                  Manual Entry
                </Button>
              </div>

              {!strokeDiffManualEntry ? (
                /* Course Selection */
                <div className="space-y-2">
                  <Label htmlFor="stroke-diff-course">Course</Label>
                  <Popover open={strokeDiffOpen} onOpenChange={setStrokeDiffOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="stroke-diff-course"
                        variant="outline"
                        role="combobox"
                        aria-expanded={strokeDiffOpen}
                        className="w-full justify-between font-normal"
                      >
                        {strokeDiffSelectedCourse ? strokeDiffSelectedCourse.name : "Select a course..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search courses..." />
                        <CommandList>
                          <CommandEmpty>No course found.</CommandEmpty>
                          <CommandGroup>
                            {courses.map((course) => (
                              <CommandItem
                                key={course.name}
                                value={course.name}
                                onSelect={() => {
                                  setStrokeDiffSelectedCourse(course);
                                  setStrokeDiffOpen(false);
                                  setStrokeDifferenceResult(null);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    strokeDiffSelectedCourse?.name === course.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <span>{course.name}</span>
                                <span className="ml-auto text-muted-foreground text-xs">
                                  Par Rating: {course.parRating}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                /* Manual Entry Fields */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stroke-diff-courseName">Course Name (Optional)</Label>
                    <Input
                      id="stroke-diff-courseName"
                      type="text"
                      placeholder="Enter course name..."
                      value={strokeDiffManualCourseName}
                      onChange={(e) => {
                        setStrokeDiffManualCourseName(e.target.value);
                        setStrokeDifferenceResult(null);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stroke-diff-parRating">
                      Par Rating <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stroke-diff-parRating"
                      type="number"
                      placeholder="Enter par rating (e.g., 130)"
                      value={strokeDiffManualParRating}
                      onChange={(e) => {
                        setStrokeDiffManualParRating(e.target.value);
                        setStrokeDifferenceResult(null);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stroke-diff-holes">
                      Number of Holes <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stroke-diff-holes"
                      type="number"
                      placeholder="Enter number of holes (e.g., 9, 18)"
                      min="1"
                      value={strokeDiffManualHoles}
                      onChange={(e) => {
                        setStrokeDiffManualHoles(e.target.value);
                        setStrokeDifferenceResult(null);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Person One Rating */}
              <div className="space-y-2">
                <Label htmlFor="person-one-rating">Person One Rating</Label>
                <Input
                  id="person-one-rating"
                  type="number"
                  placeholder="Enter person one's UDisc rating..."
                  value={personOneRating}
                  onChange={(e) => {
                    setPersonOneRating(e.target.value);
                    setStrokeDifferenceResult(null);
                  }}
                />
              </div>

              {/* Person Two Rating */}
              <div className="space-y-2">
                <Label htmlFor="person-two-rating">Person Two Rating</Label>
                <Input
                  id="person-two-rating"
                  type="number"
                  placeholder="Enter person two's UDisc rating..."
                  value={personTwoRating}
                  onChange={(e) => {
                    setPersonTwoRating(e.target.value);
                    setStrokeDifferenceResult(null);
                  }}
                />
              </div>

              {/* Advanced Options */}
              <Collapsible open={advancedOptionsOpen} onOpenChange={setAdvancedOptionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Advanced Options
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      advancedOptionsOpen && "transform rotate-180"
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="stroke-percentage">Stroke Percentage (%)</Label>
                    <Input
                      id="stroke-percentage"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="80"
                      value={strokePercentage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          setStrokePercentage(value);
                          setStrokeDifferenceResult(null);
                        }
                      }}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Calculate Button */}
              <Button
                className="w-full"
                onClick={handleStrokeDifferenceCalculate}
                disabled={!isStrokeDiffFormValid}
              >
                Calculate Handicap
              </Button>

              {/* Stroke Difference Result */}
              {strokeDifferenceResult && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {strokeDifferenceResult}
                  </p>
                </div>
              )}

              {/* FAQ Link */}
              <div className="text-center">
                <Link
                  href="/faq#stroke-difference"
                  className="text-sm text-muted-foreground underline hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  How does stroke difference work?
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="handicap-calculator" className="space-y-6 mt-6">
          {/* Toggle between Course Selection and Manual Entry */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!manualEntry ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setManualEntry(false);
                setHandicap(null);
                setLastCourseName("");
              }}
            >
              Select Course
            </Button>
            <Button
              type="button"
              variant={manualEntry ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setManualEntry(true);
                setSelectedCourse(null);
                setOpen(false);
                setHandicap(null);
                setLastCourseName("");
              }}
            >
              Manual Entry
            </Button>
          </div>

          {!manualEntry ? (
            /* Course Selection */
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="course"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                  >
                    {selectedCourse ? selectedCourse.name : "Select a course..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search courses..." />
                    <CommandList>
                      <CommandEmpty>No course found.</CommandEmpty>
                      <CommandGroup>
                        {courses.map((course) => (
                          <CommandItem
                            key={course.name}
                            value={course.name}
                            onSelect={() => {
                              setSelectedCourse(course);
                              setOpen(false);
                              setHandicap(null);
                              setLastCourseName("");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCourse?.name === course.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span>{course.name}</span>
                            <span className="ml-auto text-muted-foreground text-xs">
                              Par Rating: {course.parRating}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            /* Manual Entry Fields */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name (Optional)</Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="Enter course name..."
                  value={manualCourseName}
                  onChange={(e) => {
                    setManualCourseName(e.target.value);
                    setHandicap(null);
                    setLastCourseName("");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parRating">
                  Par Rating <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="parRating"
                  type="number"
                  placeholder="Enter par rating (e.g., 130)"
                  value={manualParRating}
                  onChange={(e) => {
                    setManualParRating(e.target.value);
                    setHandicap(null);
                    setLastCourseName("");
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="holes">
                  Number of Holes <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="holes"
                  type="number"
                  placeholder="Enter number of holes (e.g., 9, 18)"
                  min="1"
                  value={manualHoles}
                  onChange={(e) => {
                    setManualHoles(e.target.value);
                    setHandicap(null);
                    setLastCourseName("");
                  }}
                />
              </div>
            </div>
          )}

          {/* UDisc Rating Input */}
          <div className="space-y-2">
            <Label htmlFor="rating">UDisc Rating</Label>
            <Input
              id="rating"
              type="number"
              placeholder="Enter your UDisc rating..."
              value={udiscRating}
              onChange={(e) => {
                setUdiscRating(e.target.value);
                setHandicap(null);
                setLastCourseName("");
              }}
            />
          </div>

          {/* Calculate Button */}
          <Button
            className="w-full"
            onClick={handleCalculate}
            disabled={!isFormValid}
          >
            Calculate Handicap
          </Button>

              {/* Handicap Result */}
              {handicap !== null && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950">
                  <p className="text-sm text-muted-foreground">Your Handicap</p>
                  <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                    {handicap > 0 ? `+${handicap}` : handicap}
                  </p>
                  {lastCourseName && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      for {lastCourseName}
                    </p>
                  )}
                </div>
              )}

              {/* FAQ Link */}
              <div className="text-center">
                <Link
                  href="/faq#handicap-calculation"
                  className="text-sm text-muted-foreground underline hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  How does handicap calculation work?
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
