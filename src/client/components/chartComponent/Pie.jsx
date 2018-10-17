import React, { Component } from 'react';
import _ from 'lodash'
import { Doughnut } from 'react-chartjs-2';
import { observer } from 'mobx-react';
import { injectIntl, intlShape } from 'react-intl';
import { Button } from 'reactstrap';


const Label = (props) => {
    return (
        <div className="pie__label">
            <span className="square" style={{color: props.color, backgroundColor: props.color}}>{props.color}</span>
            <span className="number">{(props.percent || 0) + "%"}</span>
            <span className="text">{props.label}</span>
        </div>
    );
};

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widthChart: 290,
            heightChart: 290,
            data: [],
        }
    }

    render() {

        var {pieChartDescription, data} = this.props

        const options = {
            responsive: true,
            cutoutPercentage: 58,
            legend: {
                display: false,
            },
        };

        const data_labels = [], data_percent = [], data_bgColor = [];
        _.each(this.props.data, function(item) {
            data_labels.push(item['label']);
            data_percent.push(item['percent']);
            data_bgColor.push(item['color']);
        });

        let dataDoughnut = {
            datasets: [{
                data: data_percent,
                backgroundColor: data_bgColor,
                borderWidth: 0
            }],
            labels: data_labels
        };

        
        
        return (
            <div className="pie">
                <div className="pie__labels">
                    { data.map((item, index) => {
                        return (
                            <Label key={index} color={item.color} percent={item.percent} label={item.label} />
                        )})
                    }
                </div>
                <div className="pie__container">
                    <Doughnut data={dataDoughnut} width={this.state.widthChart} height={this.state.heightChart} options={options}/>
                    <div className="pie__figure">{pieChartDescription}</div>
                </div>
            </div>
        );
    }
}
export default injectIntl(observer(PieChart));