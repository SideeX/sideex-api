import React from "react";
import { Button} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";

function SaveFileButton({ mode }) {
    const buttonStyle = cx(cls.buttonStyle, {
        [cls.diabled]: mode == "play" || mode == "pause"
    });
    const recordIcon = cx(cls.commonStyle, cls.redColor, cls.recordIcon,
        {[cls.disabled]: mode == "play" || mode == "pause"}
    );

    return (
        
        <div className={buttonStyle}>
            <Button className={cls.IconContainer} onClick={() => { events.fileList.clickSaveTestSuite(); }} >
            <FontAwesomeIcon className={recordIcon} icon={faStop}/>
                <br />
                <span className={cls.textStyle}>Save</span>
            </Button>
        </div>
    );
}

export default SaveFileButton;
