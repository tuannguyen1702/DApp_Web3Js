import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import _ from 'lodash';
import {CheckboxGroup,SingleCheckBox} from "./checkBox"
import Select from "./select/Select"
import TextField from "./textField/TextField"
import RadioButton from './radioButton/RadioButton'

class FormField extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var self = this
        const { field, type = null, placeholder = null, options, option } = this.props

        var radio

        if (field.type == "checkbox") {

            //Single Check Box
            if (option) {
                return (
                    <FormGroup check>
                        <Label check>
                            <Input {...field.bind({ type }) } value={this.props.option.value} />{' '}{this.props.option.text}
                        </Label>
                        <small>
                            {field.error}
                        </small>
                    </FormGroup>
                )
            } else {

                // List Of Check Box
                return (
                    <CheckboxGroup options={this.props.options} value={field.value} name="options" onChange={self.updateArray} />
                )
            }
        } else if (field.type == "radio") {

            // List Of Radio Button 
            return (
                <RadioButton field={field} options={options} />
            )
        } else if (field.type == "select") {

            //Select
            return (
                <Select field={field} options={options}/>                
            )
        } else {

            //Basic Fields : Email, Password, text, textarea
            return (
                <TextField field={field}/>
            )
        }
    }
}
export default observer(FormField)