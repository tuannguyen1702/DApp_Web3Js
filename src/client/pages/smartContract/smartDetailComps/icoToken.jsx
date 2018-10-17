import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { Pie } from "../../../components";
import { TimeLine } from "../../../components";

class IcoTokensComp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {pieData, pieChartDescription} = this.props;



        const config_timeline = {
            show_middle_date : false,
            start_date: {
                date: moment.unix(pieData.startDate).format("YYYYMMDD")  // YYYYMMDD
            },
            end_date: {
                date: moment.unix(pieData.endDate).format("YYYYMMDD")  // YYYYMMDD
            },
            middle_date: {
                date: moment.unix(pieData.endBonusOn).format("YYYYMMDD")  // YYYYMMDD
            },
            current_date: {
                date: moment(new Date()).format("YYYYMMDD")
            }
        };

        return (
            <div>
                <div className="pie-chart__container">
                    <h3>Timeline</h3>
                    <TimeLine
                        start_date={config_timeline.start_date}
                        end_date={config_timeline.end_date}
                        middle_date={config_timeline.middle_date}
                        current_date={config_timeline.current_date}
                    />
                    <hr />
                    <h3>Distribution</h3>
                    <Pie data={pieData.data} pieChartDescription={pieChartDescription} />

                </div>
            </div>
        )
    }
}
export default injectIntl(observer(IcoTokensComp))