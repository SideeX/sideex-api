import React from "react";
import { Container, Row, Col, ButtonToggle } from "reactstrap";
import { Button, ButtonToolbar, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircle } from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";
import cls from "../style.scss";
import events from "../../../events";
import { workArea } from "../../../entryPoint";

//filecontroller events sideex-api
class RecordLine extends React.Component {
    constructor(props) {
        super(props);
        this.recordElement;
    }

    createSnapshotIcon(recordInfo) {
        let snapshotIdText = recordInfo.screenshot;
        if (snapshotIdText != "") {
            return (
                <FontAwesomeIcon
                    style={{ color: "white" }}
                    className="faIcon text-right"
                    icon={faCamera}
                    onClick={(event) => {
                        event.stopPropagation();
                        events.workArea.clickSnapshotImage(snapshotIdText, recordInfo.name);
                    }}
                />
            );
        }
    }

    includeRecord(recordInfo) {
        if (recordInfo.children) {
            let lines = recordInfo.children[0]
                .map((record, index) => {
                    return (
                        <RecordLine key={index} index={index} recordInfo={record}
                            selectedCaseIdText={this.props.selectedCaseIdTexts}
                            selectedRecordIdTexts={this.props.selectedRecordIdTexts}
                            setReference={this.props.setReference}
                            toggleSnapshotModal={this.props.toggleSnapshotModal}
                            isInclude={true} idText={`${this.props.idText}-${index}`}
                            isFirstIncluded={false}
                        />
                    );
                });
            return lines;
        }
        return;
    }

    render() {
        let idText = this.props.idText;
        let recordInfo = this.props.recordInfo;
        recordInfo.id = idText;
        let gridLineStyle = cx(cls.gridLineStyle,
            { [cls.selected]: !this.props.isInclude &&
                this.props.selectedRecordIdTexts.indexOf(idText) >= 0 },
            { [cls.default]: (recordInfo.status === "default") },
            { [cls.success]: (recordInfo.status === "success") },
            { [cls.fail]: (recordInfo.status === "fail") },
            { [cls.execute]: recordInfo.status === "execute" },
            { [cls.notHover]: this.props.isInclude }
        );
        let rowNum = cx(cls.rowNum,
            { [cls.success]: (recordInfo.status === "success") },
            { [cls.fail]: (recordInfo.status === "fail") },
            { [cls.execute]: recordInfo.status === "execute" },
        );

        let includeRecords, clickLineHandler, contextMenuHandler, clickBreakpointHandler, selectBar;
        if (recordInfo.name === "INCLUDE" &&
            (recordInfo.children && recordInfo.children[0].length > 0)) {
            let includeCommands = cx(cls.includeCommands,
                { [cls.first]: this.props.isFirstIncluded }
            );
            includeRecords = (
                <Container className={includeCommands}>
                    {this.includeRecord(recordInfo)}
                </Container>
            );
        }
        if (!this.props.isInclude) {
            clickLineHandler = (event) => {
                event.stopPropagation();
                events.others.setSelectedRecords([idText], event.ctrlKey, event.shiftKey);
                this.props.setReference(recordInfo.name);
                let obj = { index: this.props.index,
                    usedIndex: {
                        target: recordInfo.target.usedIndex,
                        value: recordInfo.value.usedIndex
                    },
                    value: {
                        name: recordInfo.name,
                        targets: recordInfo.target.options,
                        values: recordInfo.value.options
                    }
                };
                if (!event.ctrlKey && !event.shiftKey) obj.isOpen = true;
            };
            contextMenuHandler = (event) => {
                events.others.setSelectedRecords([idText], event.ctrlKey, event.shiftKey);
                events.app.openContextMenu(event, "record");
            };
            clickBreakpointHandler = (event) => {
                events.workArea.clickBreakpoint(this.props.selectedCaseIdText, this.props.index);
            };
        }

        return (
            <Row className={gridLineStyle} id={idText}
                onClick={clickLineHandler} onContextMenu={contextMenuHandler} >
                <Col xs="auto" className={rowNum}><span>{this.props.index + 1}</span></Col>
                <Col xs="auto" style={{ padding: "0", width: "4%", textAlign: "center" }} onClick={clickBreakpointHandler}>
                    <FontAwesomeIcon icon={faCircle} className={
                        `fa-xs ${recordInfo.breakpoint ? cls.breakpoint : cls.preBreakpoint}`
                    }/>
                </Col>
                <Col xs="auto" className={cx(cls.colDivision, cls.name)}>
                    <span className={cls.gridLineTextStyle}>{recordInfo.name}</span>
                </Col>
                {selectBar}
                {/* <Col xs="auto" className={cx(cls.colDivision, cls.target)}>
                    <span className={cls.gridLineTextStyle}>{recordInfo.target.options[recordInfo.target.usedIndex].value}</span>
                </Col>
                <Col xs="auto" className={cx(cls.colDivision, cls.value)}>
                    <span className={cls.gridLineTextStyle}>{recordInfo.value.options[recordInfo.value.usedIndex].value}</span>
                </Col>
                <Col xs="auto" className={cx(cls.colDivision, cls.snapshot)} title={"Screen shot"}>
                    {this.createSnapshotIcon(recordInfo)}
                </Col> */}
                {includeRecords}
            </Row>
        );
    }
}

export default RecordLine;
