import cors = require("cors");

export const port = 3001;
export const whitelisted_hosts = [
    "https://studio.apollographql.com",
    "http://localhost:3000",
    undefined
];
export const corsSettings = () => {
    return cors({
        origin: (origin, callback) => {
            if (whitelisted_hosts.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    });
}