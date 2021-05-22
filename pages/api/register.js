import { API_URL } from "@/config/index";
import cookie from "cookie";
import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const { username, email, password } = req.body;
    try {
      const strapiRes = await axios.post(`${API_URL}/auth/local/register`, {
        username: username,
        email: email,
        password: password,
      });

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", strapiRes.data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development" ? true : false,
          maxAge: 1800,
          sameSite: "strict",
          path: "/",
        })
      );
      res.status(200).json(strapiRes.data.user);
    } catch (e) {
      if (e.response) {
        res
          .status(e.response.data.statusCode)
          .json({ message: e.response.data.message[0].messages[0].message });
        return;
      }
      res.status(500).json({ message: "Unable to Register at this time" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
