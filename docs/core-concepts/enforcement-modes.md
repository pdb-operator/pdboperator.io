---
sidebar_position: 3
title: Enforcement Modes
---

# Enforcement Modes

Enforcement modes control whether deployments can override a policy's availability class using annotations.

## Modes

| Mode | Behavior |
|------|----------|
| `strict` | Policy cannot be overridden by annotations |
| `flexible` | Annotations can increase but never decrease availability below `minimumClass` |
| `advisory` | Annotations can freely override the policy (default) |

## Strict

No overrides allowed. The policy's availability class is always applied regardless of deployment annotations.

```yaml
spec:
  availabilityClass: high-availability
  enforcement: strict
```

## Flexible

Annotations can upgrade the availability class but cannot downgrade below the policy's `minimumClass`.

```yaml
spec:
  availabilityClass: standard
  enforcement: flexible
  minimumClass: standard  # Cannot go below standard
```

A deployment annotated with `pdboperator.io/availability-class: mission-critical` would be accepted (upgrade), but `non-critical` would be rejected (downgrade below minimum).

## Advisory

Annotations can freely override the policy. This is the default mode.

```yaml
spec:
  availabilityClass: standard
  enforcement: advisory
```

Use advisory mode when teams should be able to set their own availability requirements.

## Resolution Logic

The operator resolves the effective configuration based on the combination of policy and annotations:

| Scenario | Result |
|----------|--------|
| No policy, annotation present | Use annotation |
| No policy, no annotation | Skip (no PDB created) |
| Policy with `strict` | Use policy (annotations ignored) |
| Policy with `flexible`, annotation >= minimumClass | Use annotation |
| Policy with `flexible`, annotation < minimumClass | Use minimumClass |
| Policy with `advisory`, annotation present | Use annotation (if `allowOverride: true`) |
| Policy with `advisory`, no annotation | Use policy |

## Related

- [Availability Classes](/docs/core-concepts/availability-classes): the classes that enforcement modes protect
- [Annotations Reference](/docs/guides/annotations): annotations used for overrides
- [Policy Examples](/docs/guides/policy-examples): real-world examples with different enforcement modes
