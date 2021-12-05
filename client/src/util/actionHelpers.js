import _ from "lodash";
/* XXX: cough, cough, ... */
import { postNetworkErrorToast } from "../components/framework/toasters";
import cnag_auth from "../components/cnag_auth";

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

/*
Wrapper to perform async fetch with some modest error handling
and decoding.
*/

// see 3TR-client apis.js

// export function test(token, urlprefix) {
//   return fetch(`${urlprefix}api/tokentest`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: token,
//     },
//   });
// }

// const doFetch = async (url, acceptType,token) => {
//   try {
//     const res = await fetch(url, {
//       method: "get",
//       headers: new Headers({
//         Accept: acceptType,
//       }),
//       credentials: "include",
//     });
//     if (res.ok && res.headers.get("Content-Type").includes(acceptType)) {
//       return res;
//     }
//     // else an error
//     const msg = `Unexpected HTTP response ${res.status}, ${res.statusText}`;
//     dispatchNetworkErrorMessageToUser(msg);
//     throw new Error(msg);
//   } catch (e) {
//     // network error
//     const msg = "Unexpected HTTP error";
//     dispatchNetworkErrorMessageToUser(msg);
//     throw e;
//   }
// };

const doFetch = async (url, acceptType) => {
  // console.log('url :>> ', url);
  // console.log(cnag_auth.getToken())

  if (url.includes("/api/v0.2/schema")) {
    console.log(url);
    console.log("doFetch -> cnag_auth.getToken() :>> ", cnag_auth.getToken());

    const token = cnag_auth.getToken();

    // TODO
    // change this to use the token
    try {
      const res = await fetch(url, {
        method: "get",
        headers: new Headers({
          Accept: acceptType,
          Authorization: token,
        }),
        credentials: "include",
      });
      if (res.ok && res.headers.get("Content-Type").includes(acceptType)) {
        return res;
      }
      // else an error
      const msg = `Unexpected HTTP response ${res.status}, ${res.statusText}`;
      dispatchNetworkErrorMessageToUser(msg);
      throw new Error(msg);
    } catch (e) {
      // network error
      const msg = "Unexpected HTTP error";
      dispatchNetworkErrorMessageToUser(msg);
      throw e;
    }
  }

  try {
    const res = await fetch(url, {
      method: "get",
      headers: new Headers({
        Accept: acceptType,
      }),
      credentials: "include",
    });
    if (res.ok && res.headers.get("Content-Type").includes(acceptType)) {
      return res;
    }
    // else an error
    const msg = `Unexpected HTTP response ${res.status}, ${res.statusText}`;
    dispatchNetworkErrorMessageToUser(msg);
    throw new Error(msg);
  } catch (e) {
    // network error
    const msg = "Unexpected HTTP error";
    dispatchNetworkErrorMessageToUser(msg);
    throw e;
  }
};

/*
Wrapper to perform an async fetch and JSON decode response.
*/
// export const doJsonRequest = async (url,token) => {
//   const res = await doFetch(url, "application/json",token);
//   return res.json();
// };

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
