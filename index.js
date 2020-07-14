const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });

const doAsync = (fn) => async (req, res, next) => await fn(req, res, next).catch(next);

async function err() {
    throw new Error("에러 발생");
}

//라우팅 핸들러
app.post(
    "/endpoint/authenticate",
    doAsync(async (req, res) => {
        console.log("Request on");
        const { code } = req.body;
        console.log(code);
        const response = await axios
            .post("https://github.com/login/oauth/access_token", {
                code: code,
                client_id: "aac6cc06d7890685988f",
                client_secret: "0c85c443181245cc6fba6e3d41e184e678c40d0c",
            })
            .then((response) => {
                result = response.data;
                accessTokenRaw = response.data.split("&")[0];
                accessToken = accessTokenRaw.split("=")[1];
                const responseJson = {
                    accessToken: accessToken,
                };
                return responseJson;
            })
            .catch((error) => {
                console.log("error");
                return "error";
            });
        if (response) {
            res.json(response);
        }
    })
);

// app.post("/endpoint/authenticate", (req, res) => {
//     console.log("Request on");
//     const { code } = req.body;
//     console.log(code);
//     const client_secret = "0c85c443181245cc6fba6e3d41e184e678c40d0c";
//     const client_id = "aac6cc06d7890685988f";
//     const data = new FormData();
//     data.append("client_id", client_id);
//     data.append("client_secret", client_secret);
//     data.append("code", code);
//     var result = null;
//     axios
//         .post("https://github.com/login/oauth/access_token", {
//             code: code,
//             client_id: "aac6cc06d7890685988f",
//             client_secret: "0c85c443181245cc6fba6e3d41e184e678c40d0c",
//         })
//         .then((response) => {
//             console.log(response);
//             res.send(json(response.data));
//             result = response.data;
//             return res.status(200).json(response.data);
//         })
//         .catch((error) => {
//             console.log("error");
//             return res.status(401);
//         });
//     // Request to exchange code for an access token
//     // fetch(`https://github.com/login/oauth/access_token`, {
//     //     method: "POST",
//     //     body: data,
//     // })
//     //     .then((response) => {
//     //         console.log(response);
//     //         response.text();
//     //     })
//     //     .then((paramsString) => {
//     //         let params = new URLSearchParams(paramsString);
//     //         const access_token = params.get("access_token");
//     //         const scope = params.get("scope");
//     //         const token_type = params.get("token_type");

//     //         // Request to return data of a user that has been authenticated
//     //         return fetch(
//     //             `https://api.github.com/user?access_token=${access_token}&scope=${scope}&token_type=${token_type}`
//     //         );
//     //     })
//     //     .then((response) => response.json())
//     //     .then((response) => {
//     //         return res.status(200).json(response);
//     //     })
//     //     .catch((error) => {
//     //         return res.status(400).json(error);
//     //     });
// });

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
