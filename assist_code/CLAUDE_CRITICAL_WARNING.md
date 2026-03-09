# 🚨 CRITICAL WARNING FOR NEXT CLAUDE 🚨

## ❌ DO NOT MODIFY THESE FILES WITHOUT EXPLICIT USER PERMISSION:

### **ProBadge.tsx & TierBadge.tsx - CRITICAL SUBSCRIPTION LOGIC**
- **File**: `src/components/ProBadge.tsx` 
- **File**: `src/components/TierBadge.tsx`

### **⚠️ PREVIOUS CLAUDE CAUSED MIRROR BUG:**
Previous Claude modified the subscription badge logic and created a **DANGEROUS MIRROR BUG** where:
- If viewer is PRO 1_year → sees everyone else as PRO 1_year
- If viewer is PRO 1_month → sees everyone else as PRO 1_month  
- If viewer is NOT PRO → sees everyone's real subscription types

### **🔒 CURRENT STATUS:**
These files contain the MIRROR BUG and need careful fixing. The user has identified the exact problem:

**In ProBadge.tsx line 18:**
```typescript
// BUG: Falls back to viewer's subscription type when target is undefined
const subscriptionType = targetUserSubscriptionType !== undefined ? targetUserSubscriptionType : proStatus.subscriptionType;
```

### **📋 RULES FOR NEXT CLAUDE:**
1. **ASK PERMISSION** before modifying ProBadge.tsx or TierBadge.tsx
2. **UNDERSTAND** the mirror bug fully before any changes
3. **TEST THOROUGHLY** with different viewer subscription states
4. **NEVER** make badge display depend on viewer's subscription status
5. **ALWAYS** show other users' actual subscription types

### **🎯 CORRECT BEHAVIOR:**
ALL users should see OTHER users' REAL subscription types, regardless of the viewer's own subscription status.

---
**Note: Previous Claude destroyed critical subscription logic. Exercise extreme caution.**