import { test as base } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

type FastAuthFixtures = {
    apiLogIn: () => Promise<void>;
};

export const test = base.extend<FastAuthFixtures>({

    apiLogIn: async ({ request, context }, use) => {
        await use( async () => {
            const email = process.env.E2E_EMAIL;
            const password = process.env.E2E_PASSWORD;
        
            if (!email || !password) {
                throw new Error('E2E_EMAIL and E2E_PASSWORD must be set in the environment variables.');
            }

            const loginResponse = await request.post('/api/auth/login', {
                data : { email, password }
            });

            if( !loginResponse.ok() ) {
                const errorBody = await loginResponse.text();
                throw new Error(`API login failed with status ${loginResponse.status()}: ${errorBody}`);
            }

            // stoareState() returns the current storage state, including cookies and localStorage, which can be used to set the browser context's state for subsequent requests.
            const state = await request.storageState();

            if( state.cookies.length === 0 ) {
                throw new Error('API login did not return any cookies.');
            }

            await context.addCookies(state.cookies);
        })
    }
});