import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import playCaseIcon from "../../../../../icons/play_this_case.svg";
import playSuiteIcon from "../../../../../icons/play_this_suite.svg";
import playSuitesIcon from "../../../../../icons/play_all_suites.svg";
import React from "react";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";
// #!if isExt === true
import { browser } from "webextension-polyfill-ts";
// #!endif

function PlayButton({ mode, setPlay, toggleSetPlayMode, setPlayMode }) {
    const buttonStyle = cx(cls.buttonStyle, {
        [cls.disabled]: mode == "pause",
        [cls.hide]: mode == "play"
    });
    const playIcon = cx(cls.commonStyle,
        {[cls.disabled]: mode == "pause"}
    );

    const setPlayIcon = (mode) => {
        let icon;
        icon = playCaseIcon;

        return icon ? (<img className={playIcon} src={browser.runtime.getURL ?
            browser.runtime.getURL(`panel/js/UI/build/${icon}`) : icon} />) :
            (<FontAwesomeIcon className={playIcon} icon={faPlay}/>);
    };

    return (
        <div className={buttonStyle}>
            <Button className={cls.IconContainer} id="play-button"
                onClick={() => { events.toolBar.clickPlayButton("Play all suites"); }}>
                {setPlayIcon(setPlay.mode)}
                <br />
                <span className={cls.textStyle}>Play</span>
            </Button>
        </div>
    );
}

export default PlayButton;
