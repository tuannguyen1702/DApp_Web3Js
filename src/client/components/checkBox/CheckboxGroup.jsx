import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react';
import { Label, Input, FormGroup } from 'reactstrap';

class CheckboxGroup extends Component {
    constructor(props) {
        super(props)
    }

    onChange(event, item) {
        // console.log(item)
        // this.props.onChange(item, event.target.checked)
        if (event.target.checked) {
            this.props.value.push(item)
        } else {
            var a = this.props.value.indexOf(item)
            if (a) {
                this.props.value.splice(a, 1)
            }
        }

    }

    render() {
        var self = this
        const { options, className } = this.props

        return (
            <FormGroup tag="fieldset" className={className}>

                {this.props.options.map((item, index) => {
                    return (
                        <FormGroup check key={index}>
                            <Label check>
                                <Input id={self.props.name + index} type="checkbox" onChange={(e) => self.onChange(e, item.value)} />{' '}<label htmlFor={self.props.name + index}> <span>{item.text} </span></label>
                            </Label>
                        </FormGroup>
                    )
                })}
            </FormGroup>
        )
    }
}
export default observer(CheckboxGroup)