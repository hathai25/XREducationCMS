import {instanceCoreApi} from "./setupAxios.js";
import {AUTH_API} from "./apis/index.js";

export const loginUser = (payload) => {
    return instanceCoreApi.post(AUTH_API.LOGIN, {
        ...payload,
        type: 'AuthToken'
    })
}