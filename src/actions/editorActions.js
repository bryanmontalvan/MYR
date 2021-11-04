import { loadScene } from "./sceneActions";
import { DEF_SETTINGS } from "../reducers/scene";
import * as types from "../constants/ActionTypes";

const sceneRef = "/apiv1/scenes";

/**
 * Sends a signal to the reducer to render the scene
 *
 * @param {string} text Text from the Ace Editor component
 *
 * @returns reducer action obj with action type and text
 */
export function render(text, uid) {
    return { type: types.EDITOR_RENDER, text, uid };
}

/**
 * Sends a signal to the reducer to refresh with the given text
 *
 * @param {string} text Text from the Ace Editor component
 *
 * @returns reducer action obj with action type and text
 */
export function refresh(text, uid) {
    return { type: types.EDITOR_REFRESH, text, uid };
}

/**
 * Sends a signal to the reducer to 'rewind' until last stable render
 *
 * @returns reducer action obj with action type
 */
export function recover() {
    return { type: types.EDITOR_RECOVER };
}

/**
 * This does an async fetch to Firebase to grab the scene, then
 * dispatches the necessary functions to update the state.
 */
export function fetchScene(id, uid = "anon") {
    return (dispatch) => {  // Return a func that dispatches events after async
        fetch(`${sceneRef}/id/${id}`, {redirect: "follow"}).then((response) =>{
            if(response.redirected && id !== "error-404"){
                let url = response.url.split("/");
                window.location.assign(`${window.origin}/scene/${url[url.length - 1]}?redirected=true`);
                return;
            }

            if(response.status !== 200){
                if(response.status === 404){
                    window.location.assign(window.origin + "/error-404");
                }else{
                    console.error("Error retrieving scene. Reason: ", response.statusText);
                }
                return;
            }

            response.json().then((json) =>{
                if(json.code){
                    //don't change the title when fetching scene in collection
                    if(!document.title.includes("Collection")) {
                        document.title = json.name + " | MYR";
                    }
                    dispatch(render(json.code, uid || "anon"));
                    dispatch(updateSavedText(json.code));
                    let settings = DEF_SETTINGS;

                    if(json.settings){
                        settings = {...settings, ...json.settings};
                    }

                    dispatch(loadScene({
                        name: json.name ? json.name : "",
                        id: json.uid === uid ? id : 0,
                        ts: json.updateTime ? json.updateTime : Date.now(),
                        desc: json.desc ? json.desc : "",
                        settings: settings
                    }));
                }
            });
        });
    };
}

export function saveScene(newCollectionID = undefined) {
    return (dispatch, getState) => {  
        const state = getState();
        let editor, text;
        if (!state.scene.settings.viewOnly) { // Map props to new reducer
            //If in editor mode, gets text directly from editor
            editor = window.ace.edit("ace-editor");
            text = editor.getSession().getValue();
        } else {
            //Otherwise, gets text from state (should be up to date since it is refreshed on editor unmount) 
            text = state.editor.text;
        } 
        console.log("Soft ass", text, newCollectionID);

        // if (this.props.user && this.props.user.uid && text) {
        //     this.setState({ spinnerOpen: true });
        let scene = document.querySelector("a-scene");
        // Access the scene and screen shot, with perspective view in a lossy jpeg format
        let img = scene.components.screenshot.getCanvas("perspective").toDataURL("image/jpeg", 0.1);

        //     let newScene = {
        //         name: (this.props.scene.name ? this.props.scene.name : "Untitled Scene"),
        //         desc: this.props.scene.desc,
        //         code: text,
        //         uid: this.props.user.uid,
        //         settings: {
        //             ...this.props.scene.settings,
        //             collectionID: newCollectionID || this.props.scene.settings.collectionID
        //         },
        //         updateTime: Date.now(),
        //         createTime: (this.props.scene.createTime ? this.props.scene.createTime : Date.now())
        //     };

        //     save(this.props.user.uid, newScene, img, this.props.projectId).then((projectId) => {
        //         if (!projectId) {
        //             console.error("Could not save the scene");
        //         }

        //         this.props.actions.updateSavedText(text);
        //         // If we have a new projectId reload page with it
        //         if (projectId !== this.props.projectId) {
        //             this.setState({ spinnerOpen: false });
        //             window.location.assign(`${window.origin}/scene/${projectId}`);
        //             this.props.projectActions.asyncUserProj(this.props.user.uid);
        //         }
        //         if (!this.state.viewOnly) {
        //             this.props.actions.refresh(text, this.props.user ? this.props.user.uid : "anon");
        //         }
        //         this.setState({ spinnerOpen: false, saveOpen: false });
        //         this.state.socket.emit("save");
        //         return true;
        //     });
        // } else if (!text) {
        //     alert("There is no code to save for this scene. Try adding some in the editor!");
        // } else {
        //     // TODO: Don't use alert
        //     alert("We were unable to save your project. Are you currently logged in?");
        // }

        // if (!this.state.viewOnly) {
        //     this.props.actions.refresh(text, this.props.user ? this.props.user.uid : "anon");
        // }
        // this.setState({ savedSettings: this.buildSettingsArr() });
    };
}


/**
 * Sends a signal to the reducer to update the savedText when user try to save or open scene/course
 *
 * @returns reducer action obj with action type
 */

export function updateSavedText(savedText){
    return {type: types.EDITOR_UPDATE_SAVEDTEXT, savedText};
}

export function addPassword(payload) {
    return { type: types.ADD_PW, payload };
}

export default {
    render,
    refresh,
    recover,
    fetchScene,
    addPassword,
    updateSavedText,
    saveScene
};