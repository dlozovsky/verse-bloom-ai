import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
}

const BASE_TITLE = "Poetry Hub";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
const DEFAULT_DESCRIPTION =
  "Explore thousands of classic poems from history's greatest poets. Find beauty, meaning, and inspiration in every verse at Poetry Hub.";

const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  ogType = "website",
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
  const canonical = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
