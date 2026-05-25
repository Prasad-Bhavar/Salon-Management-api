import {
    SlotLockingRepository,
} from "./slot-locking.repository";

import {
    LockSlotPayload,
} from "./slot-locking.types";

export class SlotLockingService {

    constructor(
        private repository:
            SlotLockingRepository
    ) { }

    //
    // LOCK SLOT
    //

    async lockSlot(
        customerId: number,
        payload: LockSlotPayload
    ) {

        const result =
            await this.repository
                .createLock(
                    customerId,
                    payload
                );

        //
        // FAILED
        //

        if (!result.success) {

            return {

                statusCode: 400,

                message:
                    result.message,

                data: null,
            };
        }

        //
        // SUCCESS
        //

        return {

            statusCode: 201,

            message:
                "Slot locked successfully",

            data:
                result.data,
        };
    }
}