import { createStore, applyMiddleware, compose } from "redux";
import devToolsEnhancer from 'remote-redux-devtools'

import thunk from "redux-thunk";

import cascadeReducers from "./cascade";
import undoable from "./undoable";
import config from "./config";
import userInfo from "./userInfo";
import annoMatrix from "./annoMatrix";
import obsCrossfilter from "./obsCrossfilter";
import categoricalSelection from "./categoricalSelection";
import continuousSelection from "./continuousSelection";
import graphSelection from "./graphSelection";
import colors from "./colors";
import differential from "./differential";
import layoutChoice from "./layoutChoice";
import controls from "./controls";
import annotations from "./annotations";
import autosave from "./autosave";
import ontology from "./ontology";
import centroidLabels from "./centroidLabels";
import pointDialation from "./pointDilation";
import { reembedController } from "./reembed";
import { gcMiddleware as annoMatrixGC } from "../annoMatrix";

import undoableConfig from "./undoableConfig";

const Reducer = undoable(
  cascadeReducers([
    ["config", config],
    ["annoMatrix", annoMatrix],
    ["obsCrossfilter", obsCrossfilter],
    ["ontology", ontology],
    ["annotations", annotations],
    ["layoutChoice", layoutChoice],
    ["categoricalSelection", categoricalSelection],
    ["continuousSelection", continuousSelection],
    ["graphSelection", graphSelection],
    ["colors", colors],
    ["controls", controls],
    ["differential", differential],
    ["centroidLabels", centroidLabels],
    ["pointDilation", pointDialation],
    ["reembedController", reembedController],
    ["autosave", autosave],
    ["userInfo", userInfo],
  ]),
  [
    "annoMatrix",
    "obsCrossfilter",
    "categoricalSelection",
    "continuousSelection",
    "graphSelection",
    "colors",
    "controls",
    "differential",
    "layoutChoice",
    "centroidLabels",
    "annotations",
  ],
  undoableConfig
);

// works with vscode remote-redux-devtools
// first run npm run redux-devtools

// remove devToolsEnhancer before a production build
const store = createStore(
  Reducer,
  compose(
    applyMiddleware(thunk, annoMatrixGC),
    devToolsEnhancer({
    realtime: true,
    name: 'cellxgene',
    hostname: 'localhost',
    port: 8000
    })
  )
)
// works with Firefox 
// const store = createStore(
//   Reducer,
//   compose(
//     applyMiddleware(thunk, annoMatrixGC),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// )

export default store;
