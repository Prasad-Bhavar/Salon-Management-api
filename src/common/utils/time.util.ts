//
// TIME STRING → MINUTES
//

export function timeToMinutes(
    time: string
) {

    const [hours, minutes] =
        time.split(":").map(Number);

    return (
        hours * 60 +
        minutes
    );
}

//
// MINUTES → TIME STRING
//

export function minutesToTime(
    totalMinutes: number
) {

    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const minutes =
        totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}