import React from 'react';
import { useCallback } from 'react';

const Test = ({ location }) => {
  const token = new URLSearchParams(location.hash.substring(1)).get('access_token')

  return (
    <div>
      <h2>Redirected</h2>
      <h3>Yesterday</h3>
      <code>node ./scripts yesterday {token}</code>
      <br />
      <br />
      <h3>Today (after 11pm)</h3>
      <code>node ./scripts today {token}</code>
      <br />
      <br />
      <a href="/youtube-request?auto=true">Redo</a>
    </div>
  );
}

export default Test
