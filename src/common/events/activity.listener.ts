import { eventBus } from "./eventBus";
import { EVENTS } from "./eventTypes";

import { AppDataSource } from "~/config/database";
import { ActivityLogs } from "~/modules/activity-log/activity-log.model";
import { Notifications } from "~/modules/notification/notification.model";
import { Users } from "~/modules/user/user.model";

const auditRepo = AppDataSource.getRepository(ActivityLogs);
const notificationRepo = AppDataSource.getRepository(Notifications);
const userRepo = AppDataSource.getRepository(Users);

async function resolveRecipients(
  recipients?: number[],
  targetRoles?: string[]
): Promise<number[]> {

  // If explicit recipients provided → use them
  if (recipients && recipients.length > 0) {
    return recipients;
  }

  // If role-based recipients requested
  if (targetRoles && targetRoles.length > 0) {

    const users = await userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("role.slug IN (:...roles)", { roles: targetRoles })
      .andWhere("user.status = :status", { status: "active" })
      .getMany();

    return users.map((u) => u.id);
  }

  return [];
}

async function logAndMaybeNotify(
  module: string,
  description: string,
  userId: number,
  notify?: boolean,
  recipients?: number[],
  targetRoles?: string[],
  redirect_url?: string
) {

  await auditRepo.save({
    type: module,
    description,
    performed_by: { id: userId },
    activity_date: new Date(),
  });

  if (!notify) return;

  const resolvedRecipients = await resolveRecipients(recipients, targetRoles);

  if (resolvedRecipients.length === 0) return;

  const notifications = resolvedRecipients.map((id) => ({
    description,
    redirect_url,
    recipient: { id },
    created_by: { id: userId }
  }));

  await notificationRepo.save(notifications);
}

function getEntityLabel(entity: any): string {
  if (!entity) return "Item";

  if (typeof entity === "string") return entity;

  return entity.name || entity.title || entity.id || "Item";
}

eventBus.on(EVENTS.ENTITY_CREATED, async (payload: any) => {

  const {
    module,
    entity,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  } = payload;

  const label = getEntityLabel(entity);

  const description = `${module} "${label}" created`;

  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});

eventBus.on(EVENTS.ENTITY_UPDATED, async (payload: any) => {
  const { module, entity, userId, notify, recipients, targetRoles, redirect_url } = payload;

  const label = getEntityLabel(entity);

  const description = `${module} "${label}" updated`;

  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});

eventBus.on(EVENTS.ENTITY_STATUS_CHANGED, async (payload: any) => {

  const {
    module,
    entity,
    status,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  } = payload;

  const label = getEntityLabel(entity);

  const description = `${module} "${label}" status changed to ${status}`;

  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});

eventBus.on(EVENTS.OKR_REVIEW_COMPLETED, async (payload: any) => {
  const {
    module,
    entity,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  } = payload;

  const label = getEntityLabel(entity);

  const description = `${module} "${label}" review completed`;

  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});

eventBus.on(EVENTS.OKR_ASSIGNED, async (payload: any) => {
  const {
    module,
    entity,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  } = payload;

  const label = getEntityLabel(entity);

  const description = `${module} "${label}" assigned to you.`;

  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});

eventBus.on(EVENTS.EVALUATION_SUBMITTED, async (payload: any) => {

  const {
    module,
    entity,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  } = payload;

  const description =
    `${module} submitted for "${entity.title}" cycle`;

  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});


eventBus.on(EVENTS.EVALUATION_UPDATED, async (payload: any) => {
 
  const {
    module,
    entity,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  } = payload;
 
  const description =
    `${module} updated for "${entity.title}" cycle`;
 
  await logAndMaybeNotify(
    module,
    description,
    userId,
    notify,
    recipients,
    targetRoles,
    redirect_url
  );
});