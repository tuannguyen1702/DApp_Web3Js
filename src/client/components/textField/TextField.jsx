import React from 'react';
import { Label, InputGroup, InputGroupAddon, InputGroupText, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format'

class TextFieldComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    onBlur(e) {
        const { onBlur } = this.props
        if (typeof onBlur == 'function') {
            onBlur(e)
        }
    }

    onKeyPress(e) {
        const { onKeyPress } = this.props
        if (typeof onKeyPress == 'function') {
            onKeyPress(e)
        }
    }

    render() {
        var self = this
        const { field, className = '', prepend = null, append = null, type = null, placeholder = null, hidelabel = false, disabled = false, readOnly = false, ref = null, autoFocus = false, thousandSeparator = false } = this.props

        return (
            <FormGroup>
                {field.label && !hidelabel && <Label><FormattedMessage id={field.label} /></Label>}
                <div className={className}>
                    <span className="icon"></span>
                    <div className={prepend != null || append != null ? "input-group" :""}>
                        {prepend && <InputGroupAddon addonType="prepend"><InputGroupText>{prepend}</InputGroupText></InputGroupAddon>}
                         <Input style={thousandSeparator? {display: "none"}: {}} {...field.bind({ type })}
                              onKeyPress={this.onKeyPress.bind(this)}
                              ref={ref}
                              onBlur={this.onBlur.bind(this)}
                              autoFocus={autoFocus}
                              disabled={disabled}
                              readOnly = {readOnly}
                              placeholder={this.translate(this.props.intl, field.placeholder)}
                          >
                          </Input>
                          {thousandSeparator && <NumberFormat 
                            className="form-control"
                            value = {field.value}
                            disabled={disabled}
                            readOnly = {readOnly}
                            placeholder={this.translate(this.props.intl, field.placeholder)} thousandSeparator={true}
                            onValueChange={(values) => {
                                const {formattedValue, value} = values;
                                field.value = value
                            }}/>}
                        {append && <InputGroupAddon addonType="append"><InputGroupText>{append}</InputGroupText></InputGroupAddon>}
                    </div>
                    <small className="error">
                       
                        {field.options.min ? (field.error && <FormattedMessage id="Value must be at least" values={{value: field.options.min}} />): (field.error && <FormattedMessage id={field.error} />) }
                    </small>
                </div>
            </FormGroup>
        )
    }
}
TextFieldComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(TextFieldComponent))