import {USER_API} from "./apis/index.js";
import {instanceCoreApi} from "./setupAxios.js";

export const getUserInfoViaId = ({ id }) => {
    return instanceCoreApi.post(USER_API.GET_USER_INFO, {
        uid: id,
        type: "UserDetail"
    })
}