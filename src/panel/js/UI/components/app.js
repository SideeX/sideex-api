import React from 'react';
import { ToolBar } from '../containers';
import cls from "./style.scss";
import WorkArea from '../containers/workArea/workArea';
import FileList from '../containers/fileList/fileList';
import { Container, Row, Col } from "reactstrap";
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFileListHide : false
        };
        this.toggleFileList = this.toggleFileList.bind(this);
        
        this.backGroundStyle = {
            backgroundColor: 'rgb(33, 54, 71)',
            margin: "0px",
            minWidth: "500px"
        };
   
    }
    toggleFileList() {
        this.setState({
            isFileListHide : !this.state.isFileListHide
        });
    }

    render() {
        return (
            <div>
                <Container style={this.backGroundStyle} fluid={true}>
                    <FileList isFileListHide={this.state.isFileListHide}
                        toggleFileList={this.toggleFileList}/>
                    <Col className={cls.rightSectionSTyle} toggleFileList={this.toggleFileList} workAreaAppend={this.state.isFileListHide}> 
                        <ToolBar />
                        <WorkArea/>
                    </Col>
                </Container>
            </div>
        );
    }
}

export default App;
