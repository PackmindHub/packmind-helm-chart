import React from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Home() {
  const testSentryError = () => {
    throw new Error('Test error from frontend');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Packmind Frontend</h1>
      <p>Welcome to the Packmind monorepo frontend application!</p>
      <button onClick={testSentryError}>Test Sentry Error</button>
    </div>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  return {
    props: {
      // will be passed to the page component as props
    },
  };
}