import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  process.env.ClientID,
  process.env.ClientSecret,
);
