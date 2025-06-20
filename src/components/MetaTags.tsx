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

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="music.playlist" />
      <meta property="og:site_name" content="rockorpop.com" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default MetaTags; 