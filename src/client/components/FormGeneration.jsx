import React from "react"
import { observer } from "mobx-react"
import FormField from "./FormField"
import _ from "lodash"
import { FormGroup } from "reactstrap"

class FormGeneration extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var self = this
        const { form, model } = this.props

        var models = []

        _.forEach(model, function (value, key) {
            models.push(key)
        })

        return (
            <div>
                {models.map((item, index) => (
                    <FormField key={index} field={form.$(item)} options={form.$(item).options.options?form.$(item).options.options:null} option={form.$(item).options.option?form.$(item).options.option:null} />
                ))}

            </div>
        )
    }
}
export default observer(FormGeneration)