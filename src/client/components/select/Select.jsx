import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

class SelectComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        const { field, className = "", type = null, placeholder = null, options = [], readonly = false } = this.props

        var listData =  options.length > 0 ? options : field.options.options

        return (
            <FormGroup>
                <Label>{field.label && <FormattedMessage id={field.label} />}</Label>
                <div className={"form-select " + className} >
                    <span className="icon"></span>
                    <Input {...field.bind({ type, placeholder }) } >
                        {
                            listData.map((item, index) => (
                                <option value={item.value} key={index}>{(item.text == "" || options.length > 0)? item.text: <FormattedMessage id={item.text} />}</option>
                            ))
                        }
                    </Input>
                    <small className="error">
                        {field.error && <FormattedMessage id={field.error} />}
                    </small>
                </div>
            </FormGroup>
        )
    }
}
export default injectIntl(observer(SelectComponent))