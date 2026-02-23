# Round State Machine

Deterministic, auditable round resolution system with transactional guarantees.

## State Machine
```
OPEN → CLOSED → RESOLVED → SETTLED
```

## Core Components

**RoundService** - Deterministic elimination logic, payout calculation, transactional state updates  
**RoundRepository** - Database operations for rounds  
**RoundController** - Admin endpoint for round resolution  

## API

### Resolve Round
```
POST /api/admin/rounds/resolve
Authorization: Bearer <admin-token>

{
  "roundId": "uuid",
  "playerChoices": [
    { "userId": "uuid", "choice": "HIGH", "stake": 100 }
  ],
  "oracleYield": 5.5,
  "randomSeed": "optional-seed"
}
```

## Features

- **Deterministic**: Same inputs → same outputs
- **Transactional**: All-or-nothing DB writes with rollback
- **Auditable**: Full history in elimination logs
- **Idempotent**: Safe to retry operations
- **Observable**: Prometheus metrics at `/metrics`
