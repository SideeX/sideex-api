import React from "react";
import { Row, Col, Button } from "reactstrap";
import { boundMethod } from "autobind-decorator";
import cx from "classnames";
import cls from "../style.scss";
import events from "../../../events";

class TestCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false
        };
    }
    @boundMethod
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        // let caseStyle = cx(cls.caseStyle, { [cls.modified]: this.props.caseEle.modified });
        let caseStyle = cx(cls.caseStyle);
        let caseNameStyle = cx(cls.caseNameStyle,
            { [cls.success]: this.props.caseEle.status === "success" },
            { [cls.fail]: this.props.caseEle.status === "fail" },
            { [cls.selected]: this.props.selectedCaseIdTexts.indexOf(this.props.caseIdText) >= 0 }
        );

        return (
            <Row className={cls.margin0}>
                <Col id={this.props.caseIdText} key={`li-${this.props.caseIdText}`}
                    className={caseStyle} title={this.props.caseEle.title}
                    onContextMenu={(event) => {
                        events.others.setSelectedCases([this.props.suiteIdText], [this.props.caseIdText]);
                        events.app.openContextMenu(event, "case");
                    }}
                    onClick={(event) => {
                        events.others.setSelectedCases([this.props.suiteIdText], [this.props.caseIdText]);
                    }}
                >
                    <span id={`link-${this.props.caseIdText}`} className={caseNameStyle}>
                        {this.props.caseEle.title}
                    </span>
                </Col>
            </Row>
        );
    }
}

export default TestCase;
