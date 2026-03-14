---
sidebar_position: 7
title: Claude Code Skill
---

# Claude Code Skill for PDB Operator

Build a [Claude Code skill](https://code.claude.com/docs/en/skills) that helps you manage PDBPolicy resources, troubleshoot PDB issues, and follow PDB Operator conventions from your terminal.

## What You Get

A `/pdb` slash command that:

- Generates valid `PDBPolicy` YAML with correct `apiVersion`, fields, and defaults
- Diagnoses PDB issues across namespaces
- Validates availability class and enforcement mode combinations
- References the operator's annotation and API conventions

## Project Structure

Create the skill in your project's `.claude/skills/` directory:

```text
.claude/
  skills/
    pdb/
      SKILL.md
      reference.md
```

## Skill Definition

Create `.claude/skills/pdb/SKILL.md`:

```yaml
---
name: pdb
description: >-
  Generate, validate, or troubleshoot PDB Operator PDBPolicy resources.
  Create PDBPolicy YAML with availability classes, enforcement modes,
  maintenance windows, and workload selectors.
  Not for general Kubernetes questions (use kubectl directly).
argument-hint: [generate|diagnose|validate] [options]
allowed-tools: Read, Grep, Glob, Bash(kubectl get:*), Bash(kubectl describe:*), Bash(kubectl logs:*), Bash(kubectl top:*)
---
```

````markdown
## PDB Operator Skill

You are a PDB Operator expert. Help users create, validate, and troubleshoot
PDBPolicy custom resources for the pdb-operator Kubernetes operator.

### API Reference

- **apiVersion:** `availability.pdboperator.io/v1alpha1`
- **Kind:** `PDBPolicy`

### Commands

**generate** - Create a new PDBPolicy YAML:

```
/pdb generate production api-server high-availability strict
```

**diagnose** - Check PDB status and policy compliance:

```
/pdb diagnose [namespace]
```

**validate** - Validate existing PDBPolicy files:

```
/pdb validate path/to/policy.yaml
```

### Availability Classes

| Class | minAvailable | Typical Use |
|-------|-------------|-------------|
| `non-critical` | 20% | Batch jobs, dev tools |
| `standard` | 50% | Internal services |
| `high-availability` | 75% | Production APIs |
| `mission-critical` | 90% | Payment, auth, data stores |
| `custom` | User-defined | Full control via `customPDB` |

### Enforcement Modes

| Mode | Annotation Overrides | Use When |
|------|---------------------|----------|
| `strict` | Blocked | Compliance-critical workloads |
| `flexible` | Allowed (with optional reason) | Team autonomy with guardrails |
| `advisory` | Always allowed | Gradual rollout, recommendations |

### Generation Rules

When generating PDBPolicy YAML, always:

1. Set `apiVersion: availability.pdboperator.io/v1alpha1`
2. Set `kind: PDBPolicy`
3. Include `metadata.name` and `metadata.namespace`
4. Include `spec.availabilityClass` from the valid classes above
5. Include `spec.enforcement` from the valid modes above
6. Include `spec.workloadSelector` with at least one selector
7. Set `spec.priority` (higher values win conflicts, default: 0)

For the full field reference, see [reference.md](reference.md).

### PDBPolicy Template

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: <name>
  namespace: <namespace>
spec:
  availabilityClass: <class>
  enforcement: <mode>
  priority: 0
  workloadSelector:
    matchLabels:
      <key>: <value>
    namespaces:
      - <namespace>
```

### With Maintenance Windows

```yaml
spec:
  maintenanceWindows:
    - name: <window-name>
      schedule: "<cron-expression>"
      duration: <duration>
      timezone: <tz>
```

### With Custom PDB Configuration

```yaml
spec:
  availabilityClass: custom
  customPDB:
    minAvailable: "<value>"          # or maxUnavailable
    unhealthyPodEvictionPolicy: IfHealthy
```

### Deployment Annotations

When users need workload-level overrides (only works with `flexible` or `advisory` enforcement):

| Annotation | Values |
|-----------|--------|
| `pdboperator.io/availability-class` | `non-critical`, `standard`, `high-availability`, `mission-critical`, `custom` |
| `pdboperator.io/workload-function` | `core`, `management`, `security` |
| `pdboperator.io/min-available` | Percentage or integer |
| `pdboperator.io/max-unavailable` | Percentage or integer |
| `pdboperator.io/override-reason` | Free-text reason (required when `requireOverrideReason: true`) |
| `pdboperator.io/exclude` | `"true"` to exclude from PDB management |

### Diagnose Workflow

When diagnosing, run these read-only commands:

```bash
# List all PDBPolicies
kubectl get pdbpolicies -A

# List managed PDBs
kubectl get pdb -l pdboperator.io/managed-by=pdb-operator -A

# Check operator logs
kubectl logs -n pdb-operator-system -l app.kubernetes.io/name=pdb-operator --tail=50

# Check for policy conflicts
kubectl get pdbpolicies -A -o yaml | grep -A5 "priority:"
```

### Validate Workflow

When validating a PDBPolicy file:

1. Check `apiVersion` is `availability.pdboperator.io/v1alpha1`
2. Check `kind` is `PDBPolicy`
3. Verify `availabilityClass` is one of the five valid values
4. Verify `enforcement` is `strict`, `flexible`, or `advisory`
5. Ensure `workloadSelector` has at least one selector field
6. If `availabilityClass: custom`, verify `customPDB` is present
7. If `maintenanceWindows` exists, verify each has `schedule`, `duration`, and `timezone`
8. Flag any unknown fields

### Metrics to Check

Key Prometheus metrics for PDB health:

- `pdb_operator_pdb_managed_total` - total managed PDBs
- `pdb_operator_policy_compliance_status` - compliance by policy
- `pdb_operator_reconcile_duration_seconds` - reconciliation latency
- `pdb_operator_enforcement_actions_total` - enforcement action counts
````

## Reference File

Create `.claude/skills/pdb/reference.md` with the full API spec. You can generate it from the operator's CRD:

```bash
kubectl get crd pdbpolicies.availability.pdboperator.io -o yaml > reference.md
```

Or copy the [API Reference](/docs/reference/api-reference) content into the file for offline use.

## Installation

1. Create the directory structure in your project:

```bash
mkdir -p .claude/skills/pdb
```

2. Copy the `SKILL.md` and `reference.md` files into `.claude/skills/pdb/`

3. The skill auto-discovers on next Claude Code invocation. No restart needed.

## Usage Examples

### Generate a policy for production APIs

```text
/pdb generate production api-gateway high-availability strict
```

Output:

```yaml
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: api-gateway
  namespace: production
spec:
  availabilityClass: high-availability
  enforcement: strict
  priority: 100
  workloadSelector:
    matchLabels:
      app.kubernetes.io/name: api-gateway
    namespaces:
      - production
```

### Diagnose PDB issues in a namespace

```text
/pdb diagnose payments
```

The skill runs `kubectl` commands to check PDBPolicy status, managed PDBs, and operator logs for the target namespace.

### Validate a policy file before applying

```text
/pdb validate manifests/pdbpolicy.yaml
```

The skill reads the file and checks for schema correctness, valid enum values, and common misconfigurations.

## Customization

### Restrict to read-only

If you only want diagnosis capabilities without generation:

```yaml
allowed-tools: Read, Grep, Glob, Bash(kubectl get:*), Bash(kubectl describe:*), Bash(kubectl logs:*)
```

### Force a lighter model

For faster responses on simple tasks:

```yaml
model: sonnet
```

### Run in isolated context

To keep verbose diagnostic output out of your main conversation:

```yaml
context: fork
agent: general-purpose
```
