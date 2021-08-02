import React from "react";
import Head from "next/head";

const Meta = (props) => {
  const { title, ogpURL, description, ogpImage, index } = props;
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:url" content={ogpURL} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="happy horse" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogpImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content={index} />
      </Head>
    </div>
  );
};

export default Meta;
