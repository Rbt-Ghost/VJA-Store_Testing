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
        email: 'First User',
        password: '123456',
    }
};