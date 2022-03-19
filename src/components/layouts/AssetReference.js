import React from "react";
import Header from "../structural/header/Header";
import Footer from "../structural/Footer";
import AssetReferencePage from "../reference/AssetReferencePage";

import * as layoutTypes from "../../constants/LayoutTypes.js";

export const AssetReference = ({ editor, editorActions, user, userSettings, userActions, authActions, scene, sceneActions, projectActions, courseActions, projects, courses, match, collectionActions, collections }) => (
    <div className="App">
        <Header
            logging={authActions}
            sceneActions={sceneActions}
            actions={editorActions}
            user={user}
            settings={userSettings}
            userActions={userActions}
            scene={scene}
            text={editor.text}
            message={editor.message}
            projectId={match.params.id}
            match={match}
            projectActions={projectActions}
            courseActions={courseActions}
            projects={projects}
            courses={courses}
            collectionActions={collectionActions}
            collections={collections}
            layoutType={layoutTypes.REFERENCE}
        />
        <div className="row no-gutters">
            <AssetReferencePage user={user} settings={userSettings}/>
        </div>
        <Footer />
    </div>
);

export default AssetReference;