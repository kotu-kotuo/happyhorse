import React from "react";
import Head from "next/head";

const Meta = (props) => {
  const { metaTitle, metaURL, description, metaImage } = props;
  return (
    <div>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:url" content={metaURL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:site_name" content="happy horse" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={metaImage} />
      </Head>
    </div>
  );
};

export default Meta;
