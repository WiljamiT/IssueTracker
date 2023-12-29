import React from 'react';
import PropTypes from 'prop-types';

function IssueRow(props) {
  const { issue } = props;

  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created ? issue.created.toDateString() : ' '}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ' '}</td>
      <td>{issue.title}</td>
    </tr>
  );
}

IssueRow.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    created: PropTypes.instanceOf(Date),
    effort: PropTypes.number.isRequired,
    due: PropTypes.instanceOf(Date),
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default IssueRow;
