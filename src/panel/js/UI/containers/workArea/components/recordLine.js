import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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
        this.isOpen = {
            name: false,
            target: false,
            value: false
        };
        this.toggle = this.toggle.bind(this);
        this.toggleName = this.toggleName.bind(this);
        this.toggleTarget = this.toggleTarget.bind(this);
        this.toggleValue = this.toggleValue.bind(this);
    }
    toggle() {
        this.props.editBlock.isOpen = !this.props.editBlock.isOpen;
    }

    toggleName() {
        this.isOpen = {
            ...this.isOpen,
            name: !this.isOpen.name
        };
        this.setState(this.isOpen);
    }

    toggleTarget() {
        this.isOpen = {
            ...this.isOpen,
            target: !this.isOpen.target
        };
        this.setState(this.isOpen);
    }

    toggleValue() {
        this.isOpen = {
            ...this.isOpen,
            value: !this.isOpen.value
        };
        this.setState(this.isOpen);
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
                        events.others.setIsOnWorkArea(true);
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
        if(recordInfo.name === "clickAt"){
            selectBar = (
                <Col xs="auto" className={cls.clickRecoedLineInputCol} style={{ paddingRight: "5px", width: "45%", height: "5%"}}>
                    <ButtonDropdown isOpen={this.isOpen.target} toggle={this.toggleTarget} className={cls.clickRecoedLineButtonDropDown}>
                        <Button className={cls.clickRecoedLineDropDown}>
                            Dropdown
                        </Button>
                        <DropdownToggle className={cls.clickRecoedLineDropDownToggle}>
                        </DropdownToggle>
                        <DropdownMenu className={cls.clickRecoedLineDropDownMenu}>
                            <DropdownItem value = "clickAnimation" onClick={(event) => {
                            let recordNum = recordInfo.id.split('-')[1];
                            events.workArea.selectForm(event, recordNum);
                        }}>clickAnimation</DropdownItem>
                            <DropdownItem value="focus" onClick={(event) => {
                            let recordNum = recordInfo.id.split('-')[1];
                            events.workArea.selectForm(event, recordNum);
                        }}>focus</DropdownItem>
                            <DropdownItem value="showText" onClick={(event) => {
                            let recordNum = recordInfo.id.split('-')[1];
                            events.workArea.selectForm(event, recordNum);
                        }}>showText</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </Col>
            );
        }
        if (!this.props.isInclude) {
            clickLineHandler = (event) => {
                event.stopPropagation();
                events.others.setSelectedRecords([idText], event.ctrlKey, event.shiftKey);
                events.others.setIsOnWorkArea(true);
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
                workArea.setEditBlock(obj);
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
