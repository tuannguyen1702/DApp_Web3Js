import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Progress } from 'reactstrap';

const Label = (props) => {
    return (
        <div className="pie__label">
            <span className={"square label-note-" + (props.index + 1)}></span>
            <span className="text"><FormattedMessage id={props.label} values={{
                value: <FormattedNumber
                    value={props.value}
                    style='decimal'
                    minimumFractionDigits={0}
                    maximumFractionDigits={2}
                />
            }} /></span>
        </div>
    );
};

class DashboardChart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var self = this

        const { dashboardData } = self.props

        const contentTop = []
        const progressBar = []
        const notes = []
        const total = dashboardData.total


        const rederChart = () => {

            var soldPercent  = parseInt((total - dashboardData.leftTokens) / total * 100) 
            soldPercent = soldPercent < 30 ? 30 : soldPercent

            dashboardData.data.map((value, index) => {
                if (index != 0) {
                    progressBar.push(<Progress key={index} bar className={"progress-bar-" + (index + 1)} value={value.percent < 10 ? 10 : value.percent}> <FormattedNumber
                        value={value.value}
                        style='decimal'
                        minimumFractionDigits={0}
                        maximumFractionDigits={2}
                    />{value.unitText}</Progress>)
                } else {
                    contentTop.push(<div className="sold-block"> 
                     <h5><FormattedMessage id="Number Token Sold" /> </h5>   
                    <h4 className="primary-text"><FormattedNumber
                            value={value.value}
                            style='decimal'
                            minimumFractionDigits={0}
                            maximumFractionDigits={2}
                        /> <small><FormattedMessage id="Number Mozo Tokens Sold" /></small></h4> 
                    <div style={{width: soldPercent + "%" }} className="sold-line"></div>
                    </div>)
                }

                notes.push(<Label key={index} index={index} value={value.value} label={value.label} />)
            })
        }

        rederChart()

        return (
            <div>
                {contentTop}
                <Progress className="progress-custom" multi>
                    {progressBar}
                </Progress>
                <div className="mt-sm primary-text text-right"><h5><FormattedMessage id="Total Tokens" values={{
                        value: <FormattedNumber
                            value={total}
                            style='decimal'
                            minimumFractionDigits={0}
                            maximumFractionDigits={2}
                        />
                    }} /></h5></div>
                <div className="pie__labels">
                    {notes}
                </div>
            </div>
        )
    }
}
export default injectIntl(observer(DashboardChart))