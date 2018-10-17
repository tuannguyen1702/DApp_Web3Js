import React, { Component } from "react";
import moment from "moment";
import _ from "lodash";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TimeLine, ProgressBig } from "../../../components";

class TimelineBonusComp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let pieData = this.props.pieData;
        let soldPercent = _.round(pieData.sold * 100/ pieData.totalToken, 2);

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
                    <h3>Timeline </h3>
                    <TimeLine
                        start_date={config_timeline.start_date}
                        end_date={config_timeline.end_date}
                        middle_date={config_timeline.middle_date}
                        current_date={config_timeline.current_date}
                        show_middle_date={true}
                        show_cliff={true}
                    />
                    <hr />
                    <h3>Distribution</h3>

                    <ProgressBig color={"blue"} value={soldPercent } more_detail={`Sold ${soldPercent}%`} heading={"Timeline bonus smart contract’s distribution"} />

                </div>
            </div>
        )
    }
}
export default injectIntl(observer(TimelineBonusComp))