// Connect to the MongoDB server and use a specific database
const conn = new Mongo();
const db = conn.getDB('IssueTracker');

// Clear existing issues collection
db.issues.remove({});

const issuesDB = [
  {
    id: 1, status: 'New', owner: 'Jaakko', effort: 15,
    created: new Date('2023-12-21'), due: undefined,
    title: 'Error in console when clicking Add',
  },
  {
    id: 2, status: 'Assigned', owner: 'Teppo', effort: 25,
    created: new Date('2023-12-24'), due: new Date('2019-02-01'),
    title: 'Missing bottom border on panel',
  },
];

db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');
db.counters.remove({ _id: 'issues' });
db.counters.insert({ _id: 'issues', current: count });
db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });