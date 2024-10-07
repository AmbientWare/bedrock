const UsersTable = {
    TableName: 'Users',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
        { AttributeName: 'oauthId', AttributeType: 'S' },
        { AttributeName: 'accessToken', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'EmailIndex',
            KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            Limit: 1
        },
        {
            IndexName: 'OauthIdIndex',
            KeySchema: [{ AttributeName: 'oauthId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            Limit: 1
        },
        {
            IndexName: 'TokenIndex',
            KeySchema: [{ AttributeName: 'accessToken', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            Limit: 1
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
}

const SessionsTable = {
    TableName: 'Sessions',
    KeySchema: [{ AttributeName: 'sessionId', KeyType: 'HASH' }],
    AttributeDefinitions: [
        { AttributeName: 'sessionId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'UserIdIndex',
            KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
}

const AllowedUserEmailsTable = {
    TableName: 'AllowedUserEmails',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'EmailIndex',
            KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
}

export const tables = [UsersTable, SessionsTable, AllowedUserEmailsTable]
