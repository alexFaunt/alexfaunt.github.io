import React, { useEffect } from 'react';

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function onSubmit() {
  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  const form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', 'https://accounts.google.com/o/oauth2/v2/auth');

  // Parameters to pass to OAuth 2.0 endpoint.
  const params = {
    client_id: '580658835996-0keodgpafcb5vfbv55jb0t3ed9uil932.apps.googleusercontent.com',
    redirect_uri: 'http://localhost:8000/youtube-redirect',
    response_type: 'token',
    scope: 'https://www.googleapis.com/auth/youtube.upload',
  };

  // Add form parameters as hidden input values.
  for (const p in params) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

const Thing = ({ location }) => {
  const auto = new URLSearchParams(location.search).get('auto') === 'true';

  useEffect(() => {
    if (auto) {
      onSubmit();
    }
  }, [auto])

  return (
    <div>
      <h1>Request access</h1>
      <button onClick={onSubmit}>
        Get token
      </button>
    </div>
  );
}

export default Thing;
