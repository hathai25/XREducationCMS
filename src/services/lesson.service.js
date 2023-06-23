import {instanceCoreApi} from "./setupAxios.js";
import {LESSON_API} from "./apis/index.js";

export const getAllLesson = (body) => {
    return instanceCoreApi.post(LESSON_API.GET_LESSON_LIST, {
        type: "getLessonList",
        ...body,
    });
}

export const updateLessonStatus = ({lessonId, status}) => {
    return instanceCoreApi.post(LESSON_API.GET_LESSON_LIST, {
        type: "updateLessonStatus",
        nid: lessonId,
        status: status,
    });
}