import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faExclamationCircle, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import cx from "classnames";
import RecordLine from "./components/recordLine";
import SnapshotModal from "./components/snapshotModal";
// import EditBlock from "./components/editBlock";
import cls from "./style.scss";
import events from "../../events";
import { workArea } from "../../entryPoint";

class WorkArea extends React.Component {
    constructor(props) {
        super(props);
    }

    createRecords(workArea) {
        let selectedCaseIdTexts = workArea.selectedCaseIdTexts;
        if (selectedCaseIdTexts.length <= 0) {
            return;
        } else {
            let lines = workArea.testCase.cases[selectedCaseIdTexts[0]].records
                .map((record, index) => {
                    return (
                        <RecordLine key={index} index={index} recordInfo={record}
                            selectedCaseIdText={selectedCaseIdTexts[0]}
                            selectedRecordIdTexts={workArea.selectedRecordIdTexts}
                            setReference={this.props.setReference}
                            toggleSnapshotModal={this.props.toggleSnapshotModal}
                            isInclude={false} idText={`records-${index}`}
                            isFirstIncluded={true}
                        />
                    );
                });

            return lines;
        }
    }

    render() {
        let videoIconStyle = cx(cls.videoIconStyle, "faIcon text-right");
        let workAreaColStyle = cx(cls.workAreaCol, {[cls.append]: this.props.workAreaAppend});
        let workAreaStyle = cx(cls.workArea, {[cls.append]:this.props.workAreaAppend});
        let openNavColStyle = cx(cls.openNavCol, {[cls.show]:this.props.workAreaAppend});
        let recordContainer = cx(cls.recordContainer);

        return (
            <Col xs="auto" className={workAreaColStyle} id="workArea-col" onClick={events.workArea.clickWorkArea}>
                <Container fluid={true} style={{ padding: "0" }}>
                    <Row style={{ margin: "0" }}>
                        <Col id="open-nav" xs="auto" className={openNavColStyle}>
                            <div title="show test suites">
                                <Button className={cls.openNavButton}
                                    onClick={() => { this.props.toggleFileList(); }}
                                >
                                    <FontAwesomeIcon className="faIcon" icon={faCaretRight} />
                                </Button>
                            </div>
                        </Col>
                        <Col id="workArea" xs="auto" className={workAreaStyle}>
                            <Container fluid={true} className={cls.testCaseGridHeaderContainerStyle}>
                                {/* <Row className={cls.testCaseGridHeaderStyle}>
                                    <Col xs="auto" style={{ padding: "0", width: "8%" }} onClick={events.app.clickReportError}>
                                        <FontAwesomeIcon icon={faExclamationCircle} title="report error" className={videoIconStyle} />
                                    </Col>
                                    <Col xs="auto" className={cx(cls.colDivision, cls.header, cls.name)}><span className={cls.textStyle}>Command</span></Col>
                                    <Col xs="auto" className={cx(cls.colDivision, cls.header, cls.target)}><span className={cls.textStyle}>Target</span></Col>
                                    <Col xs="auto" className={cx(cls.colDivision, cls.header, cls.value)}><span className={cls.textStyle}>Value</span></Col>
                                    <Col xs="auto" className={cx(cls.colDivision, cls.header, cls.snapshot)} title={"Video"}
                                        onClick={events.workArea.clickSnapshotVideo}
                                    >
                                        <FontAwesomeIcon icon={faVideo} className={videoIconStyle} />
                                    </Col>
                                </Row> */}
                            </Container>
                            <Container fluid={true} className={recordContainer}
                                onContextMenu={(event) => { events.app.openContextMenu(event, "record default"); }}
                                onClick={(event) => {
                                    events.others.setSelectedRecords([], false, false);
                                    // workArea.setEditBlock({ isOpen: false });
                                }}
                            >
                                {this.createRecords(this.props.workArea)}
                            </Container>
                            {/* <EditBlock editBlock={this.props.workArea.editBlock} setReference={this.props.setReference}
                                selectedRecordIdTexts={this.props.workArea.selectedRecordIdTexts}/> */}
                            <SnapshotModal workArea={this.props.workArea}
                                toggleSnapshotModal={this.props.toggleSnapshotModal}
                            />
                        </Col>
                    </Row>
                </Container>
            </Col>
        );
    }
}

const mapStateToProps = state => {
    return {
        workArea: state.workArea
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setReference: (command) => {
            dispatch({
                type: "SET_REFERENCE",
                payload: {
                    command: command
                }
            });
        },
        toggleSnapshotModal: () => {
            dispatch({
                type: "TOGGLE_SNAPSHOT_MODAL"
            });
        },
        setSnapshotModal: (type, url, downloadUrl) => {
            dispatch({
                type: "SET_SNAPSHOT_MODAL",
                payload: {
                    type: type,
                    url: url,
                    downloadUrl: downloadUrl
                }
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkArea);
