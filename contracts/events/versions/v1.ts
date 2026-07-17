/**
 * Types d'événements v1 — contrats du bus (Redis Streams, cf. @shared/core/eventBus).
 * Un événement par ligne des sections "Événements" des fiches modules/*.md.
 * Figés tôt (cf. AFG-DT-003 principe 5) : toute évolution incompatible passe
 * par une v2 (nouveau fichier `versions/v2.ts`), jamais par une mutation
 * silencieuse d'un type v1 déjà consommé.
 */

interface BaseEvent<TType extends string, TPayload> {
  type: TType
  version: 1
  occurredAt: string
  payload: TPayload
}

// --- identity-service ---
export type UserRegisteredEvent = BaseEvent<'UserRegistered', { userId: string; email?: string; locale: string }>
export type CurfewChangedEvent = BaseEvent<
  'CurfewChanged',
  { familyId: string; profileId: string; enabled: boolean }
>

// --- publishing-service ---
export type GameSubmittedEvent = BaseEvent<'GameSubmitted', { submissionId: string; creatorId: string }>
export type GamePublishedEvent = BaseEvent<
  'GamePublished',
  { gameId: string; creatorId: string; versionId: string; taxonomy: string[] }
>
export type GameUpdatedEvent = BaseEvent<'GameUpdated', { gameId: string; versionId: string }>
export type GameRejectedEvent = BaseEvent<'GameRejected', { submissionId: string; reason: string }>

// --- catalog-service ---
export type GameIndexedEvent = BaseEvent<'GameIndexed', { gameId: string }>
export type AccessGrantedEvent = BaseEvent<'AccessGranted', { profileId: string; gameId: string; source: string }>
export type AccessRevokedEvent = BaseEvent<'AccessRevoked', { profileId: string; gameId: string }>

// --- game-service ---
export type SessionStartedEvent = BaseEvent<'SessionStarted', { sessionId: string; gameId: string; profileIds: string[] }>
export type SessionEndedEvent = BaseEvent<
  'SessionEnded',
  { sessionId: string; gameId: string; profileIds: string[]; skillsMobilized: string[] }
>
export type AchievementUnlockedEvent = BaseEvent<'AchievementUnlocked', { profileId: string; achievementId: string }>
export type ScoreRecordedEvent = BaseEvent<'ScoreRecorded', { profileId: string; gameId: string; score: number }>

// --- payment-service ---
export type PaymentSucceededEvent = BaseEvent<
  'PaymentSucceeded',
  { orderId: string; profileId: string; gameId?: string; amount: number; currency: string }
>
export type SubscriptionChangedEvent = BaseEvent<
  'SubscriptionChanged',
  { familyId: string; plan: string; status: 'active' | 'cancelled' | 'expired' }
>

// --- skills-idc-service ---
export type IDCInitializedEvent = BaseEvent<'IDCInitialized', { gameId: string; level: 1 }>
export type IDCUpdatedEvent = BaseEvent<'IDCUpdated', { profileId: string; skillFamily: string; level: number }>

// --- notification-service ---
export type NotificationCreatedEvent = BaseEvent<
  'NotificationCreated',
  { notificationId: string; userId: string; channel: string }
>

// --- social-service (P2) ---
export type InvitationSentEvent = BaseEvent<'InvitationSent', { fromProfileId: string; toProfileId: string }>

// --- griot-service (P2) ---
export type CulturalContentPublishedEvent = BaseEvent<'CulturalContentPublished', { cardId: string; gameId?: string }>

// --- ai-service (P2) ---
export type ModerationDecisionEvent = BaseEvent<
  'ModerationDecision',
  { targetType: string; targetId: string; decision: 'approved' | 'rejected' | 'flagged' }
>
export type AICheckResultEvent = BaseEvent<'AICheckResult', { submissionId: string; passed: boolean }>

// --- tournament-service (P2) ---
export type TournamentScheduledEvent = BaseEvent<'TournamentScheduled', { tournamentId: string; gameId: string }>
export type TournamentMatchScheduledEvent = BaseEvent<
  'TournamentMatchScheduled',
  { tournamentId: string; matchId: string; profileIds: string[] }
>

// --- governance-service (P2) ---
export type ValidationDecisionEvent = BaseEvent<
  'ValidationDecision',
  { submissionId: string; decision: 'approved' | 'rejected' | 'changes-requested' }
>

// --- i18n-service (P2) ---
export type TranslationPublishedEvent = BaseEvent<'TranslationPublished', { locale: string; gameId?: string }>

// --- studio-service (P3) ---
export type StudioGameReadyForPublishEvent = BaseEvent<'StudioGameReadyForPublish', { projectId: string; creatorId: string }>

export type DomainEventV1 =
  | UserRegisteredEvent
  | CurfewChangedEvent
  | GameSubmittedEvent
  | GamePublishedEvent
  | GameUpdatedEvent
  | GameRejectedEvent
  | GameIndexedEvent
  | AccessGrantedEvent
  | AccessRevokedEvent
  | SessionStartedEvent
  | SessionEndedEvent
  | AchievementUnlockedEvent
  | ScoreRecordedEvent
  | PaymentSucceededEvent
  | SubscriptionChangedEvent
  | IDCInitializedEvent
  | IDCUpdatedEvent
  | NotificationCreatedEvent
  | InvitationSentEvent
  | CulturalContentPublishedEvent
  | ModerationDecisionEvent
  | AICheckResultEvent
  | TournamentScheduledEvent
  | TournamentMatchScheduledEvent
  | ValidationDecisionEvent
  | TranslationPublishedEvent
  | StudioGameReadyForPublishEvent
