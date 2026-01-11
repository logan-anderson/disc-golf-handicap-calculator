import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FAQ() {
  return (
    <main className="flex flex-1 flex-col items-center p-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
              Frequently Asked Questions
            </h1>
            <Link
              href="/"
              className="text-sm font-medium text-emerald-600 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              ← Back to Calculator
            </Link>
          </div>

          {/* How do UDisc ratings work? */}
          <Card id="udisc-ratings">
            <CardHeader>
              <CardTitle>How do UDisc ratings work?</CardTitle>
              <CardDescription>
                Understanding the UDisc rating system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                UDisc ratings are a numerical representation of your disc golf skill level. 
                The rating system is based on your round scores compared to other players 
                who have played the same course layouts.
              </p>
              <p className="text-muted-foreground">
                For a comprehensive explanation of how UDisc calculates round ratings, 
                check out the official UDisc blog post:
              </p>
              <a
                href="https://udisc.com/blog/post/udisc-round-ratings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-medium text-emerald-600 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                UDisc Round Ratings Explained →
              </a>
            </CardContent>
          </Card>

          {/* How does the handicap calculation work? */}
          <Card id="handicap-calculation">
            <CardHeader>
              <CardTitle>How does the handicap calculation work?</CardTitle>
              <CardDescription>
                Breaking down the algorithm step by step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The handicap calculation converts the difference between your UDisc rating 
                and a course&apos;s par rating into strokes. Here&apos;s how it works:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">1. Points Per Stroke</h4>
                  <p className="text-sm text-muted-foreground">
                    The UDisc rating system is nonlinear—better players earn more rating points 
                    per stroke of improvement. The algorithm estimates this scaling factor based 
                    on rating level:
                  </p>
                  <ul className="mt-2 list-disc pl-6 text-sm text-muted-foreground">
                    <li>Ratings around 150: ~4 points per stroke</li>
                    <li>Ratings around 200: ~7 points per stroke</li>
                    <li>Ratings around 230+: ~10-15 points per stroke</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">2. Course Length Adjustment</h4>
                  <p className="text-sm text-muted-foreground">
                    Courses with fewer holes mean each stroke has a greater impact on your 
                    overall rating. The algorithm adjusts for this—a 9-hole course will have 
                    slightly more points per stroke than an 18-hole course.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">3. Converting to Strokes</h4>
                  <p className="text-sm text-muted-foreground">
                    Your handicap is calculated by taking the difference between your rating 
                    and the course&apos;s par rating, then dividing by the adjusted points per stroke. 
                    The result is rounded to the nearest whole number.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">4. Understanding the Result</h4>
                  <ul className="mt-2 list-disc pl-6 text-sm text-muted-foreground">
                    <li>
                      <strong>Negative handicap (e.g., -3):</strong> You&apos;re expected to score 
                      3 strokes below the course par rating
                    </li>
                    <li>
                      <strong>Positive handicap (e.g., +5):</strong> You&apos;re expected to score 
                      5 strokes above the course par rating
                    </li>
                    <li>
                      <strong>Zero handicap:</strong> Your rating matches the course par rating
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How does stroke difference work? */}
          <Card id="stroke-difference">
            <CardHeader>
              <CardTitle>How does stroke difference work?</CardTitle>
              <CardDescription>
                Leveling the playing field between players of different skill levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Stroke difference helps make matches fair between players of different skill 
                levels. The player with the higher handicap (less skilled) receives extra 
                strokes to use during the round.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">How it&apos;s calculated:</h4>
                  <ol className="mt-2 list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Calculate each player&apos;s handicap for the selected course</li>
                    <li>Find the absolute difference between the two handicaps</li>
                    <li>Multiply by the stroke percentage (default 80%)</li>
                    <li>Round down to the nearest whole number</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">Why 80%?</h4>
                  <p className="text-sm text-muted-foreground">
                    The default 80% stroke percentage prevents overcorrection. Giving 100% 
                    of the difference would often favor the higher-handicap player too much. 
                    The 80% rule keeps matches competitive while still being fair.
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">Example:</h4>
                  <div className="mt-2 text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Person One:</strong> Handicap of -1 (scores 1 under par rating)
                    </p>
                    <p>
                      <strong>Person Two:</strong> Handicap of +3 (scores 3 over par rating)
                    </p>
                    <p className="pt-2">
                      <strong>Difference:</strong> |-1 - 3| = 4 strokes
                    </p>
                    <p>
                      <strong>After 80% adjustment:</strong> floor(4 × 0.8) = 3 strokes
                    </p>
                    <p className="pt-2 font-medium text-emerald-700 dark:text-emerald-400">
                      Result: Person Two gets 3 strokes to use on any holes of their choosing. 
                      The holes must be predetermined before the match starts.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">Using the strokes:</h4>
                  <p className="text-sm text-muted-foreground">
                    Before starting the match, the player receiving strokes chooses which 
                    holes to apply them to. On those holes, they subtract one stroke from 
                    their score. This is decided upfront so both players know the stakes 
                    on each hole.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </main>
  );
}
