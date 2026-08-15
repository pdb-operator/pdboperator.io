import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useEffect, useRef, useState, useCallback} from 'react';
import styles from './index.module.css';

const FALLBACK_VERSION = 'v0.4.1';
const REPO_URL = 'https://github.com/pdb-operator/pdb-operator';
const SLACK_URL = 'https://cloud-native.slack.com/channels/pdb-operator';

function useLatestVersion() {
  const [version, setVersion] = useState(FALLBACK_VERSION);

  useEffect(() => {
    let active = true;
    fetch('https://api.github.com/repos/pdb-operator/pdb-operator/releases/latest')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && data.tag_name) {
          setVersion(data.tag_name);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return version;
}

// content renders visible; JS only hides what is still below the fold, so a
// failed or absent IntersectionObserver can never blank out a section
function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add(styles.revealHidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove(styles.revealHidden);
          observer.unobserve(el);
        }
      },
      {threshold: 0.08, rootMargin: '0px 0px -40px 0px'},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function Reveal({as: Tag = 'div', className, children, ...rest}) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={clsx(styles.reveal, className)} {...rest}>
      {children}
    </Tag>
  );
}

// two-clause headline: second clause reads muted, modelplane-style
function SectionTitle({lead, trail}) {
  return (
    <Heading as="h2" className={styles.sectionTitle}>
      {lead} <span className={styles.sectionTitleTrail}>{trail}</span>
    </Heading>
  );
}

function Eyebrow({children}) {
  return <div className={styles.eyebrow}>{children}</div>;
}

const YAML_LINE = /^(\s*(?:-\s+)?)([\w.\/-]+)(:)(.*)$/;

function Yaml({code, className}) {
  return (
    <pre className={clsx(styles.yaml, className)}>
      <code>
        {code
          .trim()
          .split('\n')
          .map((line, i) => {
            const key = `l${i}`;
            if (line.trimStart().startsWith('#')) {
              return (
                <span key={key} className={styles.yamlComment}>
                  {line}
                  {'\n'}
                </span>
              );
            }
            const match = line.match(YAML_LINE);
            if (!match) {
              return (
                <span key={key} className={styles.yamlValue}>
                  {line}
                  {'\n'}
                </span>
              );
            }
            const [, indent, name, colon, rest] = match;
            const commentAt = rest.indexOf(' #');
            const value = commentAt === -1 ? rest : rest.slice(0, commentAt);
            const comment = commentAt === -1 ? '' : rest.slice(commentAt);
            return (
              <span key={key}>
                {indent}
                <span className={styles.yamlKey}>{name}</span>
                {colon}
                <span className={styles.yamlValue}>{value}</span>
                {comment && <span className={styles.yamlComment}>{comment}</span>}
                {'\n'}
              </span>
            );
          })}
      </code>
    </pre>
  );
}

function CopyButton({text}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {copied ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </>
        )}
      </svg>
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

const FLOW = [
  {
    kind: 'Deployment',
    name: 'checkout-api',
    meta: '12 replicas',
    tags: ['high-availability', 'env: production'],
    pdb: {name: 'checkout-api-pdb', budget: 'minAvailable 75%', detail: '9 held · 3 allowed'},
  },
  {
    kind: 'StatefulSet',
    name: 'mysql',
    meta: '5 replicas',
    tags: ['high-availability', 'core'],
    pdb: {name: 'mysql-pdb', budget: 'minAvailable 75%', detail: '4 held · 1 allowed'},
  },
  {
    kind: 'LeaderWorkerSet',
    name: 'vllm-deepseek-r1',
    meta: '4 × 8 hosts',
    tags: ['mission-critical', 'group-aware'],
    pdb: {name: 'vllm-deepseek-r1-pdb', budget: 'minAvailable 24', detail: '3 groups · 1 allowed'},
  },
];

const CONTROL_PLANE_PILLS = ['CLASSIFY', 'ENFORCE', 'MAINTENANCE', 'OBSERVE'];
const CONTROL_PLANE_PILLS_MUTED = ['PRIORITY', 'WEBHOOK', 'CLEANUP'];

// three branches converging on the control plane; flipped by CSS for the lower half
function Connectors({active, flip}) {
  return (
    <svg
      className={clsx(styles.connectors, flip && styles.connectorsFlip)}
      viewBox="0 0 300 56"
      preserveAspectRatio="none"
      aria-hidden="true">
      {[50, 150, 250].map((x, i) => (
        <path
          key={x}
          d={`M ${x} 0 L ${x} 18 L 150 38 L 150 56`}
          vectorEffect="non-scaling-stroke"
          className={clsx(styles.connector, active === i && styles.connectorActive)}
        />
      ))}
    </svg>
  );
}

function HeroDiagram() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % FLOW.length), 3000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className={styles.diagram}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}>
      <div className={styles.diagramRow}>
        {FLOW.map((f, i) => (
          <button
            type="button"
            key={f.kind}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-label={`Show ${f.kind} ${f.name}`}
            className={clsx(styles.node, active === i && styles.nodeActive)}>
            <div className={styles.nodeKind}>{f.kind}</div>
            <div className={styles.nodeName}>{f.name}</div>
            <div className={styles.nodeMeta}>{f.meta}</div>
            <div className={styles.nodeTags}>
              {f.tags.map((t) => (
                <span key={t} className={styles.nodeTag}>
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <Connectors active={active} />

      <div className={styles.controlPlane}>
        <div className={styles.cpIdentity}>
          <img className={styles.cpLogo} src="/img/logo-dark.svg" alt="" width="26" height="26" />
          <div>
            <div className={styles.cpName}>PDB Operator</div>
            <div className={styles.cpStatus}>
              <span className={styles.cpDot} aria-hidden="true" />
              reconciling
            </div>
          </div>
        </div>
        <div className={styles.cpPills}>
          {CONTROL_PLANE_PILLS.map((p) => (
            <span key={p} className={styles.cpPill}>
              {p}
            </span>
          ))}
          {CONTROL_PLANE_PILLS_MUTED.map((p) => (
            <span key={p} className={clsx(styles.cpPill, styles.cpPillMuted)}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <Connectors active={active} flip />

      <div className={styles.diagramRow}>
        {FLOW.map((f, i) => (
          <div
            key={f.pdb.name}
            className={clsx(styles.node, styles.nodePdb, active === i && styles.nodeActive)}>
            <div className={styles.nodeKind}>PodDisruptionBudget</div>
            <div className={styles.nodeName}>{f.pdb.name}</div>
            <div className={styles.nodeBudget}>{f.pdb.budget}</div>
            <div className={styles.nodeMeta}>{f.pdb.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const version = useLatestVersion();

  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <Eyebrow>
              <span className={styles.badgeDot} aria-hidden="true" />
              {version} · Apache 2.0 · building in the open
            </Eyebrow>
            <Heading as="h1" className={styles.heroTitle}>
              Policy-driven availability for{' '}
              <span className={styles.heroTitleAccent}>every workload</span>
            </Heading>
            <p className={styles.heroLede}>
              PDB Operator turns availability into a declarative policy. Define
              the classes once and the operator writes, updates, and cleans up
              PodDisruptionBudgets for every Deployment, StatefulSet, and
              LeaderWorkerSet that matches, with enforcement modes teams can work
              inside, maintenance windows that relax budgets on schedule, and
              group-aware budgets for multi-host inference. No hand-written PDBs,
              no stale ones left behind.
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={clsx('button button--lg', styles.primaryButton)}
                to="/docs/getting-started/introduction">
                Get started <span aria-hidden="true">→</span>
              </Link>
              <Link
                className={clsx('button button--lg', styles.secondaryButton)}
                href={REPO_URL}>
                View on GitHub
              </Link>
            </div>
          </div>

          <HeroDiagram />
        </div>
      </div>
    </header>
  );
}

const OPERATOR_VERBS = ['watches', 'classifies', 'enforces', 'relaxes', 'reconciles', 'cleans up'];

const LAYERS = [
  {
    name: 'Workloads',
    sub: 'kinds it manages',
    accent: '#7DB4F5',
    groups: [
      {
        items: ['Deployment', 'StatefulSet', 'LeaderWorkerSet'],
        muted: ['+ any replica count ≥ 2'],
      },
    ],
  },
  {
    name: 'Policy',
    sub: 'classes & enforcement',
    accent: '#4A90D9',
    groups: [
      {
        label: 'Availability classes',
        items: [
          'non-critical · 20%',
          'standard · 50%',
          'high-availability · 75%',
          'mission-critical · 90%',
        ],
        muted: ['custom · your own'],
      },
      {
        label: 'Enforcement',
        items: ['strict', 'flexible', 'advisory'],
        muted: ['+ priority resolution'],
      },
    ],
  },
  {
    name: 'Operations',
    sub: 'windows & signals',
    accent: '#56D4DD',
    groups: [
      {
        label: 'Scheduling',
        items: ['maintenance windows', 'timezones', 'daysOfWeek', 'overnight spans'],
      },
      {
        label: 'Observability',
        items: ['Prometheus', 'OpenTelemetry', 'Kubernetes events', 'JSON logs'],
        muted: ['+ audit trails'],
      },
    ],
  },
];

function Ecosystem() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.sectionHead}>
          <Eyebrow>Coverage</Eyebrow>
          <SectionTitle lead="The whole cluster." trail="Under one availability policy." />
          <p className={styles.sectionLede}>
            PDB Operator doesn't replace how you run workloads, it governs their
            availability across three layers: the workload kinds you deploy, the
            policy that classifies them, and the operations that keep the budgets
            honest. Stateless services, stateful data systems, and multi-host
            inference all resolve through the same policy.
          </p>
        </Reveal>

        <Reveal className={styles.stackPanel}>
          <div className={styles.stackHeader}>
            <div className={styles.cpIdentity}>
              <img className={styles.cpLogo} src="/img/logo-dark.svg" alt="" width="26" height="26" />
              <div className={styles.cpName}>PDB Operator</div>
            </div>
            <div className={styles.cpPills}>
              {OPERATOR_VERBS.map((v) => (
                <span key={v} className={clsx(styles.cpPill, styles.cpPillGhost)}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.stackDivider}>manages</div>

          <div className={styles.stackBody}>
            {LAYERS.map((layer) => (
              <div key={layer.name} className={styles.layer} style={{'--layer-accent': layer.accent}}>
                <div className={styles.layerLabel}>
                  <div className={styles.layerName}>{layer.name}</div>
                  <div className={styles.layerSub}>{layer.sub}</div>
                </div>
                <div className={styles.layerGroups}>
                  {layer.groups.map((g, gi) => (
                    <div key={g.label || gi} className={styles.layerGroup}>
                      {g.label && <div className={styles.layerGroupLabel}>{g.label}</div>}
                      <div className={styles.chips}>
                        {g.items.map((it) => (
                          <span key={it} className={styles.chip}>
                            {it}
                          </span>
                        ))}
                        {(g.muted || []).map((it) => (
                          <span key={it} className={clsx(styles.chip, styles.chipMuted)}>
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MultiHost() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Reveal className={styles.sectionHead}>
          <Eyebrow>Multi-host inference</Eyebrow>
          <SectionTitle lead="Groups restart together." trail="So the budget counts groups." />
          <p className={styles.sectionLede}>
            A LeaderWorkerSet group is one unit: under the default{' '}
            <code>RecreateGroupOnPodRestart</code>, evicting a single pod takes
            down all <code>size</code> pods with it. A percentage of pods both
            under-protects real capacity and can deadlock a node drain, so PDB
            Operator quantizes the budget to whole groups instead.
          </p>
        </Reveal>

        <div className={styles.splitGrid}>
          <Reveal className={styles.formulaCard}>
            <div className={styles.formulaLabel}>Budget calculation</div>
            <pre className={styles.formula}>
              <code>
                {'desiredGroups = ceil(class% × replicas)\n'}
                {'                clamped to replicas - 1\n\n'}
                {'minAvailable  = desiredGroups × size'}
              </code>
            </pre>
            <div className={styles.formulaExample}>
              <div className={styles.formulaRow}>
                <span>replicas</span>
                <span>4 groups</span>
              </div>
              <div className={styles.formulaRow}>
                <span>size</span>
                <span>8 hosts</span>
              </div>
              <div className={styles.formulaRow}>
                <span>class</span>
                <span>mission-critical · 90%</span>
              </div>
              <div className={clsx(styles.formulaRow, styles.formulaResult)}>
                <span>minAvailable</span>
                <span>24</span>
              </div>
            </div>
            <p className={styles.formulaNote}>
              Exactly one group may be disrupted at a time, and a drain always
              makes progress.
            </p>
          </Reveal>

          <Reveal className={styles.edgeCases}>
            <div className={styles.edgeCase}>
              <div className={styles.edgeShape}>replicas: 1</div>
              <p>
                No PDB is created. Any budget over a single group would block
                node drains permanently, so the operator emits a Warning event
                explaining why instead.
              </p>
            </div>
            <div className={styles.edgeCase}>
              <div className={styles.edgeShape}>size: 1</div>
              <p>
                Plain pod-level semantics, identical to a Deployment. Group
                quantization only kicks in where groups actually exist.
              </p>
            </div>
            <div className={styles.edgeCase}>
              <div className={styles.edgeShape}>custom minAvailable</div>
              <p>
                An absolute value is rounded up to the next whole group, so a
                hand-set budget can never split one.
              </p>
            </div>
            <div className={styles.edgeCase}>
              <div className={styles.edgeShape}>no LWS CRD</div>
              <p>
                Support is detected at startup. Without{' '}
                <code>leaderworkerset.x-k8s.io/v1</code> installed the operator
                runs exactly as before.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const POLICY_YAML = `
apiVersion: availability.pdboperator.io/v1alpha1
kind: PDBPolicy
metadata:
  name: production-ha
spec:
  availabilityClass: high-availability
  enforcement: strict
  priority: 100
  workloadSelector:
    matchLabels:
      env: production
    namespaces:
      - production
  maintenanceWindows:
    - start: "02:00"
      end: "04:00"
      timezone: "Europe/Athens"
      daysOfWeek: [0, 6]
`;

const ANNOTATION_YAML = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  annotations:
    pdboperator.io/availability-class: "mission-critical"
    pdboperator.io/workload-function: "security"
    pdboperator.io/workload-name: "auth-service"
    pdboperator.io/override-reason: "PCI scope"
spec:
  replicas: 10
`;

function ResourceApi() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.sectionHead}>
          <Eyebrow>Resource API</Eyebrow>
          <SectionTitle lead="One API for availability." trail="Serving two roles." />
        </Reveal>

        <div className={styles.splitGrid}>
          <Reveal className={styles.roleCard}>
            <div className={styles.roleLabel}>Platform teams</div>
            <p className={styles.roleBody}>
              Declare the guardrails. A <code>PDBPolicy</code> selects workloads
              by label, name, function, or namespace, pins them to an
              availability class, and sets how strictly that class holds. When
              several policies match, the highest priority wins.
            </p>
            <Yaml code={POLICY_YAML} />
          </Reveal>

          <Reveal className={styles.roleCard}>
            <div className={styles.roleLabel}>Application teams</div>
            <p className={styles.roleBody}>
              Work inside them. Under <code>advisory</code> a workload sets its
              own class freely; under <code>flexible</code> it may raise
              availability but never fall below the policy floor; under{' '}
              <code>strict</code> the policy is final. Security workloads are
              boosted automatically.
            </p>
            <Yaml code={ANNOTATION_YAML} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const CAPABILITIES = [
  {
    n: '01',
    label: 'Classification',
    title: 'Availability as a class, not a number',
    body: 'Five classes cover the range from batch work at 20% to payment and auth systems at 90%, with custom for full control over minAvailable, maxUnavailable, and unhealthyPodEvictionPolicy. Workloads annotated as a security function are boosted automatically: non-critical becomes 50%, standard becomes 75%.',
  },
  {
    n: '02',
    label: 'Enforcement',
    title: 'Guardrails teams can work inside',
    body: 'strict makes the policy final. flexible lets a team raise availability but never drop below the policy floor. advisory hands control to the workload annotation. Overrides can require a written reason, and every decision is counted as a metric and recorded as a Kubernetes event.',
  },
  {
    n: '03',
    label: 'Maintenance',
    title: 'Relax the budget on schedule',
    body: 'Windows are defined on the policy with a timezone, days of week, and overnight spans, or per workload through an annotation. A workload with a window wakes at the next window start rather than waiting on an unrelated event, so the budget relaxes on time and tightens again when the window closes.',
  },
  {
    n: '04',
    label: 'Observability',
    title: 'Every decision is visible',
    body: 'Prometheus metrics cover reconciliation duration and errors, PDBs created, updated and deleted, managed workloads per class, active policies, compliance status, enforcement decisions, and override attempts. OpenTelemetry tracing turns on with an OTLP endpoint, and logs are structured JSON with correlation IDs and trace context.',
  },
];

function Capabilities() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Reveal className={styles.sectionHead}>
          <Eyebrow>Capabilities</Eyebrow>
          <SectionTitle lead="Built for the cluster." trail="Not just the workload." />
        </Reveal>
        <div className={styles.capabilityList}>
          {CAPABILITIES.map((c) => (
            <Reveal key={c.n} className={styles.capability}>
              <div className={styles.capabilityIndex}>
                <span className={styles.capabilityNumber}>{c.n}</span>
                <span className={styles.capabilityLabel}>{c.label}</span>
              </div>
              <div className={styles.capabilityBody}>
                <Heading as="h3" className={styles.capabilityTitle}>
                  {c.title}
                </Heading>
                <p>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const HELM_COMMAND =
  'helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator \\\n  --namespace pdb-operator-system --create-namespace';

function Install() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.sectionHead}>
          <Eyebrow>Install</Eyebrow>
          <SectionTitle lead="One command." trail="Then write a policy." />
        </Reveal>
        <Reveal className={styles.installBox}>
          <div className={styles.installBar}>
            <span className={styles.installBarLabel}>helm</span>
            <CopyButton text={HELM_COMMAND.replace(/\\\n\s+/g, '')} />
          </div>
          <pre className={styles.installCode}>
            <code>
              <span className={styles.prompt}>$ </span>
              {HELM_COMMAND}
            </code>
          </pre>
        </Reveal>
        <Reveal className={styles.installNote}>
          Requires Kubernetes 1.28+ and cert-manager for webhook TLS. On a
          cluster without cert-manager, add{' '}
          <code>--set webhooks.enabled=false --set certManager.enabled=false</code>.{' '}
          <Link to="/docs/getting-started/installation">Full install guide →</Link>
        </Reveal>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className={styles.community}>
      <div className={styles.communityGlow} aria-hidden="true" />
      <div className="container">
        <Reveal className={styles.communityInner}>
          <Eyebrow>Open source</Eyebrow>
          <SectionTitle lead="Genuinely open." trail="Community driven." />
          <p className={styles.communityLede}>
            PDB Operator is Apache 2.0 and open source end to end. It runs
            entirely inside your own cluster, depends on nothing outside it, and
            manages only the PDBs it created. Governance, roadmap, and security
            policy are all in the open, and contributions are welcome.
          </p>
          <div className={styles.heroButtons}>
            <Link className={clsx('button button--lg', styles.primaryButton)} href={REPO_URL}>
              ★ Star on GitHub
            </Link>
            <Link className={clsx('button button--lg', styles.secondaryButton)} href={SLACK_URL}>
              Join #pdb-operator
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <Hero />
      <main>
        <Ecosystem />
        <MultiHost />
        <ResourceApi />
        <Capabilities />
        <Install />
        <Community />
      </main>
    </Layout>
  );
}
