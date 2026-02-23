# Payout Execution Layer - Complete Guide

## Overview

Production-ready Stellar Soroban payout execution with:
- ✅ Server-side transaction building
- ✅ Hot key OR HSM signing modes
- ✅ Safeguards: max gas, nonce tracking, idempotency
- ✅ Feature flags for staging/production
- ✅ Automatic retry and confirmation polling

## Architecture

```
createPayoutTransaction → buildPreparedTransaction → [sign OR queue] → submitQueuedTransaction → confirmSubmittedTransaction
```

## Modes of Operation

### 1. Build-Only Mode (Staging/Testing)
```env
PAYOUTS_LIVE_EXECUTION=false
```
- Builds unsigned XDR
- No submission to blockchain
- Safe for testing

### 2. Hot Key Signing (Controlled Environments)
```env
PAYOUTS_LIVE_EXECUTION=true
PAYOUTS_SIGN_WITH_HOT_KEY=true
PAYOUT_HOT_SIGNER_SECRET=S...
```
- Automatic signing with hot key
- Immediate submission
- Use only in secure environments

### 3. HSM/External Signing (Production)
```env
PAYOUTS_LIVE_EXECUTION=true
PAYOUTS_SIGN_WITH_HOT_KEY=false
```
- Returns unsigned XDR
- External signing via HSM/KMS
- Submit signed XDR via `queueSignedTransaction`

## API Usage

### Create Payout Transaction

```typescript
const result = await paymentService.createPayoutTransaction({
  payoutId: "round-1-winner-1",
  destinationAccount: "GXXX...XXX",
  amount: "100.5000000",
  asset: "XLM",
  idempotencyKey: "round-1:winner-1:2026-02-22"
});

// Build-only mode
if (result.mode === "build_only") {
  console.log("Unsigned XDR:", result.unsignedXdr);
  // Inspect or sign externally
}

// Queued mode (hot key signed)
if (result.mode === "queued") {
  console.log("Transaction queued:", result.transaction.id);
  // Worker will submit automatically
}
```

### External Signing Flow

```typescript
// 1. Create transaction (returns unsigned XDR)
const result = await paymentService.createPayoutTransaction({...});

// 2. Sign with HSM/KMS
const signedXdr = await externalSigner.sign(result.unsignedXdr);

// 3. Queue signed transaction
await paymentService.queueSignedTransaction(
  result.transaction.id,
  signedXdr
);

// 4. Worker submits and confirms
```

### Manual Submission & Confirmation

```typescript
// Submit
const submitResult = await paymentService.submitQueuedTransaction(txId);
if (submitResult.submitted) {
  console.log("Submitted with hash:", submitResult.transaction.txHash);
}

// Confirm (with polling)
const confirmed = await paymentService.pollConfirmation(txId);
console.log("Final status:", confirmed.status);
```

## Safeguards

### 1. Idempotency
```typescript
// Same idempotency key returns existing transaction
const tx1 = await paymentService.createPayoutTransaction({
  idempotencyKey: "round-1:winner-1",
  // ...
});

const tx2 = await paymentService.createPayoutTransaction({
  idempotencyKey: "round-1:winner-1", // Same key
  // ...
});

// tx1.transaction.id === tx2.transaction.id
```

### 2. Nonce Tracking
- Automatic nonce reservation per source account
- Prevents transaction collisions
- Sequential ordering guaranteed

### 3. Max Gas Protection
```env
PAYOUTS_MAX_GAS_STROOPS=2000000
```
- Rejects transactions exceeding gas limit
- Prevents unexpected fee spikes

### 4. Retry Limits
```env
PAYOUTS_MAX_ATTEMPTS=5
```
- Automatic retry on transient failures
- Fails after max attempts
- Prevents infinite loops

### 5. Input Validation
- Stellar address format validation
- Amount format validation (7 decimal places)
- Idempotency key format validation

## Configuration

### Required Environment Variables

```env
# Contract & Network
PAYOUT_CONTRACT_ID=CXXX...XXX
PAYOUT_SOURCE_ACCOUNT=GXXX...XXX
STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Execution Mode
PAYOUTS_LIVE_EXECUTION=false
PAYOUTS_SIGN_WITH_HOT_KEY=false

# Optional: Hot Key (secure environments only)
PAYOUT_HOT_SIGNER_SECRET=SXXX...XXX

# Safeguards
PAYOUTS_MAX_GAS_STROOPS=2000000
PAYOUTS_MAX_ATTEMPTS=5

# Confirmation Polling
PAYOUTS_CONFIRM_POLL_MS=2500
PAYOUTS_CONFIRM_MAX_POLLS=20

# Contract Method
PAYOUT_METHOD_NAME=distribute_winnings
```

## Transaction States

```
built → awaiting_signature → queued → submitted → confirmed
                                  ↓
                               failed
```

- **built**: Unsigned XDR created (build-only mode)
- **awaiting_signature**: Waiting for external signature
- **queued**: Signed and ready for submission
- **submitted**: Sent to Soroban, awaiting confirmation
- **confirmed**: Successfully confirmed on-chain
- **failed**: Submission or confirmation failed

## Worker Integration

The `PaymentWorker` automatically processes pending transactions:

```typescript
const worker = new PaymentWorker(transactions, paymentService);

// Process batch
const result = await worker.processBatch(25);
console.log({
  processed: result.processed,
  submitted: result.submitted,
  confirmed: result.confirmed,
  failed: result.failed
});
```

Run worker periodically:
```typescript
setInterval(async () => {
  await worker.processBatch();
}, 5000); // Every 5 seconds
```

## Testing

### Build-Only Flow Test
```typescript
// Set PAYOUTS_LIVE_EXECUTION=false
const result = await paymentService.createPayoutTransaction({
  payoutId: "test-1",
  destinationAccount: "GXXX...XXX",
  amount: "10.0000000",
  asset: "XLM",
  idempotencyKey: "test:1"
});

assert(result.mode === "build_only");
assert(result.unsignedXdr);
assert(result.transaction.status === "built");
```

### Idempotency Test
```typescript
const tx1 = await paymentService.createPayoutTransaction({
  idempotencyKey: "unique-key-1",
  // ...
});

const tx2 = await paymentService.createPayoutTransaction({
  idempotencyKey: "unique-key-1", // Same
  // ...
});

assert(tx1.transaction.id === tx2.transaction.id);
```

### Max Gas Test
```typescript
// Set PAYOUTS_MAX_GAS_STROOPS=100 (very low)
try {
  await paymentService.createPayoutTransaction({...});
  assert.fail("Should have thrown");
} catch (error) {
  assert(error.message.includes("exceeds max gas"));
}
```

## Security Best Practices

### Production Setup
1. **Never commit secrets**: Use secret manager (AWS Secrets Manager, HashiCorp Vault)
2. **Disable hot key signing**: `PAYOUTS_SIGN_WITH_HOT_KEY=false`
3. **Use HSM/KMS**: Sign transactions in secure hardware
4. **Rotate keys**: Regular key rotation policy
5. **Monitor transactions**: Alert on failed transactions

### Staging Setup
1. **Disable live execution**: `PAYOUTS_LIVE_EXECUTION=false`
2. **Test with testnet**: Use Stellar testnet
3. **Inspect XDR**: Manually verify unsigned transactions
4. **Validate amounts**: Check payout calculations

## Monitoring

Track these metrics:
- Transaction creation rate
- Submission success rate
- Confirmation time (p50, p95, p99)
- Failed transaction count
- Gas fees (average, max)

Query examples:
```sql
-- Pending transactions
SELECT COUNT(*) FROM transactions 
WHERE status IN ('queued', 'submitted');

-- Failed transactions (last hour)
SELECT * FROM transactions 
WHERE status = 'failed' 
AND updated_at > NOW() - INTERVAL '1 hour';

-- Average confirmation time
SELECT AVG(EXTRACT(EPOCH FROM (confirmed_at - created_at))) 
FROM transactions 
WHERE status = 'confirmed';
```

## Troubleshooting

### Transaction Stuck in "submitted"
- Check Soroban RPC connectivity
- Verify transaction hash on Stellar Explorer
- Increase `PAYOUTS_CONFIRM_MAX_POLLS`

### "Max gas exceeded" errors
- Check current network fees
- Increase `PAYOUTS_MAX_GAS_STROOPS` if appropriate
- Optimize contract calls

### Nonce conflicts
- Ensure single source account per service instance
- Check for concurrent transaction creation
- Verify nonce reservation logic

### Idempotency key collisions
- Use unique, deterministic keys
- Format: `{round}:{winner}:{timestamp}`
- Never reuse keys across different payouts
