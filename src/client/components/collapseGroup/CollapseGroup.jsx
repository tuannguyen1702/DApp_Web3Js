import React from 'react';
import { FormGroup, Col, Row, Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

class CollapseGroup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            collapseShow: this.props.collapseShow != undefined ? this.props.collapseShow: true
        }
    }

    translate(intl, idM) {
        var message = idM 
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    componentDidMount() {
        // const { collapseShow = null } = this.props
        // if(collapseShow != null){
        //     this.setState({ collapseShow: collapseShow })
        // }
    }

    render() {
        const { collapseShow } = this.state
        const { children, title, className = "", parentClass = "" } = this.props
        return (
            <FormGroup className = {parentClass}>
                <ListGroup>
                    <ListGroupItem className={"list-group-title " + className + " " + (collapseShow ? "collapse-show" : "")} active tag="div" onClick={() => {
                        this.setState({ collapseShow: !collapseShow })
                    }} action>{title}</ListGroupItem>
                    <Collapse className="normal-collapse list-group-item" isOpen={collapseShow}>
                        <div>
                            {children}
                        </div>
                    </Collapse>
                </ListGroup>
            </FormGroup>
        )
    }
}
CollapseGroup.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(CollapseGroup))