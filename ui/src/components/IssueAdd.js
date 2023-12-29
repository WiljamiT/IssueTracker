import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const IssueAdd = ({ createIssue }) => {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  };

  return (
    <div>
      <form name="issueAdd" ref={formRef} onSubmit={handleSubmit}>
        <input type="text" name="owner" placeholder="Owner" />
        <input type="text" name="title" placeholder="Title" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};

export default IssueAdd;
