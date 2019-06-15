import React from "react";
import { Button} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";

function ResumeButton({ mode }) {
    const buttonStyle = cx(cls.buttonStyle, {
        [cls.hide]: mode != "pause"
    });

    return (
        
        <div className={buttonStyle}>
            <Button className={cls.IconContainer} onClick={() => { events.toolBar.clickResumeButton(); }} >
                <FontAwesomeIcon className={cls.commonStyle} icon={faUndoAlt}/>
                <br />
                <span className={cls.textStyle}>Resume</span>
            </Button>
        </div>
    );
}

export default ResumeButton;
