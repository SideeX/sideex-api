import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import TestSuite from "./components/testSuite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import cls from "./style.scss";
import cx from "classnames";
import events from "../../events";
import FileListModal from "./components/FileListModal";
import { app } from "../../entryPoint";
import { root } from "../../../background/initial";

class FileList extends React.Component {
    constructor(props) {
        super(props);
    }

    suitesList(fileList) {
        let suites = fileList.testSuite.suites;
        let suiteList = [];
        for (let suiteIdText in suites) {
            suiteList.push(<TestSuite
                key={`key-${suiteIdText}`}
                suiteIdText={suiteIdText}
                suite={suites[suiteIdText]}
                testCase={fileList.testCase}
                selectedSuiteIdTexts={fileList.selectedSuiteIdTexts}
                selectedCaseIdTexts={fileList.selectedCaseIdTexts}
            />);
        }

        // if (suiteList.length === 0) {
        //     suiteList = (<Row style={{ height: "100%", margin: "0" }}><Col style={{ margin: "auto", textAlign: "center" }}>
        //         <span className={cls.defaultText}>{"Add/open a suite or click record button to start"}</span>
        //     </Col></Row>);
        // }
        return suiteList;
    }

    render() {
        let fileListColStyle = cx(cls.fileListCol, {
            [cls.hide]: this.props.isFileListHide
        });
        return (
            <Col xs="auto" className={fileListColStyle} id="fileList-col" >
                <FileListModal modal={this.props.fileList.modal}/>
                <input id="open-files" type="file" multiple accept="application/json"
                    style={{display: "none"}} onChange={events.fileList.changeOpenFile}
                />
                <Container className={cls.fileListContainerHeaderStyle}>
                    <Row className={cls.colStyle}>
                        {/* <Col xs="2" style={{ padding: "0", textAlign: "center", margin: "auto" }}>
                            <Button style={{ padding: "0 5px", backgroundColor: "#7796ca", border: "rgb(23, 39, 54)" }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    app.setContextMenu({
                                        isOpen: true, type: "suite default",
                                        clientX: event.clientX, clientY: event.clientY
                                    });
                                }}
                            >
                                <FontAwesomeIcon className={cx("faIcon", cls.fileListIcon)} icon={faBars} />
                            </Button>
                        </Col> */}
                        <Col xs="8" className={cls.headerTextStyleCol}>
                            <span className={cls.headerTextStyle}>Test Suite</span>
                        </Col>
                        {/* <Col xs="2" style={{ padding: "0", textAlign: "center", margin: "auto" }} title="hide test suites">
                            <Button style={{ padding: "0 5px", backgroundColor: "#7796ca", border: "rgb(23, 39, 54)" }}
                                onClick={() => { this.props.toggleFileList(); }}
                            >
                                <FontAwesomeIcon className={cx("faIcon", cls.fileListIcon)} icon={faCaretLeft} />
                            </Button>
                        </Col> */}
                    </Row>
                </Container>
                <Container className={cls.containerStyle}
                    onContextMenu={(event) => { events.app.openContextMenu(event, "suite default"); }}
                >
                    {this.suitesList(this.props.fileList)}
                </Container>
            </Col>
        );
    }
}

const mapStateToProps = state => {
    return {
        fileList: state.fileList
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
