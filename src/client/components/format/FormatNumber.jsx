import React, { Component } from 'react'
import { FormattedNumber } from 'react-intl'

export default class FormatNumber extends Component {
    constructor(props) {
        super(props)
    }

    numberWithCommas(x) {
        var {toFixed = 2} = this.props
        var parts = x.toString().split(".");
        if(toFixed > 0){
            if(parts[1] == undefined){
                parts[1] = "00"
            }
            else {
                if(parts[1].length == 1)
                {
                    parts[1] += "0"
                }
            }
        }
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(".");
    }

    convertToNumber(text, toFixed) {
        var number = parseFloat(text.toString().replace(/[^\d\.]/, '')).toFixed(toFixed)
        return this.numberWithCommas(number)
    }

    render() {
        var self = this
        var { value, beforeText="", afterText="", toFixed = 2 } = self.props

        return (
            value && <span>{beforeText + self.convertToNumber(value, toFixed) + afterText}</span>
        )
    }
}