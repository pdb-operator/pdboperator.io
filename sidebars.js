/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/architecture',
        'core-concepts/availability-classes',
        'core-concepts/enforcement-modes',
        'core-concepts/maintenance-windows',
        'core-concepts/workload-functions',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/annotations',
        'guides/custom-pdb-config',
        'guides/policy-examples',
        'guides/monitoring',
        'guides/grafana-dashboards',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/api-reference',
        'reference/metrics-reference',
        'reference/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      items: [
        'community/contributing',
        'community/governance',
        'community/roadmap',
        'community/security',
      ],
    },
  ],
};

export default sidebars;
