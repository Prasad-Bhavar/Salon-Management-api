export interface ExploreSalonsQuery {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    salon_type?: "male" | "female" | "unisex";
}

export interface SalonDetailParams {

    salonId: number;
}

//
// AVAILABLE SLOTS
//

export interface AvailableSlotsPayload {

    date: string;

    service_ids: number[];
}