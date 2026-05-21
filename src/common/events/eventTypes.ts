export const EVENTS = {
  ENTITY_CREATED: "entity.created",
  ENTITY_UPDATED: "entity.updated",
  ENTITY_STATUS_CHANGED: "entity.status.changed",

  // OKR FLOW
  OKR_ASSIGNED: "okr.assigned",
  OKR_REVIEW_COMPLETED: "okr.review.completed",

  // EVALUATION FLOW
  EVALUATION_SUBMITTED: "evaluation.submitted",
    EVALUATION_UPDATED:   "evaluation.updated",
} as const;