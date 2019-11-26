import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import cls from "../style.scss";

class SnapshotModal extends React.Component {
    constructor(props) {
        super(props);
    }

    createSnapshot(type, url) {
        let style = { width:"100%", height: "100%" };
        if (url === "") return (<span>{`There is no ${type}`}</span>);

        switch (type) {
            case "video": {
                return (<video controls={true} style={style} src={url}/>);
            }
            case "image": {
                return (<img style={style} src={url}/>);
            }
            default: {
                return;
            }
        }
    }

    openInNewTab(event, type, url) {
        if (url == undefined) { return; }

        let element = type == "image" ? `<img width="100%" src=${url}></img>`
            : `<video controls width="100%" src=${url}></video>`;
        let newTab = window.open();
        newTab.document.open();
        newTab.document.write(element);
        newTab.document.close();
    }

    render() {
        let data = this.props.workArea.snapshotModal;
        let fileName = data.type === "video" ? "snapshot.webm" : "snapshot.jpeg";
        let subtitle = data.type === "video" ? data.subtitle : `(before executing the ${data.subtitle} command)`;
        return (
            <div>
                <Modal className= {cls.snapshotModal} size="lg" isOpen={data.isOpen} toggle={this.props.toggleSnapshotModal}>
                    <ModalHeader toggle={this.props.toggleSnapshotModal}>
                        <span>{data.title}</span>
                        <span className={cls.snapshotSubtitle}>{subtitle}</span>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{width: "100%", height:"100%"}} propsid="snapshot-box"
                            onClick={ () => this.openInNewTab(data.type, data.url )}>
                            {this.createSnapshot(data.type, data.url)}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div id="modal-title">
                            {data.url === "" ? "" :
                                (<a id="download-snapshot" href={data.url} download={fileName}>
                                    <FontAwesomeIcon icon={faDownload} style={{ color:"gray" }}/>
                                    <span>{" download "}</span>
                                </a>)
                            }
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default SnapshotModal;
