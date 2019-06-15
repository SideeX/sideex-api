import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";

function PauseButton({ mode }) {
    let isDisabled = mode == "default" || mode == "record";
    const buttonStyle = cx(cls.buttonStyle, {
        [cls.disabled]: isDisabled,
        [cls.hide]: mode == "pause"
    });
    const pauseIcon = cx(cls.commonStyle,
        {[cls.disabled]: isDisabled}
    );
    const textStyle = cx(cls.textStyle,
        {[cls.disabled]: isDisabled}
    );

    return (
        <div className={buttonStyle}>
            <Button className={cls.IconContainer} onClick={() => { events.toolBar.clickPauseButton ();}} >
                <FontAwesomeIcon className={pauseIcon} icon={faPause} />
                <br />
                <span className={textStyle}>Pause</span>
            </Button>
        </div>
    );
}

export default PauseButton;
