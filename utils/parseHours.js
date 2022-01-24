import moment from "moment";
//import _ from "lodash/fp/__.js";
import _ from "lodash";

export const buildOpeningHours = (opening_hours) => {
    let days = opening_hours.split(/[,/]+/);
    let edgeCase = [];

    // check for days without hours
    let hours = days.map((day, index, originalArr) => {
        // split to find out if it contains only a day
        let check = day.trim().split(" ");
        if (check.length <= 1) {
            // take the next element in the array index since it has it's own time
            // and use it
            const nextTime = originalArr[index + 1].split(" ");
            nextTime.shift();
            let timeStr = nextTime.join(" ")

            let indvTimes = timeStr.split(/[-]+/)
            let opens_at = moment(indvTimes[0], "LT", "HH:mm:ss");
            let closes_at = moment(indvTimes[1], "LT", "HH:mm:ss");
            opens_at = moment(opens_at).toDate();
            closes_at = moment(closes_at).toDate();
            //console.log(nextTime);

            return {
                day: check[0],
                opens_at: opens_at,
                closes_at: closes_at
            }
        }

        // if it crosses two days
        if(check.length == 8 ) {
            // pop the days  from check
            let opens_at = check[3] + check[4];
            opens_at = moment(opens_at, "LT", "HH:mm:ss")
            opens_at = moment(opens_at).toDate()

            let closes_at = check[6] + check[7];
            closes_at = moment(closes_at, "LT", "HH:mm:ss")
            closes_at = moment(closes_at).toDate()
            let firstDay = {
                day: check[0],
                opens_at: opens_at,
                closes_at: moment().endOf('day').toDate()
            };

            let secondDay = {
                day: check[2],
                opens_at: moment().startOf('day').toDate(),
                closes_at: closes_at
            };

            // push to edgeCase array
            edgeCase.push(firstDay);
            edgeCase.push(secondDay);

            return;
        }

        // for non single days
        // indvTimes = timeStr.split(/[-]+/);
        // the day is at the second index because of the white space at the begining when splitting
        let oneDay;
        oneDay = check[0];

        let timeSTR = check.join(" ");

        let sepTimes = timeSTR.split(/[-]+/)
        let opens_at = moment(sepTimes[0], "LT", "HH:mm:ss");
        let closes_at = moment(sepTimes[1], "LT", "HH:mm:ss");
        opens_at = moment(opens_at).toDate();
        closes_at = moment(closes_at).toDate();
        return {
            day: oneDay,
            opens_at: opens_at,
            closes_at: closes_at
        }
    });

    hours.push(...edgeCase);

    // remove falsey values
    hours = _.compact(hours);

    return hours;
}