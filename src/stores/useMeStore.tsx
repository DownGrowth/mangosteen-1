import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { http } from "../shared/Http";

type MeState = {
  me?: User;
  mePromise?: Promise<AxiosResponse<Resource<User>>>;
};
type meActions = {
  refreshMe: () => void;
  fetchMe: () => void;
};
export const useMeStroe = defineStore<string, MeState, {}, meActions>("me", {
  state: () => ({
    me: undefined,
    mePromise: undefined,
  }),
  actions: {
    refreshMe() {
      this.mePromise = http.get<Resource<User>>("/me");
    },
    fetchMe() {
      this.refreshMe();
    },
  },
});
