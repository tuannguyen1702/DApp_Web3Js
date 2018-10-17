import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';

class RadioButton extends React.Component {
    constructor(props) {
        super(props)
    }

    onChange(event, item) {
       
        if (event.target.checked) {
            this.props.field.value = item

            if(typeof this.props.onChange == 'function'){
                this.props.onChange(item)
            }
        } 

    }


    render() {
        var self = this
        const { field, type = null, placeholder = null, className = '', hidelabel = false} = this.props

        return (
            <FormGroup className={className}>
                {field.label && !hidelabel && <Label><FormattedMessage id={field.label} /></Label>}
                {this.props.options.map((item, index) => {
                    return (
                        <FormGroup check key={index}>
                            <Label check>
                                <Input {...field.bind({ type }) } id={field.name + index} value={item.value} checked={item.value == field.value} onChange={(e) => self.onChange(e, item.value)} />{' '}
                                <label htmlFor={field.name + index}><span> {item.text} </span></label>
                            </Label>
                            <small>
                                {field.error}
                            </small>
                        </FormGroup>
                    )
                })}

            </FormGroup>
        )
    }
}
export default injectIntl(observer(RadioButton))