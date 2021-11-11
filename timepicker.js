// this is for time picker for goal input form
const TimePicker = tui.TimePicker;

var tpSpinbox = new tui.TimePicker('#timepicker-selectbox', {
    initialHour: 0,
    initialMinute: 15,
    inputType: 'selectbox',
    showMeridiem: false
});