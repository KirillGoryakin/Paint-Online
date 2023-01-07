import src from 'assets/gif/spinner.gif';

const Spinner: React.FC<any> = (props) =>
  <img
    src={src}
    alt='Loading...'
    {...props}
  />

export { Spinner };