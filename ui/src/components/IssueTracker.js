/* eslint react/no-multi-comp: "off" */

import React, { useEffect, useState } from 'react';
import IssueAdd from './IssueAdd';
import IssueTable from './IssueTable';
import addIssue from './utils/issueUtils';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const graphqlError = result.errors[0];
      if (graphqlError.extensions && graphqlError.extensions.code === 'BAD_USER_INPUT') {
        const details = graphqlError.extensions.exception.errors.join('\n ');
        console.log(`${graphqlError.message}:\n ${details}`);
      } else {
        console.log(`${graphqlError.extensions ? graphqlError.extensions.code : 'Error'}: ${graphqlError.message}`);
      }
    }

    return result.data;
  } catch (e) {
    console.log(`Error in sending data to server: ${e.message}`);
    throw e;
  }
}

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    try {
      const query = `
        query {
          issueList {
            id title status owner
            created effort due
          }
        }
      `;

      const data = await graphQLFetch(query);
      setIssues(data.issueList);
      setError(null);
    } catch (graphqlError) {
      setError(graphqlError.message);
    }
  };

  const handleAddIssue = async (newIssue) => {
    try {
      const mutation = `
        mutation ($issue: IssueInputs!) {
          issueAdd(issue: $issue) {
            id
            due
            created
            status
          }
        }
      `;

      const variables = {
        issue: {
          title: newIssue.title,
          owner: newIssue.owner,
          due: newIssue.due,
        },
      };

      await graphQLFetch(mutation, variables);
      addIssue(issues, setIssues, newIssue);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <IssueAdd createIssue={handleAddIssue} />
      <IssueTable issues={issues} />
    </div>
  );
};

export default IssueTracker;
