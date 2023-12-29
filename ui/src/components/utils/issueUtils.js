const addIssue = (issues, setIssues, newIssue) => {
  const updatedIssue = { ...newIssue, id: issues.length + 1 };
  setIssues(prevIssues => [...prevIssues, updatedIssue]);
};

export default addIssue;
