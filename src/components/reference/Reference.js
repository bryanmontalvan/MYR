import React from "react";
import myrReference from "../../myr/reference";
import * as refFunctions from "../../myr/reference";

import * as layoutTypes from "../../constants/LayoutTypes";

import {
    Tabs,
    Tab,
    IconButton,
    Drawer,
    Icon,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Tooltip,
    Hidden
} from "@material-ui/core";

const exitBtnStyle = {
    //paddingbottom: 100,
    position: "absolute",
    top: 0,
    right: 10,
};

const exitBtnStyleDark = {
    position: "absolute",
    top: 0,
    right: 10,
    color: "white"
};

const newTabStyle = {
    position: "fixed",
    top: 0,
    right: 50,
};

const newTabStyleDark = {
    position: "fixed",
    top: 0,
    right: 50,
    color: "white"
};

const assetReferenceBtn = {
    position: "fixed",
    top: 0,
    right: 95,
};

const assetReferenceBtnDark = {
    position: "fixed",
    top: 0,
    right: 95,
    color: "white"
};
// TD lightMode and darkMode
const lightText = {color: "black"};
const darkText = {color: "white"};
const functionTextLight = {color: "#266d90"};
const functionTextDark = { color: "#3ea4d6"};

export default class Reference extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "a",
        };
        this.tableData = myrReference();
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleOpen = () => {
        window.open(window.origin + "/reference");
        this.setState({ value: "a" });
    };

    assetHandleOpen = () => {
        window.open(window.origin + "/asset-reference");
        this.setState({ value: "a" });
    };


    nameHelper = (name, parameters) => {
        return (
            <span>{name}({(parameters.map((element, i, params) => {
                let comma = i < params.length - 1 ? ", " : "";
                switch (element.type) {
                    case "number":
                        return <span>{refFunctions.numberText(element.name)}{comma}</span>;
                    case "string":
                        return <span>{refFunctions.stringText(element.name)}{comma}</span>;
                    case "bool":
                        return <span>{refFunctions.boolText(element.name)}{comma}</span>;
                    case "array":
                        return <span>{refFunctions.arrayText(element.name)}{comma}</span>;
                    case "data":
                        return <span>{refFunctions.dataText(element.name)}{comma}</span>;
                    default:
                        return null;
                }
            }))});</span>
        );
    };

    exampleHelper = (example) => {
        if (example) {
            let link = "/reference/" + example;
            return (
                <IconButton
                    style={this.props.userSettings.darkMode ? darkText : lightText}
                    href={link}
                    target="_blank"
                    className="material-icons">
                    link
                </IconButton>
            );
        } else {
            return null;
        }
    };

    TableEx = (category) => {

        return (
            <Table  >
                <TableHead >
                    <TableRow>
                        <TableCell style={this.props.userSettings.darkMode ? functionTextDark : lightText}>Name</TableCell>
                        <TableCell style={this.props.userSettings.darkMode ? darkText : lightText}>Description</TableCell>
                        <TableCell className='refExample' style={this.props.userSettings.darkMode ? darkText : lightText}>Example</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {this.tableData[category].map((row, index) => (
                        <TableRow key={index} >
                            <TableCell style={this.props.userSettings.darkMode ? functionTextDark : functionTextLight}>{this.nameHelper(row.name, row.parameters)}</TableCell>
                            <TableCell style={this.props.userSettings.darkMode ? darkText : lightText}>{row.description}</TableCell>
                            <TableCell  >{this.exampleHelper(row.example)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    render() {
        const style = {
            margin: 2,
            color: "#fff",
        };
        const tableDarkStyle = {
            marginTop: 0,
            overflow: "scroll",
            background: this.props.userSettings.darkMode ? "#222" : "white",
            // color: this.props.userSettings.darkMode ? "white" : "black"
        };
        const isDisabled = this.props.layoutType === layoutTypes.REFERENCE;
        return (
            <div>
                {!isDisabled ?
                    <React.Fragment>
                        <Tooltip title="Reference" placement="bottom-start">
                            <IconButton
                                id="ref-btn"
                                className="header-btn d-none d-md-block"
                                aria-haspopup="true"
                                onClick={this.props.handleReferenceToggle}
                                style={style}>
                                <Icon style={{ color: "#fff" }} className="material-icons">help</Icon>
                            </IconButton>
                        </Tooltip>
                        <Drawer
                            style={{ position: "relative", zIndex: 100 }}
                            anchor="right"
                            id={this.props.userSettings.darkMode ? "reference-drawer-dark" : "reference-drawer"}
                            variant="persistent"
                            className={!this.props.referenceOpen ? "d-none" : ""}
                            open={this.props.referenceOpen}>

                            <div>
                                <h3 className="border-bottom" style={{ 
                                    padding: 10, 
                                    fontWeight: 400, 
                                    background: this.props.userSettings.darkMode ? "#272822" : "white",
                                    color: this.props.userSettings.darkMode ? "white" : "black"
                                }
                                }>MYR API - Reference</h3>
                                <IconButton
                                    color="default"
                                    style={this.props.userSettings.darkMode ? exitBtnStyleDark : exitBtnStyle}
                                    onClick={() => {
                                        this.props.handleReferenceToggle();
                                        this.setState({ value: "a" });
                                    }}>
                                    <Icon className="material-icons">close</Icon>
                                </IconButton>
                                <IconButton
                                    title="Open reference page &#013;(in a new tab)"
                                    color="default"
                                    style={this.props.userSettings.darkMode ? newTabStyleDark : newTabStyle}
                                    onClick={this.handleOpen}>
                                    <Icon className="material-icons">menu_book</Icon>
                                </IconButton>
                                <IconButton
                                    title="Open asset reference page &#013;(in a new tab)"
                                    color="default"
                                    style={this.props.userSettings.darkMode ? assetReferenceBtnDark : assetReferenceBtn}
                                    onClick={this.assetHandleOpen}>
                                    <Icon className="material-icons-outlined">settings_system_daydream</Icon>
                                </IconButton>
                            </div>

                            <div>
                                <Tabs
                                    id="reference-tabs"
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                    variant="fullWidth"
                                    style={{
                                        background: this.props.userSettings.darkMode ? "#272822" : "white",
                                        color: this.props.userSettings.darkMode ? "white" : "black"
                                    }} //Changes for darkMode (Tab)
                                > 
                                    <Tab
                                        icon={<Icon className="material-icons geometry">category</Icon>}
                                        label={
                                            <Hidden xsDown>
                                                <div>GEOMETRY</div>
                                            </Hidden>
                                        }
                                        value='a' />
                                    <Tab
                                        icon={<Icon className="material-icons color-change">bubble_chart</Icon>}
                                        label={
                                            <Hidden xsDown>
                                                <div>TRANSFORMATIONS</div>
                                            </Hidden>
                                        }
                                        value='b' />
                                    <Tab
                                        icon={<Icon className="material-icons animation-ref">zoom_out_map</Icon>} //swap_horiz control_camera category
                                        label={
                                            <Hidden xsDown>
                                                <div>ANIMATIONS</div>
                                            </Hidden>
                                        }
                                        value='c' />
                                    <Tab
                                        icon={<Icon className="material-icons geometry">widgets</Icon>}
                                        label={
                                            <Hidden xsDown>
                                                <div>GROUPS</div>
                                            </Hidden>
                                        }
                                        value='d' />
                                    <Tab
                                        icon={<Icon className="material-icons geometry">highlight</Icon>}
                                        label={
                                            <Hidden xsDown>
                                                <div>LIGHT</div>
                                            </Hidden>
                                        }
                                        value='e' />
                                    {/*<Tab
                                    style={{ background: "green", color: "white" }}
                                    icon={<Icon className="material-icons">open_in_new</Icon>}
                                    label="OPEN IN NEW TAB"
                                    value='n'
                                    onClick={this.handleOpen} />
                                <Tab
                                    style={{ background: "red", color: "white" }}
                                    icon={<Icon className="material-icons">close</Icon>}
                                    label="CLOSE"
                                    value='x'
                                    onClick={() => {
                                        this.props.handleReferenceToggle();
                                        this.setState({ value: "a" });
                                    }} />*/}
                                </Tabs>
                            </div>

                            {<div style={{ margin: 7, overflow: "hidden", minHeight: "2em",
                                background: this.props.userSettings.darkMode ? "#222" : "white",
                                color: this.props.userSettings.darkMode ? "white" : "black" }}>
                                <p style={{ 
                                    fontSize: "80%", 
                                }}> Key: <span className="array">array </span>
                                    <span className="bool">bool </span>
                                    <span className="number">number </span>
                                    <span className="string">string </span>
                                    <span className="group">group </span>
                                    <span className="data">data</span></p>
                            </div>}
                            {this.state.value === "a" &&
                                <div style={tableDarkStyle}>
                                    {this.TableEx("geometry")}
                                </div>}
                            {this.state.value === "b" &&
                                <div style={tableDarkStyle}>
                                    {this.TableEx("transformations")}
                                </div>}
                            {this.state.value === "c" &&
                                <div style={tableDarkStyle}>
                                    {this.TableEx("animations")}
                                </div>}
                            {this.state.value === "d" &&
                                <div style={tableDarkStyle}>
                                    {this.TableEx("groups")}
                                </div>}
                            {this.state.value === "e" &&
                                <div style={tableDarkStyle}>
                                    {this.TableEx("lights")}
                                </div>}
                        </Drawer>
                    </React.Fragment> : null}
            </div>
        );
    }
}
