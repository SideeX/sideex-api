import React from "react";
import { Collapse, Container, Row, Col, Input, Label } from "reactstrap";
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMousePointer, faEye, faTimes, faCaretSquareRight } from "@fortawesome/free-solid-svg-icons";
import selectTarget from "../../../../../icons/select_target.svg";
import cls from "../style.scss";
import referenceTable from "../../../referenceTable";
import events from "../../../events";
import { workArea } from "../../../entryPoint";

class EditBlock extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.editBlock;
        this.isOpen = {
            name: false,
            target: false,
            value: false
        };
        this.toggle = this.toggle.bind(this);
        this.toggleName = this.toggleName.bind(this);
        this.toggleTarget = this.toggleTarget.bind(this);
        this.toggleValue = this.toggleValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(event, type) {
        let value = event.target.value;
        this.props.editBlock = { ...this.props.editBlock };
        this.data = { ...this.data };
        switch (type) {
            case "name":
                this.props.editBlock.value.name = value;
                break;
            case "target":
                this.props.editBlock.value.target = value;
                break;
            case "value":
                this.props.editBlock.value.options[0] = value;
                break;
        }
    }

    getOption(type) {
        let value = this.props.editBlock.value;
        let usedIndex = this.props.editBlock.usedIndex;
        switch (type) {
            case "name":
                return { value: value.name, type: "none" };
            case "target":
                if (value.targets.length > 0) {
                    return value.targets[usedIndex.target];
                }
                return { value: "", type: "none" };
            case "value":
                if (value.values.length > 0) {
                    return value.values[usedIndex.value];
                }
                return { value: "", type: "none" };
            default:
                return { value: "", type: "none" };
        }
    }

    createInput(type) {
        let option = this.getOption(type);
        return (
            <Input
                type="text"
                list={`edit-block-${type}`}
                name={`command-${type}`}
                value={option.value}
                disabled={option.type === "tac" ? true : false }
                className={cls.inputStyle}
                onChange={(event) => {
                    type === "name" && this.props.setReference(event.target.value);
                    events.editBlock.updateSelectedRecord(event, type, event.target.value);
                }}
            />
        );
    }

    createDropDownItems(type) {
        let items = [];
        switch (type) {
            case "name": {
                let referenceKeys = Object.keys(referenceTable).sort((a, b) => {
                    let aUpperCase = a.charCodeAt(0) >= 97 ? false : true;
                    let bUpperCase = b.charCodeAt(0) >= 97 ? false : true;
                    if (aUpperCase && bUpperCase) return (a > b ? 1 : -1);
                    if (!aUpperCase && !bUpperCase) return (a > b ? 1 : -1);
                    return (a > b ? -1 : 1);
                });
                for (let i = 0; i < referenceKeys.length; i++) {
                    items.push(<DropdownItem key={`name-${i}`} className={cls.dropdownItemStyle} onClick={
                        (event) => {
                            this.props.setReference(referenceKeys[i]);
                            events.editBlock.updateSelectedRecord(event, "name", referenceKeys[i]);
                        }
                    }
                    >{referenceKeys[i]}</DropdownItem>);
                }
                break;
            }
            case "target": {
                let targets = this.props.editBlock.value.targets;
                for (let i = 0; i < targets.length; i++) {
                    items.push(<DropdownItem key={`target-${i}`} className={cls.dropdownItemStyle} onClick={
                        (event) => { events.editBlock.changeUsedIndex(event, "target", i); }}
                    >{targets[i].value}</DropdownItem>);
                }
                break;
            }
            case "value": {
                let values = this.props.editBlock.value.values;
                for (let i = 0; i < values.length; i++) {
                    items.push(<DropdownItem key={`value-${i}`} className={cls.dropdownItemStyle} onClick={
                        (event) => { events.editBlock.changeUsedIndex(event, "value", i); }}
                    >{values[i].value}</DropdownItem>);
                }
                break;
            }
        }
        return items;
    }

    selectTargetIcon(isSelect) {
        let className = cls.iconStyle;
        if (isSelect) {
            return selectTarget ? (<img className={className} src={selectTarget}/>) :
                (<FontAwesomeIcon icon={faCaretSquareRight} className={className}/>);
        } else {
            return (<FontAwesomeIcon icon={faMousePointer} className={className}/>);
        }
    }

    render() {
        return (
            <Collapse isOpen={this.props.selectedRecordIdTexts.length > 0 ? this.props.editBlock.isOpen : false}>
                <Container fluid={true}>
                    <Row>
                        <Col xs="11" className={cls.editBlockCommand}>
                            <span>{` #${this.props.editBlock.index + 1} `}</span>
                        </Col>
                        <Col xs="1" className={cls.editBlockIconStyle} title={"Close edit block"}>
                            <FontAwesomeIcon icon={faTimes} className={cls.iconStyle}
                                onClick={() => { workArea.setEditBlock({ isOpen: false }); }}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "5px" }}>
                        <Col xs="3" className={cls.editBlockTextStyle}><Label className={cls.labelStyle}>Command: </Label></Col>
                        <Col xs="9" className={cls.editBlockInputCol}>
                            <ButtonDropdown isOpen={this.isOpen.name} toggle={this.toggleName} size="sm" className={cls.editBlockButtonDropDown}>
                                <Button className={cls.editBlockDropDown}>
                                    {this.createInput("name")}
                                </Button>
                                <DropdownToggle caret className={cls.editBlockDropDownToggle}/>
                                <DropdownMenu right className={cls.editBlockDropDownMenu}>
                                    {this.createDropDownItems("name")}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "5px" }}>
                        <Col xs="auto" className={cls.editBlockTextStyle} style={{ width: "25%", margin: "auto 0" }}><Label className={cls.labelStyle}>Target: </Label></Col>
                        <Col xs="auto" className={cls.editBlockInputCol} style={{ paddingRight: "5px", width: "55%" }}>
                            <ButtonDropdown isOpen={this.isOpen.target} toggle={this.toggleTarget} size="sm" className={cls.editBlockButtonDropDown}>
                                <Button className={cls.editBlockDropDown}>
                                    {this.createInput("target")}
                                </Button>
                                <DropdownToggle caret className={cls.editBlockDropDownToggle}/>
                                <DropdownMenu right className={cls.editBlockDropDownMenu}>
                                    {this.createDropDownItems("target")}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </Col>

                        <Col xs="auto" className={cls.editBlockIconStyle} title={"Select target"}
                            onClick={events.editBlock.clickSelectElementButton}>
                            {this.selectTargetIcon(this.props.editBlock.isSelect)}
                        </Col>
                        <Col xs="auto" className={cls.editBlockIconStyle} title={"Show element"}
                            onClick={(event) => {
                                let editBlock = this.props.editBlock;
                                events.editBlock.clickShowElementButton(event, editBlock.value.targets[editBlock.usedIndex.target]);
                            }}
                        >
                            <FontAwesomeIcon icon={faEye} className={cls.iconStyle}/>
                        </Col>
                        <Col xs="auto" style={{ width: "15px" }}></Col>
                    </Row>
                    <Row style={{ marginBottom: "5px" }}>
                        <Col xs="3" className={cls.editBlockTextStyle}><Label className={cls.labelStyle}>Value: </Label></Col>
                        <Col xs="9" className={cls.editBlockInputCol}>
                            <ButtonDropdown isOpen={this.isOpen.value} toggle={this.toggleValue} size="sm" className={cls.editBlockButtonDropDown}>
                                <Button className={cls.editBlockDropDown}>
                                    {this.createInput("value")}
                                </Button>
                                <DropdownToggle caret className={cls.editBlockDropDownToggle}/>
                                <DropdownMenu right className={cls.editBlockDropDownMenu}>
                                    {this.createDropDownItems("value")}
                                </DropdownMenu>
                            </ButtonDropdown>
                        </Col>
                    </Row>
                </Container>
            </Collapse>
        );
    }
}

export default EditBlock;
