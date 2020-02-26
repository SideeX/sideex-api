import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import {
    RecordButton,
    PlayButton,
    PauseButton,
    StopButton,
    ResumeButton,
    StopRecordButton,
    SpeedButton,
    SaveFileButton,
} from './components'
import cls from "./style.scss";
import events from "../../events";

function mapStateToProps({toolBar}) {
    return { toolBar };
}

const mapDispatchToProps = dispatch => {
    return {
        setToolBar: (mode) => {
            mode = mode.toUpperCase();
            store.dispatch({
                type: mode
            });
        }
    };
};

class ToolBar extends React.Component {
    state = {
        mode: "default",
        setPlay: {
            isOpen: false,
            mode: "Play this case"
        }
    };

    toggleSetPlayMode = () => {
        this.setState( {
            mode: this.state.mode,
            setPlay: {
                isOpen: !this.state.setPlay.isOpen,
                mode  : this.state.setPlay.mode
            }
        });
    }

    setPlayMode = (event) => {
        this.state.setPlay.mode = event.target.textContent;
    }

    setMode = (state, toolBar) => {
        if (!toolBar.isRecord && !toolBar.isPlay && !toolBar.isPause) {
            state.mode = "default";
        } else if (toolBar.isRecord && !toolBar.isPlay && !toolBar.isPause) {
            state.mode = "record";
        } else if (!toolBar.isRecord && toolBar.isPlay && !toolBar.isPause) {
            state.mode = "play";
        } else if (!toolBar.isRecord && !toolBar.isPlay && toolBar.isPause) {
            state.mode = "pause";
        } else {
            state.mode = "error";
        }
    }

    render() {
        this.setMode(this.state, this.props.toolBar);
        return (
            <Row className={cls.rowStyle}>
                <Col xs="3" className={cls.buttonCol}>
                    <RecordButton mode={this.state.mode} />
                    <StopRecordButton mode={this.state.mode} />
                </Col>
                <Col xs="3" className={cls.buttonCol}>
                    <PlayButton mode={this.state.mode} setPlay={this.state.setPlay}
                        toggleSetPlayMode={this.toggleSetPlayMode}
                        setPlayMode={this.setPlayMode} />
                    <StopButton mode={this.state.mode} />
                </Col>
                {/* <Col xs="2" className={cls.buttonCol}>
                    <PauseButton mode={this.state.mode} />
                    <ResumeButton mode={this.state.mode} />
                </Col> */}
                {/* <Col xs="2" className={cls.buttonCol}>
                    <SpeedButton />
                </Col> */}
                <Col xs="3" className={cls.buttonCol}>
                    <SaveFileButton />
                </Col>
            </Row>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);
