// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Magniv Documentation',
  tagline: 'Getting Started With Magniv',
  url: 'https://docs.magniv.io',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'MagnivOrg', // Usually your GitHub org/user name.
  projectName: 'documentation', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-H75VMNQ5FL',
          anonymizeIP: true,
        },
      }),
    ],
    
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{name: 'keywords', content:'data science, docs, tutorials, magniv, magniv tutorial, magniv docs, job orchestration, airflow, easy airflow, easy cron, cron, python'}],
      navbar: {
        title: 'Magniv',
        logo: {
          alt: 'Magniv Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'documentation/index',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'doc',
            docId: 'tutorials/index',
            position: 'left',
            label: 'Tutorials',
          },
          {
            type: 'doc',
            docId: 'faq/index',
            position: 'left',
            label: 'FAQs',
          },
          {
            href: 'https://dashboard.magniv.io',
            label: 'Dashboard',
            position: 'right',
          },

          {
            href: 'https://github.com/MagnivOrg',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/',
              },
              {
                label: 'Docs',
                to: '/documentation',
              },
              {
                label: 'Tutorials',
                to: '/tutorials',
              },
              {
                label: 'FAQ',
                to: '/faq',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/magnivApp',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://blog.magniv.io',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/MagnivOrg',
              },
            ],
          },
        ],
        copyright: `Copyright ?? ${new Date().getFullYear()} Magniv, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
