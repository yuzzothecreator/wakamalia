# features/

Domain feature modules live here as the product grows.

Suggested layout:

```
features/
  predictions/
  tipsters/
  wallet/
  social/
  admin/
```

Each feature can export UI, hooks, and local types without bloating `components/`.
