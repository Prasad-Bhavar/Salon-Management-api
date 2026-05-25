// src/common/utils/slot.util.ts
// ADD these exports to your existing slot.util.ts file
// (keep generateSlots as-is, just add the helpers below)

import { minutesToTime, timeToMinutes } from "./time.util";

export const SLOT_INTERVAL_MINS = 15;

// Already exists in your file — keep it:
export function generateSlots({
    start_time,
    end_time,
    slot_interval = 15,
}: {
    start_time: string;
    end_time: string;
    slot_interval?: number;
}): string[] {
    const slots: string[] = [];
    let current = timeToMinutes(start_time);
    const end = timeToMinutes(end_time);
    while (current < end) {
        slots.push(minutesToTime(current));
        current += slot_interval;
    }
    return slots;
}

// ── ADD these below ────────────────────────────────────────────────────────────

/**
 * How many consecutive slots a booking needs.
 * 30-min service + 15-min interval → 2 slots
 */
export function slotsNeeded(
    totalDurationMins: number,
    intervalMins: number = SLOT_INTERVAL_MINS
): number {
    return Math.ceil(totalDurationMins / intervalMins);
}

/**
 * All slot start-times that will be occupied for one booking.
 * e.g. start="10:00", count=2 → ["10:00", "10:15"]
 */
export function getLockedSlots(
    startSlot: string,
    count: number,
    intervalMins: number = SLOT_INTERVAL_MINS
): string[] {
    const locked: string[] = [];
    let cur = timeToMinutes(startSlot);
    for (let i = 0; i < count; i++) {
        locked.push(minutesToTime(cur));
        cur += intervalMins;
    }
    return locked;
}

/**
 * Check that the booking sequence ends before salon closing time.
 */
export function fitsWithinHours(
    startSlot: string,
    count: number,
    endTime: string,
    intervalMins: number = SLOT_INTERVAL_MINS
): boolean {
    const lastSlotEnd = timeToMinutes(startSlot) + count * intervalMins;
    return lastSlotEnd <= timeToMinutes(endTime);
}