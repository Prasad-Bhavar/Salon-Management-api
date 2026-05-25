import {
    Repository,
} from "typeorm";

import {
    SlotLocks,
} from "./slot-locks.model";

import {
    BookingSlots,
} from "~/modules/bookings/booking-slots.model";

import {
    BlockedSlots,
} from "~/modules/bookings/blocked-slots.model";

import {
    SalonAvailability,
} from "~/modules/salons/salon-availability.model";

import {
    LockSlotPayload,
} from "./slot-locking.types";

import {
    timeToMinutes,
} from "~/common/utils/time.util";

import {
    Settings,
} from "~/modules/settings/settings.model";

export class SlotLockingRepository {

    constructor(

        private slotLockRepo:
            Repository<SlotLocks>,

        private bookingSlotRepo:
            Repository<BookingSlots>,

        private blockedSlotRepo:
            Repository<BlockedSlots>,

        private availabilityRepo:
            Repository<SalonAvailability>,
        private settingsRepo:
            Repository<Settings>,
    ) { }

    //
    // CREATE LOCK
    //

    async createLock(
        customerId: number,
        payload: LockSlotPayload
    ) {

        //
        // GET WEEKDAY
        //

        const selectedDate =
            new Date(
                payload.slot_date
            );

        const weekday =
            selectedDate
                .toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                    }
                );

        //
        // AVAILABILITY
        //

        const availability =
            await this.availabilityRepo
                .findOne({
                    where: {
                        salon: {
                            id:
                                payload.salon_id,
                        },
                        day_of_week:
                            weekday,
                        is_closed: false,
                    },
                });

        if (!availability) {

            return {
                success: false,
                message:
                    "Salon closed on selected day",
            };
        }

        //
        // SLOT MINUTES
        //

        const requestedStart =
            timeToMinutes(
                payload.start_time
            );

        const requestedEnd =
            timeToMinutes(
                payload.end_time
            );

        //
        // BLOCKED CHECK
        //

        const blockedSlots =
            await this.blockedSlotRepo
                .find({
                    where: {
                        salon: {
                            id:
                                payload.salon_id,
                        },
                        date:
                            payload.slot_date,
                    },
                });

        for (const blocked of blockedSlots) {

            const blockedStart =
                timeToMinutes(
                    blocked.start_time
                );

            const blockedEnd =
                timeToMinutes(
                    blocked.end_time
                );

            const overlaps =
                (
                    requestedStart <
                    blockedEnd
                )
                &&
                (
                    requestedEnd >
                    blockedStart
                );

            if (overlaps) {

                return {

                    success: false,

                    message:
                        "Slot blocked by salon",
                };
            }
        }

        //
        // EXISTING BOOKINGS
        //

        const bookings =
            await this.bookingSlotRepo
                .find({
                    where: {
                        salon: {
                            id:
                                payload.salon_id,
                        },
                        slot_date:
                            payload.slot_date,
                    },
                });

        //
        // ACTIVE LOCKS
        //

        const activeLocks =
            await this.slotLockRepo
                .createQueryBuilder(
                    "lock"
                )
                .where(
                    "lock.salon_id = :salonId",
                    {
                        salonId:
                            payload.salon_id,
                    }
                )
                .andWhere(
                    "lock.slot_date = :slotDate",
                    {
                        slotDate:
                            payload.slot_date,
                    }
                )
                .andWhere(
                    "lock.locked_until > NOW()"
                )
                .getMany();

        //
        // COUNT OVERLAPS
        //

        let overlapCount = 0;

        //
        // BOOKINGS
        //

        for (const booking of bookings) {

            const bookingStart =
                timeToMinutes(
                    booking.start_time
                );

            const bookingEnd =
                timeToMinutes(
                    booking.end_time
                );

            const overlaps =
                (
                    requestedStart <
                    bookingEnd
                )
                &&
                (
                    requestedEnd >
                    bookingStart
                );

            if (overlaps) {
                overlapCount++;
            }
        }

        //
        // LOCKS
        //

        for (const lock of activeLocks) {

            const lockStart =
                timeToMinutes(
                    lock.start_time
                );

            const lockEnd =
                timeToMinutes(
                    lock.end_time
                );

            const overlaps =
                (
                    requestedStart <
                    lockEnd
                )
                &&
                (
                    requestedEnd >
                    lockStart
                );

            if (overlaps) {
                overlapCount++;
            }
        }

        //
        // CAPACITY CHECK
        //

        if (
            overlapCount >=
            availability.capacity
        ) {

            return {

                success: false,

                message:
                    "Slot fully booked",
            };
        }

        //
        // LOCK EXPIRY
        //

        //
        // SETTINGS
        //

        const lockSetting =
            await this.settingsRepo
                .findOne({
                    where: {
                        key:
                            "slot_lock_minutes",
                    },
                });

        const lockMinutes =
            Number(
                lockSetting?.value || 5
            );

        //
        // LOCK EXPIRY
        //

        const lockedUntil =
            new Date(
                Date.now()
                + lockMinutes
                * 60
                * 1000
            );

        //
        // PAST DATE/TIME VALIDATION
        //

        const now =
            new Date();

        const slotDateTime =
            new Date(
                `${payload.slot_date}T${payload.start_time}`
            );

        if (
            slotDateTime <= now
        ) {

            return {

                success: false,

                message:
                    "Cannot lock past slot",
            };
        }

        //
        // CREATE LOCK
        //

        const lock =
            this.slotLockRepo.create({

                customer: {
                    id: customerId,
                },

                salon: {
                    id:
                        payload.salon_id,
                },

                slot_date:
                    payload.slot_date,

                start_time:
                    payload.start_time,

                end_time:
                    payload.end_time,

                locked_until:
                    lockedUntil,
            });

        const savedLock =
            await this.slotLockRepo
                .save(lock);

        //
        // RESPONSE
        //

        return {

            success: true,

            data: {

                id:
                    savedLock.id,

                locked_until:
                    lockedUntil,
            },
        };
    }
}