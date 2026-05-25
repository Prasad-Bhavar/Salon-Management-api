import {
    Response,
} from "express";

import {
    asyncHandler,
} from "~/common/utils/asyncHandler";

import {
    apiResponse,
} from "~/common/utils/apiResponse";

import {
    SlotLockingService,
} from "./slot-locking.service";

export class SlotLockingController {

    constructor(
        private service:
            SlotLockingService
    ) { }

    //
    // LOCK SLOT
    // POST /slot-locking/lock
    //

    lock =
        asyncHandler(
            async (
                req: any,
                res: any
            ) => {

                const customerId =
                    Number(
                        req.user.id
                    );

                const response: any =
                    await this.service
                        .lockSlot(
                            customerId,
                            {

                                salon_id:
                                    req.body.salon_id,

                                slot_date:
                                    req.body.slot_date,

                                start_time:
                                    req.body.start_time,

                                end_time:
                                    req.body.end_time,

                                service_ids:
                                    req.body.service_ids,
                            }
                        );

                return apiResponse(
                    res,
                    response
                );
            }
        );
}