export const testUsers = {
    validUser: {
        email: 'e2e@test.com',
        password: '123456',
    },

    invalidUser: {
        email: 'nonExistentAccount@test.com',
        password: 'wrongPassword',
    },

    duplicateUser: {
        name: 'First User',
        email: 'firstuser@test.com',
        password: '123456',
    },

    uniqueUser1: {
        name: 'Unique User 1' + Date.now(),
        email: 'uniqueuser1' + Date.now() + '@test.com',
        password: '123456',
    },

    uniqueUser2: {
        name: 'Unique User 2' + Date.now(),
        email: 'uniqueuser2' + Date.now() + '@test.com',
        password: '123456',
    },

    uniqueUser3: {
        name: 'Unique User 3' + Date.now(),
        email: 'uniqueuser3' + Date.now() + '@test.com',
        password: '123456',
    }
};