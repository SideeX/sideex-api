import React from "react";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TestCase from "./testCase";
import cls from "../style.scss";
import cx from "classnames";
import events from "../../../events";

class TestSuite extends React.Component {
    constructor(props) {
        super(props);
        this.casesDisplay = true;
        this.state = {
            dropdownOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    testCaseDiv(testCase, suiteIdText, suite) {
        return this.testCaseList(suiteIdText, suite.cases, testCase);
    }

    testCaseList(suiteIdText, cases, testCase) {
        let caseList = [];
        for (let caseIdText of cases) {
            // console.log(caseIdText);
            caseList.push(
                <TestCase
                    key={`key-${caseIdText}`}
                    caseEle={testCase.cases[caseIdText]}
                    suiteIdText={suiteIdText}
                    caseIdText={caseIdText}
                    selectedCaseIdTexts={this.props.selectedCaseIdTexts}
                />
            );
        }
        return caseList;
    }

    render() {
        let suiteHeaderStyle = cx(cls.suiteHeaderStyle,
            {[cls.selected]: this.props.selectedSuiteIdTexts.indexOf(this.props.suiteIdText) >= 0},
            {[cls.modified]: this.props.suite.modified}
        );
        let plusIconStyle = cx(cls.plusIconStyle, "faIcon");

        return (
            <Row className={cls.suiteContentStyle} id={this.props.suiteIdText}
                onClick={(event) => {
                    events.others.setSelectedSuites([this.props.suiteIdText]);
                }}
            >
                <Col className={cls.padding0} style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <Container className={cls.padding0} style={{paddingLeft: "0px", paddingRight: "0px"}}>
                        <Row id={`suite-header-${this.props.suiteIdText}`} className={suiteHeaderStyle}
                            onContextMenu={(event) => {
                                events.others.setSelectedSuites([this.props.suiteIdText]);
                                events.app.openContextMenu(event, "suite");
                            }}
                        >
                            <Col xs="10" className={cls.suiteNameStyle}
                                title={this.props.suite.title}>{this.props.suite.title}</Col>
                            <Col xs="2" className={cls.iconPosition} title={"Add a case"}>
                                <FontAwesomeIcon icon={faPlus} className={plusIconStyle}
                                    onClick={(event) => {
                                        //events.others.setSelectedSuites([this.props.suiteIdText]);
                                        events.fileList.clickAddTestCase(event);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row style={{marginLeft: "0px", marginRight: "0px"}}><Col><Container className={cls.testCaseContainerStyle}>
                            {this.testCaseDiv(this.props.testCase, this.props.suiteIdText, this.props.suite)}
                        </Container></Col></Row>
                    </Container>
                </Col>
            </Row>
        );
    }
}

export default TestSuite;
