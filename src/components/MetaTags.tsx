import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  currentVideoTitle?: string;
}

const MetaTags: FC<MetaTagsProps> = ({ title, description, imageUrl, currentVideoTitle }) => {
  const fullTitle = currentVideoTitle 
    ? `${title} - ${currentVideoTitle} | rockorpop.com`
    : `${title} | rockorpop.com`;

  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://rockorpop.com${imageUrl}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph meta tags - order matters for some crawlers */}
      <meta property="og:type" content="music.playlist" />
      <meta property="og:site_name" content="rockorpop.com" />
      <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://rockorpop.com'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`Cassette tape for playlist: ${title}`} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rockorpop" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={`Cassette tape for playlist: ${title}`} />

      {/* Additional meta tags for better SEO and sharing */}
      <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : 'https://rockorpop.com'} />
      <meta name="theme-color" content="#000000" />
    </Helmet>
  );
};

export default MetaTags; 