const fs = require('fs');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

let db;

const url = 'mongodb://localhost/IssueTracker';

const express = require('express');
const {
    ApolloServer, UserInputError
} = require('apollo-server-express');

let aboutMessage = "Issue Tracker API v1.0";

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },
    parseLiteral(ast) {
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
        }
    },
});

function validateIssue(_, { issue }) {
    const errors = [];
    if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.')
    }
    if (issue.status == 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
    }
}

// const issuesDB = [{
//     id: 1,
//     status: 'New',
//     owner: 'Ravan',
//     effort: 5,
//     created: new Date('2019-01-15'),
//     due: undefined,
//     title: 'Error in console when clicking Add',
// },
// {
//     id: 2,
//     status: 'Assigned',
//     owner: 'Eddie',
//     effort: 14,
//     created: new Date('2019-01-16'),
//     due: new Date('2019-02-01'),
//     title: 'Missing bottom border on panel',
// },
// ];



const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
        issueAdd,
    },
    GraphQLDate,
};

function setAboutMessage(_, {
    message
}) {
    return aboutMessage = message;
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
    );
    return result.value.current;
    }

async function issueAdd(_, args) {
    validateIssue(_, args);
    const { issue } = args;
    issue.created = new Date();
    //issue.id = issuesDB.length + 1;
    issue.id = await getNextSequence('issues');
    //issuesDB.push(issue);
    const result = await db.collection('issues').insertOne(issue);
    //return issue;
    const savedIssue = await db.collection('issues')
        .findOne({ _id: result.insertedId });
    return savedIssue;
}

async function issueList() {
    const issues = await db.collection('issues').find({}).toArray();
    return issues;
}

async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});

const app = express();

app.use(express.static('public'));

async function startServer() {
    try {
        await connectToDb();
        await server.start();
        server.applyMiddleware({
            app,
            path: '/graphql'
        });
        app.listen(3001, function () {
            console.log('App started on port 3001');
        });
    } catch (error) {
        console.error('Error during server startup:', error);
    }
}

startServer();