import {
    Repository,
} from "typeorm";

import {
    Settings,
} from "./settings.model";

export class SettingsRepository {

    constructor(
        private settingsRepo: Repository<Settings>
    ) { }

    //
    // GET ALL SETTINGS
    //

    async getSettings() {

        const settings =
            await this.settingsRepo.find();

        return settings;
    }

    //
    // GET BY KEY
    //

    async getByKey(
        key: string
    ) {

        return this.settingsRepo.findOne({

            where: {
                key,
            },
        });
    }

    //
    // UPSERT
    //

    async upsert(
        key: string,
        value: string,
        description?: string
    ) {

        let setting =
            await this.getByKey(
                key
            );

        if (!setting) {

            setting =
                this.settingsRepo.create({

                    key,

                    value,

                    description,
                });

        } else {

            setting.value =
                value;

            if (description) {

                setting.description =
                    description;
            }
        }

        return this.settingsRepo.save(
            setting
        );
    }
}