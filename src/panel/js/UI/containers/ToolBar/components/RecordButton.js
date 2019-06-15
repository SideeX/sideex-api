import React from "react";
import { Button} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";

function RecordButton({ mode }) {
    const buttonStyle = cx(cls.buttonStyle, {
        [cls.disabled]: mode == "play" || mode == "pause",
        [cls.hide]: mode == "record"
    });
    const recordIcon = cx(cls.commonStyle, cls.redColor, cls.recordIcon,
        {[cls.disabled]: mode == "play" || mode == "pause"}
    );

    return (
        <div className={buttonStyle}>
            <Button className={cls.IconContainer} onClick={() => { events.toolBar.clickRecordButton(); }} >
                <FontAwesomeIcon icon={faCircle} className={recordIcon} />
                <br />
                <span className={cls.textStyle}>Record</span>
            </Button>
        </div>
    );
}

export default RecordButton;
