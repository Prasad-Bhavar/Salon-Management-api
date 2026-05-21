import {
    SettingsRepository,
} from "./settings.repository";

export class SettingsService {

    constructor(
        private repository: SettingsRepository
    ) { }

    //
    // GET SETTINGS
    //

    async getSettings() {

        const settings =
            await this.repository.getSettings();

        const formatted = {

            platform_commission:
                settings.find(
                    (s) =>
                        s.key ===
                        "platform_commission"
                )?.value || "15",

            slot_duration:
                settings.find(
                    (s) =>
                        s.key ===
                        "slot_duration"
                )?.value || "30",
        };

        return {

            statusCode: 200,

            message:
                "Settings fetched successfully",

            data: formatted,
        };
    }

    //
    // UPDATE SETTINGS
    //

    async updateSettings(
        body: any
    ) {

        const {

            platform_commission,

            slot_duration,

        } = body;

        await this.repository.upsert(

            "platform_commission",

            String(
                platform_commission
            ),

            "Platform commission percentage"
        );

        await this.repository.upsert(

            "slot_duration",

            String(
                slot_duration
            ),

            "Default booking slot duration"
        );

        return {

            statusCode: 200,

            message:
                "Settings updated successfully",
        };
    }
}