// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'PDB Operator',
  tagline: 'Policy-driven PodDisruptionBudget automation for Kubernetes',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  url: 'https://pdboperator.io',
  baseUrl: '/',

  organizationName: 'pdb-operator',
  projectName: 'pdboperator.io',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    function suppressWarningsPlugin() {
      return {
        name: 'suppress-warnings',
        configureWebpack() {
          return {
            ignoreWarnings: [
              {module: /vscode-languageserver-types/},
            ],
          };
        },
      };
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/pdb-operator/pdboperator.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/pdb-operator/pdboperator.io/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/banner.svg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      mermaid: {
        theme: {light: 'base', dark: 'dark'},
        options: {
          themeVariables: {
            primaryColor: '#dbeafe',
            primaryTextColor: '#1E3F8A',
            primaryBorderColor: '#326CE5',
            lineColor: '#326CE5',
            secondaryColor: '#f0f5ff',
            tertiaryColor: '#e8f0fe',
            fontFamily: 'Geist, -apple-system, sans-serif',
            fontSize: '14px',
          },
        },
      },
      navbar: {
        title: 'PDB Operator',
        logo: {
          alt: 'PDB Operator Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            to: '/docs/community/roadmap',
            label: 'Roadmap',
            position: 'left',
          },
          {
            href: 'https://github.com/pdb-operator/pdb-operator',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {label: 'Getting Started', to: '/docs/getting-started/introduction'},
              {label: 'Core Concepts', to: '/docs/core-concepts/architecture'},
              {label: 'Guides', to: '/docs/guides/annotations'},
              {label: 'API Reference', to: '/docs/reference/api-reference'},
            ],
          },
          {
            title: 'Community',
            items: [
              {label: 'Contributing', to: '/docs/community/contributing'},
              {label: 'Governance', to: '/docs/community/governance'},
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/pdb-operator/pdb-operator/discussions',
              },
              {
                label: 'GitHub Issues',
                href: 'https://github.com/pdb-operator/pdb-operator/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'Blog', to: '/blog'},
              {label: 'Roadmap', to: '/docs/community/roadmap'},
              {
                label: 'GitHub',
                href: 'https://github.com/pdb-operator/pdb-operator',
              },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} The PDB Operator Authors. Licensed under Apache 2.0.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'yaml', 'go', 'json'],
      },
    }),
};

export default config;
