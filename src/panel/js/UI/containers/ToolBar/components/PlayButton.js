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
import { browser } from "webextension-polyfill-ts";

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
        switch (mode.toLowerCase()) {
            case "play this case":
                icon = playCaseIcon;
                break;
            case "play this suite":
                icon = playSuiteIcon;
                break;
            case "play all suites":
                icon = playSuitesIcon;
                break;
        }
        return icon ? (<img className={playIcon} src={browser.runtime.getURL ?
            browser.runtime.getURL(`panel/js/UI/build/${icon}`) : icon} />) :
            (<FontAwesomeIcon className={playIcon} icon={faPlay}/>);
    };

    return (
        <div className={buttonStyle}>
            <ButtonDropdown isOpen={setPlay.isOpen} toggle={toggleSetPlayMode}>
                <Button className={cls.IconContainer} id="play-button"
                    onClick={() => { events.toolBar.clickPlayButton(setPlay.mode); }}>
                    {setPlayIcon(setPlay.mode)}
                    <br />
                    <span className={cls.textStyle}>{setPlay.mode}</span>
                </Button>
                <DropdownToggle caret className={cls.selectStyle}/>
                <DropdownMenu right className={cls.padding0} style={{ minWidth: "100%" }}>
                    <DropdownItem className={cls.playDropDownItem} onClick={setPlayMode}>Play this case</DropdownItem>
                    <DropdownItem className={cls.playDropDownItem} onClick={setPlayMode}>Play this suite</DropdownItem>
                    <DropdownItem className={cls.playDropDownItem} onClick={setPlayMode}>Play all suites</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        </div>
    );
}

export default PlayButton;
