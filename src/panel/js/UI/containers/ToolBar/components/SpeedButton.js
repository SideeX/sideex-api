import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Slider from 'react-rangeslider';
import SpeedIcon from "../../../../../icons/speed.svg";
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
        let rotate = `rotate(${(speed - 1) * 72 - 94}deg)`;
        return (<img className={cls.commonStyle} style={{ transform: rotate }}
            src={browser.runtime.getURL ?
                browser.runtime.getURL(`panel/js/UI/build/${SpeedIcon}`) : SpeedIcon}/>);
    };

    return (
        <Dropdown className={cls.dropdownStyle} isOpen={isShow} toggle={() => { toggle(!isShow); }}>
            <DropdownToggle className={cls.IconContainer}>
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
