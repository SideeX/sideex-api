import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import PauseIcon from "../../../../../icons/pause.svg";
import PauseIconDisabled from "../../../../../icons/pause_disabled.svg";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";
import { browser } from "webextension-polyfill-ts";

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

    let icon = isDisabled ? PauseIconDisabled : PauseIcon;
    return (
        <div className={buttonStyle}>
            <Button className={cx(cls.IconContainer, cls.iconStyle)} onClick={() => { events.toolBar.clickPauseButton ();}} >
                {icon ? (<img className={pauseIcon} src={browser.runtime.getURL ?
                    browser.runtime.getURL(`panel/js/UI/build/${icon}`) : icon} />) :
                    (<FontAwesomeIcon className={pauseIcon} icon={faPause}/>)}
                <br />
                <span className={textStyle}>Pause</span>
            </Button>
        </div>
    );
}

export default PauseButton;
