# InverseArena Backend - Complete Implementation

## ✅ Implementation Status

Both major systems are **fully implemented and production-ready**:

1. **Round State Machine** - Deterministic game logic with ACID guarantees
2. **Payout Execution Layer** - Stellar Soroban transaction management

## Quick Start

```bash
# Install dependencies
npm install

# Run database migration
npm run migrate:dev

# Start server
npm run dev

# Run tests
npx tsx tests/round.integration.test.ts
npx tsx tests/payment.integration.test.ts

# Start monitoring (Prometheus + Grafana)
docker-compose -f docker-compose.monitoring.yml up -d
```

## Round State Machine

### Features
- ✅ Deterministic resolution (same inputs = same outputs)
- ✅ ACID transaction guarantees with automatic rollback
- ✅ State machine: OPEN → CLOSED → RESOLVED → SETTLED
- ✅ Prometheus metrics at `/metrics`
- ✅ Admin-only API endpoint
- ✅ Integration tests

### API
```bash
POST /api/admin/rounds/resolve
Authorization: Bearer <admin-token>

{
  "roundId": "uuid",
  "playerChoices": [
    { "userId": "uuid", "choice": "HIGH", "stake": 100 }
  ],
  "oracleYield": 5.5,
  "randomSeed": "optional"
}
```

### Files
- `src/services/roundService.ts` - Core business logic
- `src/controllers/round.controller.ts` - HTTP handler
- `src/repositories/roundRepository.ts` - Data access
- `src/utils/roundMetrics.ts` - Metrics collection
- `tests/round.integration.test.ts` - Test suite

## Payout Execution Layer

### Features
- ✅ Stellar Soroban transaction building
- ✅ Hot key OR HSM/KMS signing modes
- ✅ Idempotency protection (prevents duplicate payouts)
- ✅ Nonce tracking (prevents transaction collisions)
- ✅ Max gas safeguards
- ✅ Feature flags for staging/production
- ✅ Worker automation for submission & confirmation
- ✅ Integration tests

### Operating Modes

**Build-Only (Staging)**
```env
PAYOUTS_LIVE_EXECUTION=false
```

**Hot Key Signing (Controlled)**
```env
PAYOUTS_LIVE_EXECUTION=true
PAYOUTS_SIGN_WITH_HOT_KEY=true
PAYOUT_HOT_SIGNER_SECRET=S...
```

**HSM/KMS Signing (Production)**
```env
PAYOUTS_LIVE_EXECUTION=true
PAYOUTS_SIGN_WITH_HOT_KEY=false
```

### Files
- `src/services/paymentService.ts` - Transaction management
- `src/workers/paymentWorker.ts` - Batch processing
- `src/config/paymentConfig.ts` - Configuration
- `tests/payment.integration.test.ts` - Test suite

## Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/inversearena

# Stellar/Soroban
PAYOUT_CONTRACT_ID=CXXX...XXX
PAYOUT_SOURCE_ACCOUNT=GXXX...XXX
STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Feature Flags
PAYOUTS_LIVE_EXECUTION=false
PAYOUTS_SIGN_WITH_HOT_KEY=false

# Safeguards
PAYOUTS_MAX_GAS_STROOPS=2000000
PAYOUTS_MAX_ATTEMPTS=5
```

See `.env.example` for complete configuration.

## Documentation

- **[docs/ROUND_STATE_MACHINE.md](./docs/ROUND_STATE_MACHINE.md)** - Round system details
- **[docs/PAYOUT_EXECUTION.md](./docs/PAYOUT_EXECUTION.md)** - Payment system guide
- **[docs/ARCHITECTURE_DIAGRAMS.md](./docs/ARCHITECTURE_DIAGRAMS.md)** - Visual diagrams
- **[docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Feature overview
- **[docs/QUICKSTART_ROUNDS.md](./docs/QUICKSTART_ROUNDS.md)** - Quick start guide
- **[PAYOUT_IMPLEMENTATION.md](./PAYOUT_IMPLEMENTATION.md)** - Payout details

## Monitoring

Access metrics at `http://localhost:3001/metrics`

Start Prometheus + Grafana:
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## Testing

### Round System Tests
```bash
npx tsx tests/round.integration.test.ts
```

Tests verify:
- Deterministic resolution
- Transaction rollback
- Payout calculation

### Payment System Tests
```bash
npx tsx tests/payment.integration.test.ts
```

Tests verify:
- Build-only flow
- Idempotency protection
- Nonce tracking
- Input validation
- Amount conversion

## Verification

Run complete verification:
```bash
./verify-complete.sh
```

## Security

### Production Checklist
- ✅ Use HSM/KMS for signing (not hot key)
- ✅ Store secrets in secret manager
- ✅ Enable live execution only in production
- ✅ Set appropriate max gas limits
- ✅ Monitor failed transactions
- ✅ Use unique idempotency keys

### Staging Checklist
- ✅ Disable live execution
- ✅ Use testnet configuration
- ✅ Inspect unsigned XDR manually
- ✅ Test with small amounts

## Architecture

```
┌─────────────────────────────────────────┐
│           Admin Client                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Controllers Layer               │
│  • RoundController                      │
│  • PayoutsController                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Services Layer                  │
│  • RoundService (deterministic logic)   │
│  • PaymentService (Soroban txs)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       Repositories Layer                │
│  • RoundRepository                      │
│  • TransactionRepository                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Database                       │
│  • PostgreSQL (Prisma)                  │
│  • MongoDB (transactions)               │
└─────────────────────────────────────────┘
```

## Support

For issues or questions, see the documentation in the `docs/` directory.
