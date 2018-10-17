import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import DatePicker from 'react-datepicker';
import moment from 'moment';


class DatePickerComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    handleChange(date) {
        this.props.field.value = date
    }

    render() {

        const { field, type = null, placeholder = null, className = "" } = this.props

        return (
            <FormGroup>
                <Label>{field.label && <FormattedMessage id={field.label} />}</Label>
                <div className={className}>
                    <DatePicker className={"form-control " + className}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        selected={field.value == "" ? null : field.value}
                        //dateFormat={field.placeholder}
                        dateFormat="MM/DD/YYYY HH:mm" 
                        onChange={this.handleChange.bind(this)}
                        //placeholderText={field.placeholder} 
                        placeholderText="MM/DD/YYYY HH:mm" 
                        />
                    <small className="error">
                        {field.error && <FormattedMessage id={field.error} />}
                    </small>
                </div>
            </FormGroup>
        )
    }
}
DatePickerComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(DatePickerComponent))