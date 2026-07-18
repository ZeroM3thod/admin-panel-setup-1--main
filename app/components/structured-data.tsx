export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HASAN LIB',
    alternateName: ['Hasan.lib', 'HASAN.LIB', 'hasanlib'],
    url: 'https://hasanlib.vercel.app',
    logo: 'https://hasanlib.vercel.app/placeholder-logo.png',
    description:
      'A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates.',
    sameAs: ['https://github.com/hasan-lib'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: 'https://hasanlib.vercel.app',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HASAN LIB',
    alternateName: ['Hasan.lib', 'HASAN.LIB'],
    url: 'https://hasanlib.vercel.app',
    description:
      'A brutalist open-source component library for the web with copy-paste components.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://hasanlib.vercel.app/lib?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HASAN LIB',
    alternateName: ['Hasan.lib', 'HASAN.LIB'],
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Web',
    description:
      'A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live previews.',
    url: 'https://hasanlib.vercel.app',
    screenshot: 'https://hasanlib.vercel.app/images/about-isometric.jpg',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://hasanlib.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Library',
        item: 'https://hasanlib.vercel.app/lib',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Pro',
        item: 'https://hasanlib.vercel.app/pro',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
