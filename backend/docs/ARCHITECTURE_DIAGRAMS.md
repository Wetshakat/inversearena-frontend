# Architecture Diagrams

## Round State Machine Flow

```
Admin Request
     ↓
RoundController (validation)
     ↓
RoundService (business logic)
     ↓
Prisma Transaction
  ├─ Validate state
  ├─ Compute eliminations
  ├─ Calculate payouts
  ├─ Create elimination logs
  └─ Update round state
     ↓
PostgreSQL Database
```

## State Transitions

```
OPEN ──→ CLOSED ──→ RESOLVED ──→ SETTLED
```

## Payout Execution Flow

```
createPayoutTransaction
     ↓
Build Soroban TX
     ↓
Prepare with RPC
     ↓
Check max gas
     ↓
Sign (hot key) OR return unsigned
     ↓
Store in DB
     ↓
Worker submits
     ↓
Worker confirms
     ↓
Update status
```

## Data Flow

```
Input → Hash Function → Eliminations → Payouts → Output
```

## Monitoring

```
Service → Metrics → Prometheus → Grafana
```
