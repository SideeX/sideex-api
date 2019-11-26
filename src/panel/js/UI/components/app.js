import React from 'react';
import { ToolBar } from '../containers';
import cls from "./style.scss";
import WorkArea from '../containers/workArea/workArea';
import { Container, Row, Col } from "reactstrap";
class App extends React.Component {
    constructor(props) {
        super(props);

        this.backGroundStyle = {
            backgroundColor: 'rgb(33, 54, 71)',
            margin: "0px",
            minWidth: "500px"
        };

    }
    render() {
        return (
            <div>
                <Container style={this.backGroundStyle} fluid={true}>
                    <ToolBar />
                </Container>
            </div>
        );
    }
}

export default App;
