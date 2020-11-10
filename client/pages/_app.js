import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client'; 

import Header from '../components/Header';

const AppComponent = ({Component, pageProps, currentUser}) => {

    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className="container">
            <Component currentUser={currentUser} {...pageProps} />   
            </div>
        </div>
    )
}



export default AppComponent;

AppComponent.getInitialProps = async appContext => {
    
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    console.log('app')
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);
    }
  
    return {
        pageProps,
        ...data
      };
  };
  
  