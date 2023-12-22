export const addIssue = (issues, setIssues, newIssue) => {
    newIssue.id = issues.length + 1;
    setIssues((prevIssues) => [...prevIssues, newIssue]);
};