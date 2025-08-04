type HomeProps = {
    message: string,
  }
  
  const Home = ({ message }: HomeProps) => (
    <div>{message}</div>
  );
  
  export default Home;