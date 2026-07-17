import { Redis } from 'ioredis'

/**
 * Event bus Lot 0 — Redis Streams (cf. AFG-DT-000 §4.1, AFG-DT-003 Lot 0).
 * Enveloppe fine : chaque événement métier a un type versionné défini dans
 * `contracts/events` (source de vérité des payloads), publié ici sous forme
 * de stream nommé `events:<domain>`.
 */

export interface DomainEvent<TPayload = unknown> {
  type: string
  version: number
  occurredAt: string
  payload: TPayload
}

export interface EventBusOptions {
  redisUrl: string
  streamPrefix?: string
}

export class EventBus {
  private readonly redis: Redis
  private readonly streamPrefix: string

  constructor({ redisUrl, streamPrefix = 'events' }: EventBusOptions) {
    this.redis = new Redis(redisUrl, { lazyConnect: true })
    this.streamPrefix = streamPrefix
  }

  streamName(domain: string): string {
    return `${this.streamPrefix}:${domain}`
  }

  async connect(): Promise<void> {
    if (this.redis.status === 'ready') return
    await this.redis.connect()
  }

  async disconnect(): Promise<void> {
    this.redis.disconnect()
  }

  /** Publie un événement sur le stream du domaine (ex. "catalog", "payment"). */
  async publish<TPayload>(domain: string, event: Omit<DomainEvent<TPayload>, 'occurredAt'>): Promise<string> {
    await this.connect()
    const full: DomainEvent<TPayload> = { ...event, occurredAt: new Date().toISOString() }
    return this.redis.xadd(this.streamName(domain), '*', 'event', JSON.stringify(full)) as Promise<string>
  }

  /**
   * Lecture bloquante depuis `lastId` (ou '$' pour ne lire que le futur).
   * Un consumer group réel (XGROUP/XREADGROUP) sera introduit quand un
   * premier service consommateur existera (Lot 2+) — cette lecture simple
   * suffit à valider le transport au Lot 0.
   */
  async readFrom<TPayload>(
    domain: string,
    lastId: string,
    { blockMs = 5000 }: { blockMs?: number } = {},
  ): Promise<Array<{ id: string; event: DomainEvent<TPayload> }>> {
    await this.connect()
    const result = await this.redis.xread('BLOCK', blockMs, 'STREAMS', this.streamName(domain), lastId)
    if (!result) return []

    const [, entries] = result[0]!
    return entries.map(([id, fields]: [string, string[]]) => {
      const raw = fields[fields.indexOf('event') + 1]!
      return { id, event: JSON.parse(raw) as DomainEvent<TPayload> }
    })
  }
}
