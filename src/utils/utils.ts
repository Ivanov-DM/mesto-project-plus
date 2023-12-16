import URL_REGEX from './constants';

const validateUrl = (value: string) => URL_REGEX.test(value);

export default validateUrl;
