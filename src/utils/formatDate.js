import moment from 'moment/min/moment-with-locales';

moment.locale('ru');

const formatDate = (date, dateFormat) => moment(date).format(dateFormat);

export default formatDate;
