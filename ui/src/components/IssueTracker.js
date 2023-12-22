import React, { useEffect, useState } from 'react';
import IssueAdd from './IssueAdd';
import IssueTable from './IssueTable';
import { addIssue } from './utils/issueUtils';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions && error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions ? error.extensions.code : 'Error'}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
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
    } catch (error) {
      setError(error.message);
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
    } catch (error) {
      setError(error.message);
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