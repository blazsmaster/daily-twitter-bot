import chalk from 'chalk';
import moment from 'moment';

type LoggerLevel = 'error' | 'info' | 'proc' | 'warn'; // logger levels

// custom logger with chalk
export default function Logger(level: LoggerLevel, value: string) {
  const timestamp = chalk.bgWhite.black(
    padding(moment().format('DD/MM HH:mm:ss'), 1)
  );
  switch (level) {
    case 'info':
      console.log(
        timestamp + chalk.bgGreen.black(center('info', 8)),
        chalk.white(value)
      );
      break;
    case 'proc':
      console.log(
        timestamp + chalk.bgCyan.black(center('proc', 8)),
        chalk.white(value)
      );
      break;
    case 'error':
      console.log(
        timestamp + chalk.bgRed.black(center('error', 8)),
        chalk.white(value)
      );
      break;
    case 'warn':
      console.log(
        timestamp + chalk.bgYellow.black(center('warn', 8)),
        chalk.white(value)
      );
      break;
  }
}

// center text
function center(text: string, length: number) {
  if (text.length < length)
    return (
      ' '.repeat(Math.floor((length - text.length) / 2)) +
      text +
      ' '.repeat(Math.ceil((length - text.length) / 2))
    );
  else return text;
}

// add padding to text
function padding(text: string, size: number) {
  return ' '.repeat(size) + text + ' '.repeat(size);
}
