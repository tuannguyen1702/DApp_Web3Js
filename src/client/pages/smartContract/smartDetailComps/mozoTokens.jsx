import React, { Component } from "react";
import _ from "lodash";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { Pie } from "../../../components";
import { TimeLine } from "../../../components";

class MozoTokensComp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let pieData = this.props.pieData;

        const config_timeline = {
            show_middle_date : false,
            start_date: {
                date: '20180507' // YYYYMMDD
            },
            end_date: {
                date: '20180607'
            },
            middle_date: {
                date: '20180523'
            },
            current_date: {
                date: '20180514'
            }
        };

        return (
            <div>
                <div className="pie-chart__container">
                    <h3>Distribution</h3>
                    <Pie data={pieData.data} />
                    {/*<TimeLine />*/}
                    {/*<TimeLine
                        start_date={config_timeline.start_date}
                        end_date={config_timeline.end_date}
                        middle_date={config_timeline.middle_date}
                        current_date={config_timeline.current_date}
                        show_middle_date={false}
                    />

                    <TimeLine
                        start_date={config_timeline.start_date}
                        end_date={config_timeline.end_date}
                        middle_date={config_timeline.middle_date}
                        current_date={config_timeline.current_date}
                        show_middle_date={true}
                        show_cliff={true}
                    />

                    <TimeLine
                        start_date={config_timeline.start_date}
                        end_date={config_timeline.end_date}
                        middle_date={config_timeline.middle_date}
                        current_date={config_timeline.current_date}
                    />*/}
                </div>
            </div>
        )
    }
}
export default injectIntl(observer(MozoTokensComp))