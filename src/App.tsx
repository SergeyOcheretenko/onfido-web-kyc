import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Onfido } from 'onfido-sdk-ui'

function App() {
  const token = process.env.REACT_APP_ONFIDO_TOKEN;

  console.log('token', token);

  const createApplicant = async () => {
    const response = await fetch('https://api.eu.onfido.com/v3.6/applicants', {
      method: 'POST',
      headers: {
        'Authorization': `Token token=${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        "first_name": "John",
        "last_name": "Smith",
      }),
    });
    return response.json();
  };

  const runWorkflow = async () => {
    const applicant = await createApplicant();
    console.log(applicant);

    const sdkTokenResponse = await fetch('https://api.eu.onfido.com/v3.6/sdk_token', {
      method: 'POST',
      headers: {
        'Authorization': `Token token=${token}`,
        'Content-Type': 'application/json',
        // allow localhost
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        "applicant_id": applicant.id,
      }),
    });
    const sdkToken = await sdkTokenResponse.json();
    console.log(sdkToken);

    Onfido.init({
      token: sdkToken.token,
      containerId: "onfido-mount",
      onComplete: function (data) {
        console.log("everything is complete");
      },
      onError: function (error) {
        console.log(error);
      },
    });
  };

  return (
    <div>
      <button onClick={runWorkflow}>test</button>
      <div id='onfido-mount' className='onfido-mount'></div>
      </div>
  );
}

export default App;
