export type BookingStatus =
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";

export interface BookingListQuery {

    page?: number;

    limit?: number;

    search?: string;

    status?: BookingStatus;

    salon_id?: number;

    sort?: string;

    order?: "ASC" | "DESC";
}

export interface CreateBookingBody {
    salon_id: number;
    date: string;          // "YYYY-MM-DD"
    start_time: string;    // "HH:MM"
    service_ids: number[]; // salon_service ids
    notes?: string;
}

export interface ConfirmPaymentBody {
    booking_id: number;
    payment_intent_id: string;
}
