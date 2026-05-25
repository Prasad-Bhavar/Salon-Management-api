import {
    minutesToTime,
    timeToMinutes,
} from "./time.util";

//
// GENERATE SLOTS
//

export function generateSlots({

    start_time,

    end_time,

    slot_interval = 15,

}: {

    start_time: string;

    end_time: string;

    slot_interval?: number;
}) {

    const slots: string[] = [];

    let current =
        timeToMinutes(
            start_time
        );

    const end =
        timeToMinutes(
            end_time
        );

    while (
        current < end
    ) {

        slots.push(
            minutesToTime(current)
        );

        current += slot_interval;
    }

    return slots;
}