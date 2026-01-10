"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

import { courses, Course } from "@/lib/courses";
import { calculateHandicap } from "@/lib/handicap";

export default function Home() {
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

  const isFormValid = manualEntry
    ? udiscRating &&
      !isNaN(parseFloat(udiscRating)) &&
      manualParRating &&
      !isNaN(parseFloat(manualParRating)) &&
      manualHoles &&
      !isNaN(parseInt(manualHoles)) &&
      parseInt(manualHoles) > 0
    : selectedCourse && udiscRating && !isNaN(parseFloat(udiscRating));

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Disc Golf Handicap Calculator</CardTitle>
          <CardDescription>
            Select a course or enter course details manually, then enter your UDisc rating to calculate your
            handicap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>
      </main>

      <footer className="border-t border-emerald-200 dark:border-emerald-800">
        <div className="flex flex-col items-center px-4 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
          <p className="mt-6 text-sm text-muted-foreground md:mt-0">
            © Copyright {new Date().getFullYear()}. All rights reserved. Made
            with ❤️ by{" "}
            <a
              href="https://logan.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Logan Anderson
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
