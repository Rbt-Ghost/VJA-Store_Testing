import {Page} from '@playwright/test';

export const authLocators = (page: Page) => ({
  // Login
  loginLink: () => page.getByRole('link', { name: 'Login' }),
  loginEmailInput: () => page.getByTestId('login-email-input'),
  loginPasswordInput: () => page.getByTestId('login-password-input'),
  loginBtn: () => page.getByTestId('login-btn'),
  loginError: () => page.getByTestId('login-error'),

  // Register
  registerLink: () => page.getByRole('link', { name: 'Register' }),
  registerNameInput: () => page.getByTestId('register-name-input'),
  registerEmailInput: () => page.getByTestId('register-email-input'),
  registerPasswordInput: () => page.getByTestId('register-password-input'),
  registerBtn: () => page.getByTestId('register-btn'),
  emailError: () => page.getByTestId('email-error'),
  passwordError: () => page.getByTestId('password-error'),
});

export const navbarLocators = (page: Page) => ({
  logoutButton: () => page.getByRole('button', { name: 'Logout' }),
  storeLink: () => page.getByRole('link', { name: 'VJA Store' }),
});