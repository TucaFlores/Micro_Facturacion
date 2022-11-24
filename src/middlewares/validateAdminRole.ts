import axios from "axios";
import { NextFunction, Request, Response } from "express";
import cacheUtils from "../utils/cacheUtils";

require("dotenv").config();

const AUTH_URL = process.env.AUTH_URL;

//Test data
const DATA = {
  status: 200,
  data: {
    permissions: ["user", "admin"],
  },
};

const validateAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("Authorization");

  if (!authorization) {
    return res.status(401).json({
      msg: "authorization header empty, must include token",
    });
  }

  try {
    /*     const auth = await axios.get(`${AUTH_URL}/v1/users/current`, {
      headers: { Authorization: authorization },
    });*/
    const auth = DATA;
    if (auth.status != 200) {
      throw new Error("Token not found in auth service");
    }
    if (!auth.data.permissions.includes("admin")) {
      return res.status(401).json({ msg: "Invalid received User" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

export default validateAdminRole;
