---
sidebar_position: 3
title: Roadmap
---

# Roadmap

Planned development for PDB Operator. Priorities may shift based on community feedback and contributions.

The current release is **v0.5.0**. Everything below it is shipped; v0.6.0 onward is planned.

## v0.1.0 - Initial Release ✅

- [x] PDBPolicy CRD with availability classes and enforcement modes
- [x] Controller architecture (PDBPolicy + Deployment controllers)
- [x] Workload selector (labels, names, functions, namespaces)
- [x] Maintenance window support
- [x] Validating and mutating webhooks
- [x] Prometheus metrics and OpenTelemetry tracing
- [x] Grafana dashboards and alerting rules
- [x] HA deployment with leader election
- [x] CI/CD pipelines
- [x] Helm chart ([helm-pdb-operator](https://github.com/pdb-operator/helm-pdb-operator))
- [x] Published container images (GHCR)
- [x] Install manifests (`dist/install.yaml`)

## v0.1.1 - Dependency Updates and CI Fixes ✅

- [x] Bump controller-runtime to v0.23.3 (bug fixes)
- [x] Bump OpenTelemetry packages to v1.42.0
- [x] Fix unsupported semver cooldown keys for github-actions ecosystem
- [x] Resolve zizmor workflow security findings
- [x] Restrict CI workflows to main branch pushes

## v0.2.0 - StatefulSet Support ✅

- [x] Extend PDB management to StatefulSets
- [x] Shared `WorkloadAccessor` abstraction across the Deployment and StatefulSet controllers
- [x] `ManagedStatefulSets` metric
- [x] Clean up the PDB when a StatefulSet scales below 2 replicas

## v0.2.1 - Scale-Down Cleanup ✅

- [x] Clean up the PDB when a Deployment scales below 2 replicas, instead of orphaning it and blocking drains
- [x] e2e coverage for scale-down cleanup on both Deployments and StatefulSets
- [x] De-flake the time-dependent maintenance-window tests

## v0.2.2 - OpenShift RBAC ✅

- [x] Grant `deployments/finalizers` and `statefulsets/finalizers` RBAC so `blockOwnerDeletion` works on clusters that enforce ownerReference rules

## v0.3.0 - Maintenance Windows & Correctness ✅

- [x] Evaluate policy-level maintenance windows (`spec.maintenanceWindows`), not only the workload annotation
- [x] Structured windows: timezone, `daysOfWeek`, multiple windows, and overnight spans
- [x] Proactive requeue so a window relaxes its PDB on time
- [x] Enable the webhook server in the default `make deploy` config
- [x] Fix OpenTelemetry tracing initialization (semconv schema mismatch)
- [x] Injectable clock for deterministic maintenance-window tests

## v0.4.0 - Multi-Host Inference ✅

- [x] Group-aware PDBs for LeaderWorkerSet (`leaderworkerset.x-k8s.io/v1`)
- [x] Quantize `minAvailable` to whole groups; skip single-group sets with a Warning event
- [x] Skip LWS-internal StatefulSets so no pod matches two PDBs
- [x] `pdb_operator_leaderworkersets_managed` metric
- [x] Go 1.26.6 security bump (six stdlib CVEs)

## v0.4.1 - Managed-Workload Metrics ✅

- [x] Recount all three workload kinds each tick, so `pdb_operator_statefulsets_managed` and `pdb_operator_leaderworkersets_managed` drop on deletion instead of sticking
- [x] Exclude LWS-internal StatefulSets from the counts
- [x] Skip the LeaderWorkerSet list entirely when the CRD is absent

## v0.5.0 - Gang Scheduling ✅

- [x] Gang-aware PDBs from the upstream Workload API (`scheduling.k8s.io/v1beta1`, KEP-4671, Kubernetes 1.37 with the `GenericWorkload` gate)
- [x] `disruptionMode: all` gangs quantized to whole pod groups; `single` gangs floored at `minCount`
- [x] PDB selector derived from the labels shared by a group's pods and validated for exactness
- [x] Distinct Warning event reasons per skip cause, plus a log line per skip
- [x] `pdb_operator_workloads_managed` metric
- [x] e2e on kind 1.37: LeaderWorkerSet gang disruption and Workload API gang budgets

## v0.6.0 - Advanced Workloads & Policy

- [ ] Multi-template and composite Workloads
- [ ] Gang-aware `EvictionRequest` responder (KEP-4563)
- [ ] Per-workload-type PDB calculation strategies
- [ ] Namespace-scoped default policies
- [ ] Cluster-wide default policy
- [ ] Policy inheritance and composition
- [ ] Dry-run mode for policy evaluation without creating PDBs
- [ ] PDB drift detection and auto-remediation for manually modified PDBs

## v0.7.0 - Observability and Operations

- [ ] Operator health dashboard (built-in status endpoint)
- [ ] Policy compliance reports
- [ ] Audit log integration (external audit sink)
- [ ] PDB change history tracking on resource annotations
- [ ] Register circuit breaker metrics so the shipped alert group can fire

## Future Considerations

- Multi-cluster policy distribution
- Integration with cluster autoscaler for coordinated disruption management
- Custom availability class definitions via CRD
- Webhook-based PDB validation for non-managed PDBs
- OLM (Operator Lifecycle Manager) bundle and OperatorHub listing

## Contributing

Feature requests and feedback are welcome. Open an [issue](https://github.com/pdb-operator/pdb-operator/issues) or join the [discussion](https://github.com/pdb-operator/pdb-operator/discussions) to influence the roadmap.
