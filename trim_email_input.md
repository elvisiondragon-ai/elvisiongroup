## Code Changes for Email Input Trimming

**File:** `/Users/eldragon/git/elvisiongroup/src/pages/Auth.tsx`

### Change 1: Trim email in `enhancedHandleLogin` function

**Old Code:**
```typescript
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
```

**New Code:**
```typescript
      const trimmedEmail = loginData.email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: loginData.password,
      });
```

### Change 2: Trim email in `enhancedHandleSignup` function

**Old Code:**
```typescript
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          // Skip email confirmation for easier registration
          data: {
            email_confirm: true
          }
        }
      });
```

**New Code:**
```typescript
      const trimmedEmail = signupData.email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          // Skip email confirmation for easier registration
          data: {
            email_confirm: true
          }
        }
      });
```