import React from "react";
import { Button} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";

function StopButton({ mode }) {
    const buttonStyle = cx(cls.buttonStyle, {
        [cls.hide]: mode != "play"
    });

    return (

        <div className={buttonStyle}>
            <Button className={cls.IconContainer} onClick={() => { events.toolBar.clickStopButton(); }} >
                <FontAwesomeIcon className={cls.commonStyle} icon={faStop}/>
                <br />
                <span className={cls.textStyle}>Stop</span>
            </Button>
        </div>
    );
}

export default StopButton;
