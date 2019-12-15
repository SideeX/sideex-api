import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { connect } from "react-redux";
import cls from "./style.scss";
import contextMenuItems from "./contextMenuItems";
import { app } from "../../entryPoint";

class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    toggle() { app.setContextMenu({ isOpen: false }); }

    createDropdownItems(type) {
        let dropDownItems = contextMenuItems[type].map((item, i) => {
            return (<DropdownItem key={i} onClick={item.onClick} className={cls.contextMenuItem}>
                <span>{item.title}</span>
                <span className={cls.shortCut}>{item.shortCut}</span>
            </DropdownItem>);
        });
        return dropDownItems;
    }

    render() {
        let contextMenu = this.props.contextMenu;
        return (
            <Dropdown id="file-list-context-menu" isOpen={contextMenu.isOpen} toggle={this.toggle}>
                <DropdownToggle className={cls.dropdownToggle}
                    style={{ top : `${contextMenu.clientY}px`, left: `${contextMenu.clientX}px` }} />
                <DropdownMenu className={cls.contextMenu}>
                    {this.createDropdownItems(contextMenu.type)}
                </DropdownMenu>
            </Dropdown>
        );
    }
}

const mapStateToProps = state => {
    return {
        contextMenu: state.app.contextMenu
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);

