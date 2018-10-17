import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

class MultiTextFieldComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    clearText(index){

        var textList = this.props.field.value
        if (textList.length > index) {
            textList.splice(index, 1);
            this.props.field.value = textList
        }

    }

    render() {
        var self = this
        const { field, className = '', hidelabel = false } = this.props

        return (
            <div>
                {field.label && !hidelabel && <Label><FormattedMessage id={field.label} /></Label>}
                {field.value.length > 0 && <FormGroup className={className}>
                <div className="label-box-container">
                {field.value.map((value, index) => {
                    return <span className="label-box form-control" key={index}>{value} <span onClick={()=>{
                        self.clearText(index)
                    }}>×</span></span>
                })}
                </div>
                </FormGroup>}
            </div>
        )
    }
}

MultiTextFieldComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(MultiTextFieldComponent))