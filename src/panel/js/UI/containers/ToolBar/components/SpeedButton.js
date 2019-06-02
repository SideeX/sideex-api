import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Slider from 'react-rangeslider';
import SpeedIcon1 from "../../../../../icons/speed1.svg";
import SpeedIcon2 from "../../../../../icons/speed2.svg";
import SpeedIcon3 from "../../../../../icons/speed3.svg";
import SpeedIcon4 from "../../../../../icons/speed4.svg";
import SpeedIcon5 from "../../../../../icons/speed5.svg";
import { connect } from "react-redux";
import events from "../../../events";
import cls from "../style.scss";
import cx from "classnames";
import { browser } from "webextension-polyfill-ts";

function mapStateToProps({toolBar: {speed}}, props) {
    const { value, isShow } = speed;
    return { value, isShow };
}

function mapDispatchToProps() {
    return {
        toggle: (bool) => EntryPoint.toolBar.setShowSpeedSelect(bool),
        setSpeed: (value) => events.toolBar.changeSpeed(value)
    };
}

function SpeedButton({
    value,
    isShow,
    toggle,
    setSpeed
}) {
    const horizontalLabels = {
        1: 'slow',
        2: '·',
        3: '·',
        4: '·',
        5: 'fast'
    };

    const setSpeedIcon = (speed) => {
        let speedIcons = [SpeedIcon1, SpeedIcon2, SpeedIcon3, SpeedIcon4, SpeedIcon5];
        return (<img className={cls.commonStyle}
            src={browser.runtime.getURL ?
                browser.runtime.getURL(`panel/js/UI/build/${speedIcons[speed - 1]}`) : speedIcons[speed - 1]}/>);
    };

    return (
        <Dropdown className={cls.dropdownStyle} isOpen={isShow} toggle={() => { toggle(!isShow); }}>
            <DropdownToggle className={cx(cls.IconContainer, cls.iconStyle)}>
                {setSpeedIcon(value)}
                <br />
                <span className={cls.textStyle}>Speed</span>
            </DropdownToggle>
            <DropdownMenu>
                <div style={{ margin: "auto", textAlign: "center" }}>
                    <Slider min={1} max={5} step={1} value={value}
                        labels={horizontalLabels} format={(value) => { return `x${value}`; }}
                        onChange={(value)=>setSpeed(value)}
                        // handleLabel={`x${value}`} tooltip={false}
                        className={cls.speedSlide}
                    />
                </div>
            </DropdownMenu>
        </Dropdown>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SpeedButton);
