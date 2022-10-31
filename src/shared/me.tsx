import { AxiosResponse } from "axios";
import { http } from "./Http";
export let mePromise:
  | Promise<
      AxiosResponse<{
        resourse: {
          id: number;
        };
      }>
    >
  | undefined;
export const refreshMe = () => {
  mePromise = http.get<{ resourse: { id: number } }>("/me");
  return mePromise;
};
export const fetchMe = refreshMe;
