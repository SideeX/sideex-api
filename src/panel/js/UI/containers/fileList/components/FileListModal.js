import React from "react";
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import events from "../../../events";
import { fileList } from "../../../entryPoint";

const render = (modal) => {
    function toggle() {
        fileList.setModal({ isOpen: false, type: "default" });
    }

    function createModalBody(data) {
        return (<ModalBody>
            <div style={{ width: "100%", height:"100%", margin: "0 0 10px 0" }}>{data.content}</div>
            {!data.input.used ? "" :
                <Input id="file-list-modal-input" type="text" value={data.input.value}
                    onChange={(event) => {
                        fileList.setModal({ error: "", params: { title: event.target.value } });
                    }}/>}
            <div style={{ width: "100%", height:"100%", color: "rgb(255, 22, 53)", margin: "10px 0 0 10px" }}>{data.error}</div>
        </ModalBody>);
    }

    let data = {};
    switch (modal.type) {
        case "add suite": {
            let clickHandler = (event) => {
                events.fileList.clickAddTestSuiteModalEnter(event,
                    document.querySelector("#file-list-modal-input").value
                );
            };
            data = {
                title: "Add A New Test Suite",
                content: "Please enter the Test Suite's name",
                error: modal.error ? modal.error : "",
                input: { used: true, value: modal.params.title },
                button: { value: "Add", handler: clickHandler }
            };
            break;
        }
        case "add case": {
            let clickHandler = (event) => {
                events.fileList.clickAddTestCaseModalEnter(event,
                    document.querySelector("#file-list-modal-input").value
                );
            };
            data = {
                title: "Add A New Test Case",
                content: "Please enter the Test Case's name",
                error: modal.error ? modal.error : "",
                input: { used: true, value: modal.params.title },
                button: { value: "Add", handler: clickHandler }
            };
            break;
        }
        case "rename suite": {
            let clickHandler = (event) => {
                events.fileList.clickRenameTestSuiteModalEnter(event,
                    document.querySelector("#file-list-modal-input").value
                );
            };
            data = {
                title: "Rename Test Suite",
                content: "Please enter the Test Suite's name",
                error: modal.error ? modal.error : "",
                input: { used: true, value: modal.params.title },
                button: { value: "Rename", handler: clickHandler }
            };
            break;
        }
        case "rename case": {
            let clickHandler = (event) => {
                events.fileList.clickRenameTestCaseModalEnter(event,
                    document.querySelector("#file-list-modal-input").value
                );
            };
            data = {
                title: "Rename Test Case",
                content: "Please enter the Test Case's name",
                error: modal.error ? modal.error : "",
                input: { used: true, value: modal.params.title },
                button: { value: "Rename", handler: clickHandler }
            };
            break;
        }
        case "close suite": {
            data = {
                title: "Close Test Suite",
                content: `Are you sure to close the suite ${modal.params.title}?`,
                error: modal.error ? modal.error : "",
                input: { used: false, value: "" },
                button: { value: "Confirm", handler: events.fileList.clickCloseTestSuiteEnter }
            };
            break;
        }
        case "close suites": {
            data = {
                title: "Close All Test Suites",
                content: `Are you sure to close suites ${modal.params.title}?`,
                error: modal.error ? modal.error : "",
                input: { used: false, value: "" },
                button: { value: "Confirm", handler: events.fileList.clickCloseAllTestSuitesEnter }
            };
            break;
        }
        case "delete case": {
            data = {
                title: "Delete Test Case",
                content: `Are you sure to delete the case "${modal.params.title}"? After the deletion, remember to save the test suite for this change`,
                error: modal.error ? modal.error : "",
                input: { used: false, value: "" },
                button: { value: "Confirm", handler: events.fileList.clickRemoveTestCaseEnter }
            };
            break;
        }
        case "default": {
            data = {
                title: "",
                content: "",
                error: modal.error ? modal.error : "",
                input: { used: false, value: "" },
                button: { value: "", handler: toggle }
            };
            break;
        }
    }

    return (
        <Modal isOpen={modal.isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}><span>{data.title}</span></ModalHeader>
            {createModalBody(data)}
            <ModalFooter style={{ paddingTop: "0", border: "0" }}>
                <Button color="primary" onClick={data.button.handler}>{data.button.value}</Button>
            </ModalFooter>
        </Modal>
    );
};

const FileListModal = ({ modal }) => {
    return render(modal);
};

export default FileListModal;


