---
sidebar_position: 4
title: Maintenance Windows
---

# Maintenance Windows

Maintenance windows allow PDBs to be automatically relaxed during scheduled maintenance periods, enabling node drains and upgrades without PDB blocks.

## Configuration

Add maintenance windows to a PDBPolicy:

```yaml
spec:
  maintenanceWindows:
    - start: "02:00"
      end: "04:00"
      timezone: "UTC"
      daysOfWeek: [0, 6]  # Sunday, Saturday
```

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `start` | string | (required) | Start time in `HH:MM` format |
| `end` | string | (required) | End time in `HH:MM` format |
| `timezone` | string | `UTC` | IANA timezone (e.g., `Europe/London`, `America/New_York`) |
| `daysOfWeek` | []int | (required) | Days of week (0=Sunday, 6=Saturday) |

## Behavior

During a maintenance window:
- The operator temporarily removes the PDB entirely to allow disruptions
- When the window closes, the PDB is automatically recreated with the original configuration

## Multiple Windows

You can define multiple maintenance windows per policy:

```yaml
spec:
  maintenanceWindows:
    - start: "02:00"
      end: "04:00"
      timezone: "UTC"
      daysOfWeek: [0, 6]
    - start: "23:00"
      end: "01:00"
      timezone: "Europe/Athens"
      daysOfWeek: [2]  # Wednesday
```

## Annotation Override

Deployments can override the maintenance window via annotation:

```yaml
metadata:
  annotations:
    pdboperator.io/maintenance-window: "03:00-05:00 UTC"
```

## Related

- [Annotations Reference](/docs/guides/annotations): all available deployment annotations
- [Policy Examples](/docs/guides/policy-examples): policies with maintenance windows configured
- [API Reference](/docs/reference/api-reference): full MaintenanceWindow field specification
