import React from 'react';
import PropTypes from 'prop-types';
import IssueRow from './IssueRow';

const IssueTable = ({ issues }) => {
  const issueRows = issues.map(issue => <IssueRow key={issue.id} issue={issue} />);

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

IssueTable.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      created: PropTypes.instanceOf(Date).isRequired,
      effort: PropTypes.number.isRequired,
      due: PropTypes.instanceOf(Date),
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default IssueTable;
