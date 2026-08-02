import { NextRequest, NextResponse } from "next/server";
import {
  BiologicalSex,
  KM_PER_MILE,
  PaceKey,
  estimateCalories,
  estimateStepsPerMile,
  estimateTimeHours,
  getPaceOption,
  hoursToMinutes,
  lbToKg,
  stepsToMiles,
} from "@/lib/steps";
import { checkRateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";

const DEFAULT_HEIGHT_INCHES = 66;
const DEFAULT_SEX: BiologicalSex = "female";
const DEFAULT_PACE: PaceKey = "average";
const DEFAULT_WEIGHT_LB = 150;

const VALID_SEXES: BiologicalSex[] = ["female", "male"];
const VALID_PACES: PaceKey[] = ["slow", "average", "brisk", "running"];

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function errorResponse(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function GET(request: NextRequest) {
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(clientKey);

  const rateLimitHeaders = {
    "X-RateLimit-Limit": String(rateLimit.limit),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
  };

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "Rate limit exceeded. This API allows 100 requests per hour per IP address. Try again later.",
      },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  const { searchParams } = new URL(request.url);

  const stepsParam = searchParams.get("steps");
  const steps = stepsParam === null ? NaN : Number(stepsParam);
  if (stepsParam === null || !Number.isFinite(steps) || steps < 0) {
    return errorResponse(
      400,
      "A valid, non-negative 'steps' query parameter is required, e.g. ?steps=10000."
    );
  }

  const heightParam = searchParams.get("height");
  let height = DEFAULT_HEIGHT_INCHES;
  if (heightParam !== null) {
    height = Number(heightParam);
    if (!Number.isFinite(height) || height <= 0) {
      return errorResponse(
        400,
        "'height' must be a positive number of inches, e.g. ?height=69."
      );
    }
  }

  const sexParam = searchParams.get("sex");
  let sex: BiologicalSex = DEFAULT_SEX;
  if (sexParam !== null) {
    if (!VALID_SEXES.includes(sexParam as BiologicalSex)) {
      return errorResponse(
        400,
        "'sex' must be either 'female' or 'male' if provided."
      );
    }
    sex = sexParam as BiologicalSex;
  }

  const paceParam = searchParams.get("pace");
  let pace: PaceKey = DEFAULT_PACE;
  if (paceParam !== null) {
    if (!VALID_PACES.includes(paceParam as PaceKey)) {
      return errorResponse(
        400,
        "'pace' must be one of 'slow', 'average', 'brisk', or 'running' if provided."
      );
    }
    pace = paceParam as PaceKey;
  }

  const weightParam = searchParams.get("weight");
  let weightLb = DEFAULT_WEIGHT_LB;
  if (weightParam !== null) {
    weightLb = Number(weightParam);
    if (!Number.isFinite(weightLb) || weightLb <= 0) {
      return errorResponse(
        400,
        "'weight' must be a positive number of pounds, e.g. ?weight=150."
      );
    }
  }

  const stepsPerMile = estimateStepsPerMile(height, sex);
  const weightKg = lbToKg(weightLb);
  const miles = stepsToMiles(steps, stepsPerMile);
  const km = miles * KM_PER_MILE;
  const paceOption = getPaceOption(pace);
  const hours = estimateTimeHours(miles, paceOption.mph);
  const calories = estimateCalories(paceOption.met, weightKg, hours);

  return NextResponse.json(
    {
      miles: Number(miles.toFixed(2)),
      km: Number(km.toFixed(2)),
      estimatedMinutes: hoursToMinutes(hours),
      estimatedCalories: Math.round(calories),
      stepsPerMile: Math.round(stepsPerMile),
      source: SITE_URL,
    },
    { headers: rateLimitHeaders }
  );
}
