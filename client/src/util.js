import axios from "axios";

export const hostname = `${window.location.origin}/api`;
// export const hostname = `http://localhost:8800/api`;

export async function getAllVideosfromServer(type) {
  const res = await axios.get(`${hostname}/video/${type}`, {
    withCredentials: true,
  });
  return res.data;
}
