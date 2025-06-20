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
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://rockorpop.com';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* LinkedIn specific meta tags - placed first for better detection */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:type" content="music.playlist" />
      <meta property="og:site_name" content="rockorpop.com" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rockorpop" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={`Cassette tape for playlist: ${title}`} />

      {/* Additional tags */}
      <meta property="og:image:alt" content={`Cassette tape for playlist: ${title}`} />
      <link rel="canonical" href={currentUrl} />
      <meta name="theme-color" content="#000000" />
    </Helmet>
  );
};

export default MetaTags; 