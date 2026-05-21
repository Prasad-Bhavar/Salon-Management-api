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