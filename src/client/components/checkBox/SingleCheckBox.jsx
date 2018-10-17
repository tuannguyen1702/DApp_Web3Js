import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

class SingleCheckBox extends React.Component {
    constructor(props) {
        super(props)
    }

    onChange(e) {
        this.props.field.value = e.target.checked

        if(typeof this.props.onChange == 'function'){
            this.props.onChange(e.target.checked)
        }
    }

    render() {
        var self = this
        const { field, type = null, value = null, placeholder = null, className = '' } = this.props

        return (
            <div className={className}>
                <FormGroup check>
                    <Label check className="single-check">
                        <Input {...field.bind({ type }) } id={field.name} onChange={(e) => self.onChange(e)}/>{' '}<label htmlFor={field.name}><FormattedMessage id={field.label} /></label>
                    </Label>
                    <small className="error">
                        {field.error && <FormattedMessage id={field.error} />}
                    </small>
                </FormGroup>
            </div>
        )
    }
}
export default injectIntl(observer(SingleCheckBox))