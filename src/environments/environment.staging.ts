export const environment = {
  production: true,

  baseURL: "https://staging.alveo.edu.au",
  loginURL: "https://staging.alveo.edu.au/oauth/authorize",

  clientID: "b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084",
  clientSecret: "e533af5728a1334a089d9b446bda3204be4d59785734981832956b446cfbf64b",

  callbackURL: window.location.origin+ "/oauth/callback",

  segmentorURL: "/api/segment/url"
};