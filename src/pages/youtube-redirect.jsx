import React from 'react';
import { useCallback } from 'react';

const Test = ({ location }) => {
  const token = new URLSearchParams(location.hash.substring(1)).get('access_token')

  return (
    <div>
      <h2>Redirected</h2>
      <code>node ./scripts {token}</code>
      <br />
      <br />
      <a href="/youtube-request?auto=true">Redo</a>
    </div>
  );
}

export default Test
