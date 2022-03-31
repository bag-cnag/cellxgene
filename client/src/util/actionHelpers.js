import _ from "lodash";
/* XXX: cough, cough, ... */
import { postNetworkErrorToast } from "../components/framework/toasters";

import store from "../reducers/index";

/*
dispatch an action error to the user.   Currently we use
async toasts.
*/
let networkErrorToastKey = null;
export const dispatchNetworkErrorMessageToUser = (message) => {
  if (!networkErrorToastKey) {
    networkErrorToastKey = postNetworkErrorToast(message);
  } else {
    postNetworkErrorToast(message, networkErrorToastKey);
  }
};

/*
Catch unexpected errors and make sure we don't lose them!
*/
export function catchErrorsWrap(fn, dispatchToUser = false) {
  return (dispatch, getState) => {
    fn(dispatch, getState).catch((error) => {
      console.error(error);
      if (dispatchToUser) {
        dispatchNetworkErrorMessageToUser(error.message);
      }
      dispatch({ type: "UNEXPECTED ERROR", error });
    });
  };
}

const createHeaders = (url, acceptType) => {
  let headers = new Headers({
    Accept: acceptType,
  });

  if (url.includes("/api/v0.2/schema")) {
    const state = store.getState();
    const token = state.controls.token;
    headers.append("Authorization", token);
  }
  return headers;
};

/*
Wrapper to perform async fetch with some modest error handling
and decoding.
*/
const doFetch = async (url, acceptType) => {
  try {
    const res = await fetch(url, {
      method: "get",
      headers: createHeaders(url, acceptType),
      credentials: "include",
    });
    if (res.ok && res.headers.get("Content-Type").includes(acceptType)) {
      console.log(`res`, res);
      return res;
    }
    // else an error
    console.log("unexpected response from server");
    const msg = `Unexpected HTTP response ${res.status}, ${res.statusText}`;
    dispatchNetworkErrorMessageToUser(msg);
    throw new Error(msg);
  } catch (e) {
    // network error
    console.log("unexpected HTTP error");
    console.log(e);

    let msg = "Unexpected HTTP error";
    console.log(e.message);

    // FIXME
    // temporary hack to show an error message when the user is not authorized to view a file
    // (e.g. the file is not public or it is not shared with the user's keycloak group)
    // it has to be tested if that error message is thrown in other cases as well
    // and if that is confusing the users 

    if (e.message === "Unexpected HTTP response 404, NOT FOUND") {
      msg = "Your user is not authorized to view that file";
    }
    dispatchNetworkErrorMessageToUser(msg);
    throw e;
  }
};

/*
Wrapper to perform an async fetch and JSON decode response.
*/
export const doJsonRequest = async (url) => {
  const res = await doFetch(url, "application/json");
  return res.json();
};

/*
Wrapper to perform an async fetch for binary data.
*/
export const doBinaryRequest = async (url) => {
  const res = await doFetch(url, "application/octet-stream");
  return res.arrayBuffer();
};

/*
This function "packs" filter index lists into the more efficient
"range" form specified in the REST 0.2 spec.

Specifically, it turns an array of indices [0, 1, 2, 10, 11, 14, ...]
into a form that encodes runs of consecutive numbers as [min, max].
Array may not be sorted, but will only contain uniq values.

Parameters:
   indices - input array of numbers (index)
   minRangeLength - hint, min range length before it is encoded into range format.
   sorted - boolean hint indicating array is presorted, ascending order

So [1, 2, 3, 4, 10, 11, 14] -> [ [1, 4], [10, 11], 14]
*/
export const rangeEncodeIndices = (
  indices,
  minRangeLength = 3,
  sorted = false
) => {
  if (indices.length === 0) {
    return indices;
  }

  if (!sorted) {
    indices = _.sortBy(indices);
  }

  const result = new Array(indices.length);
  let resultTail = 0;

  let i = 0;
  while (i < indices.length) {
    const begin = indices[i];
    let current;
    do {
      current = indices[i];
      i += 1;
    } while (i < indices.length && indices[i] === current + 1);

    if (current - begin + 1 >= minRangeLength) {
      result[resultTail] = [begin, current];
      resultTail += 1;
    } else {
      for (let j = begin; j <= current; j += 1, resultTail += 1) {
        result[resultTail] = j;
      }
    }
  }

  result.length = resultTail;
  return result;
};
