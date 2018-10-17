let DateBetween = function(startDate, endDate) {
    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day*7;
    let distance = endDate - startDate;
  
    if (distance < 0) {
      return false;
    }
  
    let weeks = Math.floor(distance / week);
    let days = Math.floor((distance % week)/day);
    let hours = Math.floor((distance % day) / hour);
    let minutes = Math.floor((distance % hour) / minute);
    let seconds = Math.floor((distance % minute) / second);
  
  
    let between = [];

    between.push(weeks);
    between.push(days);
    between.push(hours);
    between.push(minutes);
    between.push(seconds);
    return between;
  }
  
  module.exports = DateBetween;