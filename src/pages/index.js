import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useEffect, useRef, useState, useCallback} from 'react';
import styles from './index.module.css';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <rect x="7" y="10" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.15" />
      <rect x="12" y="6" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.15" />
      <rect x="17" y="3" width="3" height="15" rx="0.5" fill="currentColor" opacity="0.15" />
      <rect x="7" y="10" width="3" height="8" rx="0.5" />
      <rect x="12" y="6" width="3" height="12" rx="0.5" />
      <rect x="17" y="3" width="3" height="15" rx="0.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
      <path d="M4.93 4.93l1.41 1.41" opacity="0.4" />
      <path d="M17.66 17.66l1.41 1.41" opacity="0.4" />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22.6 16.08-8.58 3.91a2 2 0 0 1-1.66 0l-8.58-3.9" />
      <path d="m22.6 11.08-8.58 3.91a2 2 0 0 1-1.66 0l-8.58-3.9" />
    </svg>
  );
}

const FeatureList = [
  {
    title: 'Availability Classes',
    icon: <ShieldIcon />,
    description:
      'Five predefined levels from non-critical (20%) to mission-critical (90%). Security workloads get automatic boosting.',
    tag: 'core',
  },
  {
    title: 'Enforcement Modes',
    icon: <LockIcon />,
    description:
      'Choose strict, flexible, or advisory enforcement. Control how deployment annotations can override policies.',
    tag: 'policy',
  },
  {
    title: 'Full Observability',
    icon: <BarChartIcon />,
    description:
      'Prometheus metrics, OpenTelemetry tracing, structured logging, and Kubernetes events out of the box.',
    tag: 'ops',
  },
  {
    title: 'Maintenance Windows',
    icon: <ClockIcon />,
    description:
      'Schedule maintenance windows with timezone and day-of-week support. PDBs relax automatically during maintenance.',
    tag: 'core',
  },
  {
    title: 'Workload-Aware',
    icon: <CpuIcon />,
    description:
      'Automatic classification of core, management, and security workloads with function-based PDB optimization.',
    tag: 'policy',
  },
  {
    title: 'Policy Priority',
    icon: <LayersIcon />,
    description:
      'Resolve conflicts with priority-based policy resolution. Higher priority policies always win when multiple match.',
    tag: 'policy',
  },
];

function Feature({icon, title, description, tag, index}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.featureVisible);
          observer.unobserve(el);
        }
      },
      {threshold: 0.15},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="col col--4"
      style={{marginBottom: '1.5rem', '--feature-index': index}}>
      <div className={clsx(styles.featureCard, styles.featureAnimated)}>
        <div className={styles.featureHeader}>
          <div className={styles.featureIcon}>{icon}</div>
          <span className={styles.featureTag}>{tag}</span>
        </div>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
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
      className={styles.copyButton}
      onClick={handleCopy}
      aria-label="Copy to clipboard">
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}

function QuickInstall() {
  const helmCommand = 'helm install pdb-operator oci://ghcr.io/pdb-operator/charts/pdb-operator';

  return (
    <section className={styles.quickInstall}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Quick Install
        </Heading>
        <p className={styles.sectionSubtitle}>
          Get up and running in seconds with Helm.
        </p>
        <div className={styles.installBox}>
          <div className={styles.installTerminal}>
            <div className={styles.installLine}>
              <span className={styles.prompt}>$</span>{' '}
              <span className={styles.installCmd}>{helmCommand}</span>
            </div>
            <CopyButton text={helmCommand} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroGlow} />
      <div className={styles.gridOverlay} />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              v0.1.1 — Latest Release
            </div>
            <Heading as="h1" className={styles.heroTitle}>
              PDB Operator
            </Heading>
            <p className={styles.heroSubtitle}>
              Automate PodDisruptionBudget management across your Kubernetes
              cluster with policy-driven availability classes.
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx('button button--lg', styles.primaryButton)}
                to="/docs/getting-started/introduction">
                Get Started
              </Link>
              <Link
                className={clsx('button button--lg', styles.secondaryButton)}
                href="https://github.com/pdb-operator/pdb-operator">
                View on GitHub
              </Link>
            </div>
          </div>
          <div className={styles.heroTerminal}>
            <div className={styles.terminalBar}>
              <div className={styles.terminalDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.terminalTitle}>kubectl</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>{' '}
                <span className={styles.cmd}>cat</span> pdbpolicy.yaml
              </div>
              <div className={styles.terminalYaml}>
                <span className={styles.yamlKey}>apiVersion</span>: availability.pdboperator.io/v1alpha1{'\n'}
                <span className={styles.yamlKey}>kind</span>: PDBPolicy{'\n'}
                <span className={styles.yamlKey}>spec</span>:{'\n'}
                {'  '}<span className={styles.yamlKey}>availabilityClass</span>: <span className={styles.yamlValue}>high-availability</span>{'\n'}
                {'  '}<span className={styles.yamlKey}>enforcement</span>: <span className={styles.yamlValue}>strict</span>{'\n'}
                {'  '}<span className={styles.yamlKey}>workloadSelector</span>:{'\n'}
                {'    '}<span className={styles.yamlKey}>matchLabels</span>:{'\n'}
                {'      '}<span className={styles.yamlKey}>env</span>: <span className={styles.yamlValue}>production</span>
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>{' '}
                <span className={styles.cmd}>kubectl apply</span> -f pdbpolicy.yaml
              </div>
              <div className={styles.terminalOutput}>
                pdbpolicy.pdboperator.io/production-ha created
              </div>
              <div className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>{' '}
                <span className={styles.cmd}>kubectl get</span> pdb -l pdboperator.io/managed-by=pdb-operator
              </div>
              <div className={styles.terminalOutput}>
                NAME{' '.repeat(14)}MIN AVAILABLE   ALLOWED DISRUPTIONS{'\n'}
                my-api-pdb{' '.repeat(8)}75%{' '.repeat(13)}1{'\n'}
                auth-svc-pdb{' '.repeat(6)}75%{' '.repeat(13)}1
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          How It Works
        </Heading>
        <p className={styles.sectionSubtitle}>
          Two controllers working together to keep your cluster protected.
        </p>
        <div className={styles.flowContainer}>
          <div className={styles.flowStepCard}>
            <div className={styles.flowNumber}>1</div>
            <div className={styles.flowContent}>
              <h4>Define Policies</h4>
              <p>
                Create <code>PDBPolicy</code> resources with availability classes,
                enforcement modes, and workload selectors.
              </p>
            </div>
          </div>
          <div className={styles.flowArrow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className={styles.flowStepCard}>
            <div className={styles.flowNumber}>2</div>
            <div className={styles.flowContent}>
              <h4>Operator Reconciles</h4>
              <p>
                PDBPolicyController matches deployments. DeploymentController
                creates and manages PDBs.
              </p>
            </div>
          </div>
          <div className={styles.flowArrow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className={styles.flowStepCard}>
            <div className={styles.flowNumber}>3</div>
            <div className={styles.flowContent}>
              <h4>PDBs Auto-Managed</h4>
              <p>
                PDBs are created, updated, and cleaned up automatically.
                Maintenance windows relax them on schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaGlow} />
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to automate your PDBs?
          </Heading>
          <p className={styles.ctaSubtitle}>
            Stop manually managing PodDisruptionBudgets. Let policies handle
            availability across your entire cluster.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx('button button--lg', styles.primaryButton)}
              to="/docs/getting-started/installation">
              Install Now
            </Link>
            <Link
              className={clsx('button button--lg', styles.secondaryButton)}
              to="/docs/getting-started/quickstart">
              View Quickstart
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Features
            </Heading>
            <p className={styles.sectionSubtitle}>
              Everything you need to manage PodDisruptionBudgets at scale.
            </p>
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} index={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <QuickInstall />
        <HowItWorks />
        <CallToAction />
      </main>
    </Layout>
  );
}
