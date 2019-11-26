import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { boundMethod } from "autobind-decorator";
import cx from "classnames";
import TestCase from "./testCase";
import cls from "../style.scss";
import events from "../../../events";

class TestSuite extends React.Component {
    constructor(props) {
        super(props);
        this.casesDisplay = true;
        this.state = {
            dropdownOpen: false,
            accordionOpen: true
        };
    }
    @boundMethod
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
            console.log(caseIdText);
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
            { [cls.selected]: this.props.selectedSuiteIdTexts.indexOf(this.props.suiteIdText) >= 0 },
            { [cls.modified]: this.props.suite.modified }
        );
        let plusIconStyle = cx(cls.plusIconStyle, "faIcon");
        let caretIconStyle = cx(cls.caretIconStyle, "faIcon");
        return (
            <Row className={cls.suiteContentStyle} id={this.props.suiteIdText}
                onClick={(event) => {
                    events.others.setSelectedSuites([this.props.suiteIdText]);
                }}
            >
                <Col className={cls.padding0}>
                    <Container className={cls.padding0}>
                        <Accordion>
                            <Row id={`suite-header-${this.props.suiteIdText}`} className={suiteHeaderStyle}
                                onContextMenu={(event) => {
                                    events.others.setSelectedSuites([this.props.suiteIdText]);
                                    events.app.openContextMenu(event, "suite");
                                }}
                            >

                                <Col xs="1" className={cls.iconPosition}>
                                    <Accordion.Toggle className={cls.caretButton}
                                    >

                                        <FontAwesomeIcon icon={this.state.accordionOpen ? faCaretDown : faCaretUp} className={caretIconStyle}
                                            onClick={() => this.setState({ accordionOpen: !this.state.accordionOpen })} />
                                    </Accordion.Toggle>
                                </Col>

                                <Col xs="9" className={cls.suiteNameStyle}
                                    title={this.props.suite.title}>{this.props.suite.title}
                                </Col>
                                <Col xs="2" className={cls.iconPosition} title={"Add a case"}>
                                    <FontAwesomeIcon icon={faPlus} className={plusIconStyle}
                                        onClick={(event) => {
                                            events.others.setSelectedSuites([this.props.suiteIdText]);
                                            events.fileList.clickAddTestCase(event);
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Accordion.Collapse>
                                <Row><Col><Container className={cls.testCaseContainerStyle}>
                                    {this.testCaseDiv(this.props.testCase, this.props.suiteIdText, this.props.suite)}
                                </Container></Col></Row>
                            </Accordion.Collapse>
                        </Accordion>
                    </Container>
                </Col>
            </Row>
        );
    }
}

export default TestSuite;
