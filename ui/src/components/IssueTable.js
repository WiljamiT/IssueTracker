import React from 'react';
import IssueRow from './IssueRow';

const IssueTable = (props) => {
  console.log("ASDASDASD", props)
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  return (
    <div>
      
        <table className="bordered-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Effort</th>
              <th>Due Date</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>{issueRows}</tbody>
        </table>
      
    </div>
  );
};

export default IssueTable;