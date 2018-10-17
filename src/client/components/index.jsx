import TableComponent from './table/Table'
import TextField from './textField/TextField'
import MultiTextField from './textField/MultiTextField'
import DatePickerComponent from './datePicker/DatePicker'
import SelectComponent from './select/Select'
import UploadImageComponent from './uploadFile/UploadImage'
import FlipClockComponent from './flipClock/FlipClock'
import { CheckboxGroup, SingleCheckBox} from "./checkBox"
import { FormatNumberComponent } from "./format"
import RadioButton from "./radioButton/RadioButton"
import WalletOption from "./walletOption/WalletOption"
import ProgressComponent from './progress/Progress'
import PieChart from './chartComponent/Pie'
import TimeLineChart from './chartComponent/Timeline'
import ProgressBigComponent from "./progress/ProgressBig"
import Countdown from "./countDownSimple"
import CollapseGroup from "./collapseGroup/CollapseGroup"
import Icon from "./icons"
import Pagination from "./pagination/Pagination"
import ProgressBarCrowdsale from './progressBarCrowdSale'

var Components = {
    Table: TableComponent,
    TextField: TextField,
    MultiTextField: MultiTextField,
    DatePicker: DatePickerComponent,
    Select: SelectComponent,
    UploadImage: UploadImageComponent,
    FlipClock: FlipClockComponent,
    Checkbox: SingleCheckBox,
    CheckboxList: CheckboxGroup,
    RadioButton: RadioButton,
    WalletOption: WalletOption,
    Progress: ProgressComponent,
    Pie: PieChart,
    TimeLine: TimeLineChart,
    ProgressBig: ProgressBigComponent,
    Pagination: Pagination,
    CountDown: Countdown,
    CollapseGroup: CollapseGroup,
    Icon: Icon,
    ProgressCrowdsale: ProgressBarCrowdsale
}

module.exports = Components;
