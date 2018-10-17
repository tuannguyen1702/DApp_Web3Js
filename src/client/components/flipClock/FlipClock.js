import React from "react"
import FlipUnitContainer from "./FlipUnitContainer"
import DateBetween from './DataBetween'

class FlipClockComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			weeks: 0,
			weeksShuffle: true,
			days: 0,
			daysShuffle: true,
			hours: 0,
			hoursShuffle: true,
			minutes: 0,
			minutesShuffle: true,
			seconds: 0,
			secondsShuffle: true
		};
	}
	componentDidMount() {
		this.timerID = setInterval(
			() => this.updateTime(),
			50
		);
	}
	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	updateTime() {
		var self = this
		// get new date
		let time = new Date();	
		let endDate = new Date(self.props.endDate || "03/15/2018 00:00 AM")

		if(time.toLocaleString() == endDate.toLocaleString() && typeof self.props.endCountDownHandle == 'function') {
			clearInterval(self.timerID);
			
			return self.props.endCountDownHandle()
		}
		let remaining = DateBetween(time, endDate)


		// set time units
		// const hours = time.getHours();
		// const minutes = time.getMinutes();
		// const seconds = time.getSeconds();

		let weeks = remaining[0]
		let days = remaining[1]
		let hours = remaining[2]
		let minutes = remaining[3]
		let seconds = remaining[4]

		//on week change, update weeks and shuffle state
		if (weeks !== this.state.weeks) {
			const weeksShuffle = !this.state.weeksShuffle;
			this.setState({
				weeks,
				weeksShuffle
			});
		}

		//on day change, update days and shuffle state
		if (days !== this.state.days) {
			const daysShuffle = !this.state.daysShuffle;
			this.setState({
				days,
				daysShuffle
			});
		}

		// on hour change, update hours and shuffle state
		if (hours !== this.state.hours) {
			const hoursShuffle = !this.state.hoursShuffle;
			this.setState({
				hours,
				hoursShuffle
			});
		}
		// on minute change, update minutes and shuffle state
		if (minutes !== this.state.minutes) {
			const minutesShuffle = !this.state.minutesShuffle;
			this.setState({
				minutes,
				minutesShuffle
			});
		}
		// on second change, update seconds and shuffle state
		if (seconds !== this.state.seconds) {
			const secondsShuffle = !this.state.secondsShuffle;
			this.setState({
				seconds,
				secondsShuffle
			});
		}
	}
	render() {
		const { hours, minutes, seconds, hoursShuffle, minutesShuffle, secondsShuffle, weeks, weeksShuffle, days, daysShuffle } = this.state;
		const { className } = this.props
		return (
			<div className={'flipClock ' + className}>

				<FlipUnitContainer
					label={'Weeks'}
					unit={'weeks'}
					digit={weeks}
					shuffle={weeksShuffle}
				/>

				<FlipUnitContainer
					label={'Days'}
					unit={'days'}
					digit={days}
					shuffle={daysShuffle}
				/>

				<FlipUnitContainer
					label={'Hours'}
					unit={'hours'}
					digit={hours}
					shuffle={hoursShuffle}
				/>
				<FlipUnitContainer
					label={'Minutes'}
					unit={'minutes'}
					digit={minutes}
					shuffle={minutesShuffle}
				/>
				<FlipUnitContainer
					label={'Seconds'}
					unit={'seconds'}
					digit={seconds}
					shuffle={secondsShuffle}
				/>
			</div>
		);
	}
}
export default (FlipClockComponent);